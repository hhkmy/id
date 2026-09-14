import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const LOCK_FILE = path.join(process.cwd(), "package-lock.json");

// Banned copyleft / viral license patterns that violate compliance
const BANNED_PATTERNS = [
  /\bAGPL\b/i,
  /\bLGPL\b/i,
  /\bGPL\b/i,
  /\bSSPL\b/i,
  /\bEUPL\b/i,
];

// Permitted license types
const ALLOWED_LICENSES = new Set([
  "MIT",
  "ISC",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "CC0-1.0",
  "CC-BY-4.0",
  "Unlicense",
  "BlueOak-1.0.0",
  "MPL-2.0",
  "EPL-2.0",
  "(MPL-2.0 OR Apache-2.0)",
  "0BSD",
]);

/**
 * Normalizes a license field from package.json or package-lock.json.
 * @param {string|object|Array} license
 * @returns {string}
 */
function normalizeLicense(license) {
  if (!license) return "UNKNOWN";
  if (typeof license === "string") return license.trim();
  if (Array.isArray(license)) {
    return license.map((l) => (typeof l === "string" ? l : l.type || "")).filter(Boolean).join(" OR ");
  }
  if (typeof license === "object" && license.type) {
    return String(license.type).trim();
  }
  return "UNKNOWN";
}

/**
 * Audits all installed dependencies for license compliance.
 */
function auditLicenses() {
  if (!existsSync(LOCK_FILE)) {
    console.error("[license-check] Error: package-lock.json not found.");
    process.exit(1);
  }

  const lockData = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  const packages = lockData.packages || {};
  const violations = [];
  const licenseCounts = new Map();

  for (const [pkgPath, pkgInfo] of Object.entries(packages)) {
    // Skip the root package itself
    if (!pkgPath || pkgPath === "") continue;

    const pkgName = pkgPath.replace(/^node_modules\//, "");
    const rawLicense = pkgInfo.license;
    const license = normalizeLicense(rawLicense);

    // Track license frequency
    licenseCounts.set(license, (licenseCounts.get(license) || 0) + 1);

    // Check for banned copyleft licenses
    const isBanned = BANNED_PATTERNS.some((pattern) => pattern.test(license));
    const isAllowed = ALLOWED_LICENSES.has(license) || license.startsWith("MIT");

    if (isBanned || (!isAllowed && license !== "UNKNOWN")) {
      violations.push({
        name: pkgName,
        version: pkgInfo.version || "unknown",
        license,
      });
    }
  }

  console.log("\n========================================================");
  console.log("📜 License Compliance Audit");
  console.log("========================================================");

  for (const [lic, count] of licenseCounts.entries()) {
    console.log(" • %s: %d package(s)", lic, count);
  }

  if (violations.length > 0) {
    console.error("\n❌ Found %d non-compliant package(s):", violations.length);
    for (const v of violations) {
      console.error(" 🚨 %s@%s -> License: %s (Violates compliance policy)", v.name, v.version, v.license);
    }
    console.error("\nAction required: Replace or remove the violating package(s) before committing.\n");
    process.exit(1);
  }

  console.log("\n🎉 Zero license compliance issues! All packages satisfy license policies.\n");
}

auditLicenses();
