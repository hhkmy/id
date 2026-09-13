import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const PROJECT_KEY = "hhkmy_id";
const CURL_BIN = existsSync("/usr/bin/curl") ? "/usr/bin/curl" : "/bin/curl";

/**
 * Executes an IPv4-safe GET request to the SonarCloud API.
 * @param {string} endpoint
 * @returns {object|null}
 */
function querySonarApi(endpoint) {
  const token = process.env.SONAR_TOKEN;
  if (!token) return null;

  try {
    const out = execFileSync(
      CURL_BIN,
      ["--ipv4", "-s", "--connect-timeout", "10", "-u", `${token}:`, `https://sonarcloud.io/api/${endpoint}`],
      { encoding: "utf8" },
    );
    return JSON.parse(out);
  } catch {
    return null;
  }
}

/**
 * Displays the current SonarCloud Quality Gate status.
 */
function printQualityGate() {
  const qgData = querySonarApi(`qualitygates/project_status?projectKey=${PROJECT_KEY}`);
  const qgStatus = qgData?.projectStatus?.status || "UNKNOWN";
  const isPassed = qgStatus === "OK";

  console.log("\n========================================================");
  console.log("🚦 SonarCloud Quality Gate: %s", isPassed ? "PASSED (OK)" : `FAILED (${qgStatus})`);
  console.log("========================================================");

  if (!qgData?.projectStatus?.conditions) return;

  for (const cond of qgData.projectStatus.conditions) {
    if (cond.status !== "OK") {
      const metric = String(cond.metricKey || "").replace(/[\r\n]/g, "");
      const actual = String(cond.actualValue || "").replace(/[\r\n]/g, "");
      const threshold = String(cond.errorThreshold || "").replace(/[\r\n]/g, "");
      console.log(" ⚠️  Condition Failed: %s (Actual: %s | Threshold: %s)", metric, actual, threshold);
    }
  }
}

/**
 * Displays the list of open issues from SonarCloud.
 */
function printIssuesList() {
  const issuesData = querySonarApi(`issues/search?componentKeys=${PROJECT_KEY}&resolved=false&ps=100`);
  const rawIssues = Array.isArray(issuesData?.issues) ? issuesData.issues : [];
  const totalCount = rawIssues.length;

  console.log("\n📡 Open Issues: %d", Math.max(0, Number(totalCount) || 0));

  if (totalCount === 0) {
    console.log("🎉 Zero open issues! Code is 100% clean.\n");
    return;
  }

  for (const issue of rawIssues) {
    const file = String(issue.component || "").replace(`${PROJECT_KEY}:`, "").replace(/[\r\n]/g, "");
    const line = issue.line ? `:${Math.max(0, Number(issue.line) || 0)}` : "";
    const severity = String(issue.severity || "INFO").replace(/[\r\n]/g, "");
    const rule = String(issue.rule || "").replace(/[\r\n]/g, "");
    const message = String(issue.message || "").replace(/[\r\n]/g, "");
    console.log(" • [%s] [%s]\n   %s%s\n   ➜ %s\n", severity, rule, file, line, message);
  }
}

/**
 * Entrypoint for reporting SonarCloud status.
 */
function printSonarStatus() {
  if (!process.env.SONAR_TOKEN) {
    console.warn("\n[sonar] SONAR_TOKEN not found in environment. Skipping remote check.");
    return;
  }

  printQualityGate();
  printIssuesList();
  console.log("Dashboard: https://sonarcloud.io/dashboard?id=%s\n", PROJECT_KEY);
}

// If --issues or -i passed, skip scanner and directly print issues
if (process.argv.includes("--issues") || process.argv.includes("-i")) {
  printSonarStatus();
  process.exit(0);
}

const localJs = path.join(process.cwd(), "node_modules", "sonarqube-scanner", "bin", "sonar-scanner.js");
const executable = existsSync(localJs) ? process.execPath : "npx";
const args = existsSync(localJs)
  ? [localJs, ...process.argv.slice(2)]
  : ["--yes", "sonarqube-scanner", ...process.argv.slice(2)];

const child = spawn(
  executable,
  args,
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", async (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  if (code === 0) {
    console.log("\n[sonar] Analysis uploaded. Waiting 6s for SonarCloud server processing...");
    await new Promise((resolve) => setTimeout(resolve, 6000));
    printSonarStatus();
  }

  process.exit(code ?? 0);
});
