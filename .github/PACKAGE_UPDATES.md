# Package & Dependency Updates Guide

This guide describes how to inspect, update, and verify npm packages in this repository.

---

## 1. Checking Outdated Packages

Run the following command to check for outdated dependencies:

```bash
npm outdated
```

### Understanding the Output Columns

| Column | Description |
| :--- | :--- |
| **Package** | The dependency name. |
| **Current** | The version currently installed in `node_modules`. |
| **Wanted** | The highest version satisfying the range defined in `package.json`. |
| **Latest** | The latest version published to the npm registry (may include breaking changes). |
| **Location** | Where the package is installed in the dependency tree. |

---

## 2. Safe Updates (Minor & Patch Versions)

To update all packages to the highest version permitted by `package.json` semver constraints:

```bash
npm update
```

This updates both `node_modules` and `package-lock.json` safely without introducing breaking API changes.

---

## 3. Major Version & Interactive Upgrades

When upgrading beyond the current semver constraints (e.g. major releases with breaking changes):

### Option A: Interactive Upgrade with `npm-check-updates` (Recommended)

Use `npm-check-updates` (ncu) to view and selectively choose packages to upgrade:

```bash
# Interactive selection (When prompted to run npm install, choose No)
npx npm-check-updates -i

# Run npm install directly in your terminal
npm install
```

> **Note:** If `npx npm-check-updates` prompts *`Run npm install to install new versions?`*, select **`no`**, and then run `npm install` directly in your shell. This avoids `EALLOWSCRIPTS` conflicts with project-level script security settings.

Or update all dependencies in `package.json` at once:

```bash
npx npm-check-updates -u
npm install
```

### Option B: Upgrading Individual Packages

- **Production Dependencies**:
  ```bash
  npm install <package-name>@latest
  ```
- **Development Dependencies**:
  ```bash
  npm install -D <package-name>@latest
  ```

---

## 4. Repository Considerations

When updating packages in this repository, keep in mind:

- **Node Engine**: Node.js version is pinned in `.nvmrc` and `package.json` (`engines.node`). Ensure any updated tools support this runtime.
- **Styling & Assets**: Changes to Sass (`sass`), PostCSS (`postcss-cli`, `autoprefixer`), or Tailwind CSS (`tailwindcss`, `@tailwindcss/cli`) affect the Hugo asset pipeline. Always verify the Hugo build output.
- **Client-Side Scripts**: `animejs` and `clipboard` power site interactions. Ensure animation and copy functionality remain intact after updates.

---

## 5. Verification Steps

After updating dependencies, verify that the repository builds and formats cleanly:

```bash
# 1. Format and lint check
npm run format

# 2. Test Hugo build and Pagefind search index generation
npm run build

# 3. Optional: Verify local dev server
npm run watch:hugo
```

---

## 6. Commit Guidelines

Follow Conventional Commit guidelines for dependency updates:

```bash
# Minor/patch updates
git commit -m "chore(deps): update dependencies"

# Specific tool update
git commit -m "chore(deps): bump sass to 1.104.0"
```
