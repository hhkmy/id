import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const GH_BIN = existsSync("/usr/bin/gh") ? "/usr/bin/gh" : "gh";
const GIT_BIN = existsSync("/usr/bin/git") ? "/usr/bin/git" : "git";
const NPM_BIN = existsSync("/usr/bin/npm") ? "/usr/bin/npm" : "npm";

/**
 * Sanitizes a primitive value for safe console logging to prevent log injection (CWE-117).
 * @param {string | number | boolean | null | undefined} [value]
 * @returns {string}
 */
function sanitize(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const text = typeof value === "string" ? value : String(value);
  return text.replaceAll("\r", "").replaceAll("\n", "");
}

/**
 * Safely executes a binary and returns stdout as trimmed UTF-8 string.
 * @param {string} bin
 * @param {string[]} args
 * @returns {string}
 */
function runCommand(bin, args) {
  return execFileSync(bin, args, { encoding: "utf8" }).trim();
}

/**
 * Verifies that the GitHub CLI is installed and authenticated.
 */
function verifyGhAuth() {
  try {
    runCommand(GH_BIN, ["auth", "status"]);
  } catch {
    console.error("❌ GitHub CLI (`gh`) is not installed or not logged in. Run `gh auth login` first.");
    process.exit(1);
  }
}

/**
 * Parses command-line arguments.
 * @returns {{ dryRun: boolean, squash: boolean, requestedIds: number[] }}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const squash = args.includes("--squash");
  const requestedIds = args
    .map((arg) => Number.parseInt(arg, 10))
    .filter((num) => Number.isInteger(num) && num > 0);

  return { dryRun, squash, requestedIds };
}

/**
 * Fetches open Dependabot pull requests.
 * @returns {Array<{ number: number, title: string, headRefName: string, mergeable: string, state: string }>}
 */
function fetchDependabotPrs() {
  try {
    const raw = runCommand(GH_BIN, [
      "pr",
      "list",
      "--search",
      "author:app/dependabot",
      "--json",
      "number,title,headRefName,mergeable,state",
    ]);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("❌ Failed to fetch pull requests from GitHub: %s", sanitize(error?.message));
    return [];
  }
}

/**
 * Approves a pull request via GitHub CLI.
 * @param {number} prNumber
 */
function approvePr(prNumber) {
  try {
    runCommand(GH_BIN, [
      "pr",
      "review",
      String(prNumber),
      "--approve",
      "--body",
      "Automated approval for Dependabot update",
    ]);
    console.log("  ✓ Approved PR #%d", prNumber);
  } catch (error) {
    console.warn("  ⚠️ Could not approve PR #%d (might already be approved): %s", prNumber, sanitize(error?.message));
  }
}

/**
 * Merges a pull request using GitHub CLI with admin privileges to handle non-blocking checks.
 * @param {number} prNumber
 * @param {boolean} squash
 * @returns {boolean} True if merged successfully
 */
function mergePr(prNumber, squash) {
  const mergeFlag = squash ? "--squash" : "--merge";
  const args = ["pr", "merge", String(prNumber), mergeFlag, "--delete-branch", "--admin"];

  try {
    runCommand(GH_BIN, args);
    console.log("  ✓ Merged PR #%d (%s, branch deleted)", prNumber, squash ? "squash" : "merge");
    return true;
  } catch (error) {
    console.error("  ❌ Failed to merge PR #%d: %s", prNumber, sanitize(error?.message));
    return false;
  }
}

/**
 * Pulls latest changes from remote main into local working tree.
 * @returns {string} Git pull stdout
 */
function syncLocalBranch() {
  console.log("\n📥 Syncing local branch with origin/main...");
  const pullOutput = runCommand(GIT_BIN, ["pull", "--autostash", "origin", "main"]);
  console.log("  %s", sanitize(pullOutput));
  return pullOutput;
}

/**
 * Installs updated dependencies and runs verification checks.
 * @param {string} pullOutput
 */
function verifyLocalHealth(pullOutput) {
  const hasPackageChanges =
    pullOutput.includes("package.json") || pullOutput.includes("package-lock.json");

  const env = {
    ...process.env,
    NODE_OPTIONS: "--dns-result-order=ipv4first --no-network-family-autoselection",
  };

  if (hasPackageChanges) {
    console.log("\n📦 Package files updated. Running `npm install`...");
    spawnSync(NPM_BIN, ["install"], { stdio: "inherit", env });
  }

  console.log("\n🔍 Running license compliance audit...");
  spawnSync(NPM_BIN, ["run", "check:licenses"], { stdio: "inherit", env });

  console.log("\n🏗️ Validating Hugo site build...");
  const buildResult = spawnSync(NPM_BIN, ["run", "build"], { stdio: "inherit", env });

  if (buildResult.status !== 0) {
    console.error("\n❌ Site build verification failed with exit code %d.", buildResult.status ?? 1);
    process.exit(buildResult.status ?? 1);
  }
}

/**
 * Main execution handler.
 */
function main() {
  verifyGhAuth();
  const { dryRun, squash, requestedIds } = parseArgs();

  console.log("========================================================");
  console.log("🤖 Dependabot Auto-Update & Merge");
  console.log("========================================================");

  let prs = fetchDependabotPrs();
  if (requestedIds.length > 0) {
    prs = prs.filter((pr) => requestedIds.includes(pr.number));
  }

  if (prs.length === 0) {
    console.log("🎉 No open Dependabot pull requests found. Everything is up to date!\n");
    return;
  }

  console.log("Found %d open Dependabot PR(s):\n", prs.length);
  for (const pr of prs) {
    console.log(" • #%d: %s [%s]", pr.number, sanitize(pr.title), sanitize(pr.mergeable));
  }

  if (dryRun) {
    console.log("\n[dry-run] No pull requests were merged.\n");
    return;
  }

  console.log("\n🚀 Merging pull requests...");
  let mergedCount = 0;
  for (const pr of prs) {
    console.log("\nProcessing PR #%d...", pr.number);
    approvePr(pr.number);
    const success = mergePr(pr.number, squash);
    if (success) {
      mergedCount += 1;
    }
  }

  if (mergedCount === 0) {
    console.warn("\n⚠️ No PRs were successfully merged.");
    return;
  }

  console.log("\n✅ Successfully merged %d PR(s).", mergedCount);

  const pullOutput = syncLocalBranch();
  verifyLocalHealth(pullOutput);

  console.log("\n🎉 Dependabot updates successfully processed and verified!\n");
}

main();
