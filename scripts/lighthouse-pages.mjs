import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (!arg.startsWith("--")) continue;

  const [key, inlineValue] = arg.slice(2).split("=", 2);
  const value =
    inlineValue ??
    (process.argv[i + 1]?.startsWith("--") ? "true" : process.argv[++i]);
  args.set(key, value ?? "true");
}

const site = args.get("site") ?? "https://hhk.my.id";
const sitemapPath = args.get("sitemap") ?? "public/sitemap.xml";
const outputPath = args.get("output") ?? "data/lighthouse.json";
const limit = Number(args.get("limit") ?? 0);
const includePattern = args.get("include")
  ? new RegExp(args.get("include"))
  : null;
const chromeFlags = args.get("chrome-flags") ?? "--headless=new --no-sandbox";
const timeoutMs = Number(args.get("timeout-ms") ?? 120000);
const excludePattern = args.get("exclude")
  ? new RegExp(args.get("exclude"))
  : /^(?:\/lighthouse\/?|\/tags(?:\/.*)?)$/;
const tmpRoot = await mkdir(path.join(tmpdir(), "hhk-lighthouse"), {
  recursive: true,
}).then(() => path.join(tmpdir(), "hhk-lighthouse"));

function normalizeUrl(url) {
  const target = new URL(url);
  if (!site) return target.href;

  const base = new URL(site);
  target.protocol = base.protocol;
  target.host = base.host;
  return target.href;
}

function score(category) {
  if (!category || typeof category.score !== "number") return null;
  return Math.round(category.score * 100);
}

function numericAudit(audit) {
  if (!audit || typeof audit.numericValue !== "number") return null;
  return Math.round(audit.numericValue * 100) / 100;
}

function averageScore(scores) {
  const values = Object.values(scores).filter(
    (value) => typeof value === "number",
  );
  if (!values.length) return null;
  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function run(command, commandArgs, timeout) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(
        new Error(
          `Timed out after ${timeout}ms: ${command} ${commandArgs.join(" ")}`,
        ),
      );
    }, timeout);

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(stderr || stdout || `Command failed with exit code ${code}`),
      );
    });
  });
}

async function auditUrl(url, index) {
  const reportPath = path.join(tmpRoot, `report-${index}.json`);
  const commandArgs = [
    "--yes",
    "lighthouse",
    url,
    "--quiet",
    "--output=json",
    `--output-path=${reportPath}`,
    `--chrome-flags=${chromeFlags}`,
    "--only-categories=performance,accessibility,best-practices,seo",
  ];

  await run("npx", commandArgs, timeoutMs);
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  await rm(reportPath, { force: true });

  const scores = {
    performance: score(report.categories.performance),
    accessibility: score(report.categories.accessibility),
    bestPractices: score(report.categories["best-practices"]),
    seo: score(report.categories.seo),
  };

  const failedAudits = Object.entries(report.audits)
    .filter(
      ([, audit]) =>
        audit.score !== null &&
        audit.score < 1 &&
        audit.scoreDisplayMode !== "notApplicable",
    )
    .map(([id, audit]) => ({
      id,
      title: audit.title,
      score: audit.score,
      displayValue: audit.displayValue ?? "",
    }))
    .slice(0, 12);

  return {
    url,
    path: new URL(url).pathname,
    title: report.finalDisplayedUrl,
    average: averageScore(scores),
    scores,
    metrics: {
      firstContentfulPaint: numericAudit(
        report.audits["first-contentful-paint"],
      ),
      largestContentfulPaint: numericAudit(
        report.audits["largest-contentful-paint"],
      ),
      speedIndex: numericAudit(report.audits["speed-index"]),
      totalBlockingTime: numericAudit(report.audits["total-blocking-time"]),
      cumulativeLayoutShift: numericAudit(
        report.audits["cumulative-layout-shift"],
      ),
    },
    failedAudits,
  };
}

function summarize(pages) {
  const categoryKeys = ["performance", "accessibility", "bestPractices", "seo"];
  const averages = Object.fromEntries(
    categoryKeys.map((key) => {
      const values = pages
        .map((page) => page.scores[key])
        .filter((value) => typeof value === "number");
      return [
        key,
        values.length
          ? Math.round(
              values.reduce((total, value) => total + value, 0) / values.length,
            )
          : null,
      ];
    }),
  );

  return {
    pagesAudited: pages.length,
    averages,
    weakestPages: pages.slice(0, 10).map((page) => ({
      path: page.path,
      average: page.average,
      scores: page.scores,
    })),
  };
}

const sitemap = await readFile(sitemapPath, "utf8");
let urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
  normalizeUrl(match[1]),
);
urls = [...new Set(urls)];
if (includePattern) urls = urls.filter((url) => includePattern.test(url));
if (excludePattern)
  urls = urls.filter((url) => !excludePattern.test(new URL(url).pathname));
if (limit > 0) urls = urls.slice(0, limit);

if (!urls.length) {
  throw new Error(`No URLs found in ${sitemapPath}`);
}

const pages = [];
for (const [index, url] of urls.entries()) {
  console.log(`[${index + 1}/${urls.length}] Auditing ${url}`);
  try {
    pages.push(await auditUrl(url, index));
  } catch (error) {
    pages.push({
      url,
      path: new URL(url).pathname,
      average: null,
      scores: {
        performance: null,
        accessibility: null,
        bestPractices: null,
        seo: null,
      },
      metrics: {},
      failedAudits: [],
      error: error.message,
    });
  }
}

pages.sort((a, b) => (a.average ?? -1) - (b.average ?? -1));

const output = {
  generatedAt: new Date().toISOString(),
  source: site,
  summary: summarize(pages.filter((page) => page.average !== null)),
  pages,
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${outputPath} with ${pages.length} page reports.`);
