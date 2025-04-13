const fs = require("fs");
const path = require("path");

function formatTOML(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // ReDoS-safe regex: Uses non-backtracking patterns
  content = content.replace(
    /^([ \t]+)([a-zA-Z0-9_]+)[ \t]*=[ \t]*/gm,
    "    $2 = ",
  );

  fs.writeFileSync(filePath, content);
}

// Process TOML files (safely limit input size)
const MAX_FILE_SIZE = 1_000_000; // 1MB
const tomlFiles = process.argv.slice(2);

tomlFiles.forEach((file) => {
  try {
    const stats = fs.statSync(file);
    if (stats.size > MAX_FILE_SIZE) {
      console.error(`Skipped: ${file} (exceeds ${MAX_FILE_SIZE} bytes)`);
      return;
    }

    if (fs.existsSync(file)) {
      formatTOML(file);
      console.log(`Formatted: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});
