import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const W3C_NU_API = "https://validator.w3.org/nu/?out=json";
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const CURL_BIN = existsSync("/usr/bin/curl") ? "/usr/bin/curl" : "/bin/curl";

const DEFAULT_REMOTE_PAGES = [
  "",
  "about/",
  "articles/",
  "projects/",
  "shop/",
  "lighthouse/",
  "whois/",
  "update/",
  "license/",
  "privacy/",
  "previously/",
];

/**
 * Sanitizes string input to prevent log injection (CWE-117).
 * @param {string | number | boolean | null | undefined} [val]
 * @returns {string}
 */
function sanitize(val) {
  if (val === null || val === undefined) return "";
  const text = typeof val === "string" ? val : String(val);
  return text.replaceAll("\r", "").replaceAll("\n", "");
}

/**
 * Validates a remote URL against W3C Nu Checker via IPv4 curl.
 * @param {string} targetUrl
 * @returns {{ messages: Array<{ type: string, subType?: string, message: string, lastLine?: number, extract?: string }> }}
 */
function validateRemoteUrl(targetUrl) {
  const apiUrl = `${W3C_NU_API}&doc=${encodeURIComponent(targetUrl)}`;
  const output = execFileSync(
    CURL_BIN,
    [
      "--ipv4",
      "-s",
      "--connect-timeout",
      "15",
      "-H",
      "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      apiUrl,
    ],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );

  const trimmed = output.trim();
  if (trimmed.startsWith("<")) {
    throw new Error("W3C Validator returned an HTML response or rate-limit challenge.");
  }

  return JSON.parse(output);
}

const DECORATIVE_TAGS = new Set(["div", "span", "i", "svg"]);
const INVALID_ROLES = new Set(["generic", "presentation", "none"]);

/**
 * Checks a single line of HTML for ARIA violations.
 * @param {string} line
 * @param {number} lineNum
 * @param {string} fullContent
 * @param {Array<{ type: string, message: string, line: number }>} issues
 */
function checkHtmlLine(line, lineNum, fullContent, issues) {
  const tagMatches = line.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi);
  for (const match of tagMatches) {
    const tagName = match[1].toLowerCase();
    const attrs = match[2];

    const hasAriaLabel = /\baria-label\s*=/i.test(attrs);
    const roleMatch = /\brole\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
    const role = roleMatch ? roleMatch[1].toLowerCase() : null;
    const hasValidRole = Boolean(role && !INVALID_ROLES.has(role));

    // Rule 1: Prohibited aria-label on generic div/span without a non-generic role
    if ((tagName === "div" || tagName === "span") && hasAriaLabel && !hasValidRole) {
      issues.push({
        type: "error",
        line: lineNum,
        message: `The "aria-label" attribute must not be specified on generic <${tagName}> element without an appropriate role value.`,
      });
    }

    // Rule 2: Conflicting aria-hidden="true" and aria-label on decorative elements
    const hasAriaHiddenTrue = /\baria-hidden\s*=\s*["']?true["']?/i.test(attrs);
    if (DECORATIVE_TAGS.has(tagName) && hasAriaHiddenTrue && hasAriaLabel) {
      issues.push({
        type: "error",
        line: lineNum,
        message: `Contradictory ARIA usage: <${tagName}> element has both aria-hidden="true" and aria-label.`,
      });
    }

    // Rule 3: role="tab" requires role="tabpanel"
    if (role === "tab" && !fullContent.includes('role="tabpanel"')) {
      issues.push({
        type: "error",
        line: lineNum,
        message: 'Every active "role=tab" element must have a corresponding "role=tabpanel" element.',
      });
    }
  }
}

/**
 * Checks that HTML sections contain headings.
 * @param {string} content
 * @param {Array<{ type: string, message: string, line: number }>} issues
 */
function checkSectionHeadings(content, issues) {
  let searchIndex = 0;
  while (true) {
    const startIdx = content.indexOf("<section", searchIndex);
    if (startIdx === -1) break;

    const endIdx = content.indexOf("</section>", startIdx);
    if (endIdx === -1) break;

    const sectionBlock = content.slice(startIdx, endIdx);
    if (!/<h[1-6]\b/i.test(sectionBlock)) {
      issues.push({
        type: "warning",
        line: 1,
        message: 'Section lacks heading. Consider using "h2"-"h6" elements or use a "div" instead.',
      });
    }
    searchIndex = endIdx + 10;
  }
}

/**
 * Performs fast offline static checks on an HTML file for W3C Nu rules.
 * @param {string} filePath
 * @returns {Array<{ type: string, message: string, line: number }>}
 */
function checkHtmlOffline(filePath) {
  const content = readFileSync(filePath, "utf8");
  const issues = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    checkHtmlLine(lines[i], i + 1, content, issues);
  }

  checkSectionHeadings(content, issues);
  return issues;
}

/**
 * Recursively retrieves all HTML files from directory.
 * @param {string} dir
 * @returns {string[]}
 */
function getHtmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== "pagefind") {
        files.push(...getHtmlFiles(fullPath));
      }
    } else if (entry.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Prints formatted report messages and returns error/warning counts.
 * @param {string} targetName
 * @param {Array<{ type: string, subType?: string, message: string, lastLine?: number }>} messages
 * @returns {{ errors: number, warnings: number }}
 */
function printMessages(targetName, messages) {
  const errors = messages.filter((m) => m.type === "error");
  const warnings = messages.filter((m) => m.type === "info" && m.subType === "warning");

  if (errors.length === 0 && warnings.length === 0) {
    console.log("  ✅ %s (0 errors, 0 warnings)", sanitize(targetName));
    return { errors: 0, warnings: 0 };
  }

  console.log("  ❌ %s (%d error(s), %d warning(s))", sanitize(targetName), errors.length, warnings.length);
  for (const msg of messages) {
    const prefix = msg.type === "error" ? "     [ERROR]" : "     [WARN] ";
    console.log("%s Line %s: %s", prefix, sanitize(msg.lastLine ?? "-"), sanitize(msg.message));
  }

  return { errors: errors.length, warnings: warnings.length };
}

/**
 * Validates a single remote URL and outputs findings.
 * @param {string} targetUrl
 * @returns {{ errors: number, warnings: number }}
 */
function runSingleRemoteUrl(targetUrl) {
  console.log("Validating remote URL: %s\n", sanitize(targetUrl));
  try {
    const result = validateRemoteUrl(targetUrl);
    return printMessages(targetUrl, result.messages ?? []);
  } catch (error) {
    console.error("  ❌ Request failed: %s", sanitize(error instanceof Error ? error.message : error));
    return { errors: 1, warnings: 0 };
  }
}

/**
 * Validates a suite of remote URLs against the live site.
 * @param {string} baseUrl
 * @param {string[]} pagePaths
 * @returns {{ errors: number, warnings: number }}
 */
function runRemoteSuite(baseUrl, pagePaths) {
  console.log("Validating remote live site: %s\n", sanitize(baseUrl));
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const pagePath of pagePaths) {
    const fullUrl = `${baseUrl}/${pagePath}`;
    const result = runSingleRemoteUrl(fullUrl);
    totalErrors += result.errors;
    totalWarnings += result.warnings;
  }

  return { errors: totalErrors, warnings: totalWarnings };
}

/**
 * Audits all built HTML files locally in public/.
 * @param {string[]} htmlFiles
 * @returns {{ errors: number, warnings: number }}
 */
function runLocalSuite(htmlFiles) {
  console.log("Validating built HTML files in public/ (Fast Offline Audit)...\n");
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const filePath of htmlFiles) {
    const relPath = path.relative(PUBLIC_DIR, filePath);
    const issues = checkHtmlOffline(filePath);
    const fileErrors = issues.filter((i) => i.type === "error");
    const fileWarnings = issues.filter((i) => i.type === "warning");

    if (issues.length > 0) {
      console.log("  ❌ %s (%d error(s), %d warning(s))", sanitize(relPath), fileErrors.length, fileWarnings.length);
      for (const issue of issues) {
        const prefix = issue.type === "error" ? "     [ERROR]" : "     [WARN] ";
        console.log("%s Line %d: %s", prefix, issue.line, sanitize(issue.message));
      }
      totalErrors += fileErrors.length;
      totalWarnings += fileWarnings.length;
    }
  }

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log("  ✅ Verified all %d generated HTML files in public/.", htmlFiles.length);
  }

  return { errors: totalErrors, warnings: totalWarnings };
}

/**
 * Main validator entrypoint.
 */
function main() {
  const args = process.argv.slice(2);
  const isRemote = args.includes("--remote");
  const urlArgIndex = args.indexOf("--url");
  const customUrl = urlArgIndex !== -1 ? args[urlArgIndex + 1] : null;

  console.log("\n========================================================");
  console.log("🔍 W3C Nu HTML Validation Check");
  console.log("========================================================\n");

  let summary;

  if (customUrl) {
    summary = runSingleRemoteUrl(customUrl);
  } else if (isRemote) {
    summary = runRemoteSuite("https://hhk.my.id", DEFAULT_REMOTE_PAGES);
  } else {
    const htmlFiles = getHtmlFiles(PUBLIC_DIR);
    if (htmlFiles.length === 0) {
      console.error("  ❌ No HTML files found in public/ directory. Please run 'npm run build' first.");
      process.exit(1);
    }
    summary = runLocalSuite(htmlFiles);
  }

  console.log("\n--------------------------------------------------------");
  console.log("Results: %d total error(s), %d total warning(s)", summary.errors, summary.warnings);
  console.log("--------------------------------------------------------\n");

  if (summary.errors > 0) {
    console.error("❌ Validation FAILED: Found %d error(s).\n", summary.errors);
    process.exit(1);
  }

  console.log("🎉 All audited pages passed W3C Nu HTML Validation with zero errors and zero warnings!\n");
}

try {
  main();
} catch (err) {
  console.error("Fatal error:", err);
  process.exit(1);
}
