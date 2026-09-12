import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const NPX_PATHS = [
  "/usr/bin/npx",
  "/usr/local/bin/npx",
  "/opt/homebrew/bin/npx",
];

const npxBinary = NPX_PATHS.find((bin) => existsSync(bin)) || "/usr/bin/npx";

const child = spawn(
  npxBinary,
  ["--yes", "sonarqube-scanner", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS:
        `${process.env.NODE_OPTIONS || ""} --dns-result-order=ipv4first`.trim(),
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
