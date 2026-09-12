import { spawn } from "node:child_process";

const child = spawn(
  "npx",
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
