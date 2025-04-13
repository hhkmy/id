// format-toml.js
const fs = require("fs");
const path = require("path");

function formatTOML(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  // Implement simple 4-space indentation
  content = content.replace(/^(\s*)(\w+)\s*=\s*/gm, "    $2 = ");
  fs.writeFileSync(filePath, content);
}

// Process all TOML files
const tomlFiles = process.argv.slice(2);
tomlFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    formatTOML(file);
    console.log(`Formatted: ${file}`);
  }
});
