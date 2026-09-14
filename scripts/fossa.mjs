import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Loads FOSSA_API_KEY from .env if not already present in process.env.
 */
function loadEnvKey() {
  if (process.env.FOSSA_API_KEY) return;

  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  try {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("FOSSA_API_KEY=")) {
        const raw = trimmed.slice("FOSSA_API_KEY=".length).trim();
        process.env.FOSSA_API_KEY = raw.replace(/^["']|["']$/g, "");
        break;
      }
    }
  } catch {
    // Safely ignore missing or unreadable .env file
  }
}

/**
 * Resolves the absolute path to the fossa CLI binary.
 * @returns {string|null}
 */
function resolveFossaBin() {
  const candidates = [
    path.join(os.homedir(), ".local", "bin", "fossa"),
    "/usr/local/bin/fossa",
    "/usr/bin/fossa",
  ];

  for (const bin of candidates) {
    if (existsSync(bin)) return bin;
  }
  return null;
}

loadEnvKey();

const fossaBin = resolveFossaBin();
if (!fossaBin) {
  console.error(
    "❌ FOSSA CLI binary not found. Run installer or add it to ~/.local/bin/fossa",
  );
  process.exit(1);
}

const userArgs = process.argv.slice(2);
let args = userArgs;

// Default to running both analyze and test if no arguments provided
if (args.length === 0) {
  args = ["analyze"];
}

const child = spawn(fossaBin, args, {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  // If initial analyze succeeded and was the default run, follow up with test
  if (code === 0 && userArgs.length === 0 && process.env.FOSSA_API_KEY) {
    console.log("\n[fossa] Running compliance policy test...");
    const testChild = spawn(fossaBin, ["test"], {
      stdio: "inherit",
      env: process.env,
    });
    testChild.on("exit", (testCode) => {
      process.exit(testCode ?? 0);
    });
    return;
  }

  process.exit(code ?? 0);
});
