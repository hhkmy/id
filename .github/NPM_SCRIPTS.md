# Project NPM Scripts Guide

This document provides a comprehensive reference for all `npm` scripts configured in [`package.json`](../package.json).

---

### Table of Contents
- [1. Development & Local Servers](#1-development--local-servers)
- [2. Production Build & Search Indexing](#2-production-build--search-indexing)
- [3. Code Quality, Security & License Compliance](#3-code-quality-security--license-compliance)
- [4. Telegram Premium Emoji & KV Synchronization](#4-telegram-premium-emoji--kv-synchronization)
- [5. Performance & Lighthouse Audits](#5-performance--lighthouse-audits)
- [6. Cloudflare Deployment & Versioning](#6-cloudflare-deployment--versioning)
- [7. Code Formatting & Git Hooks](#7-code-formatting--git-hooks)

---

### 1. Development & Local Servers

#### `npm run dev` / `npm run watch:hugo`
- **Command:** `hugo server --disableFastRender`
- **Purpose:** Starts the local Hugo development server with live reloading enabled.
- **Notes:** `--disableFastRender` ensures full page reconstruction on edits so templates, taxonomy pages, and CSS changes reflect accurately.

#### `npm run dev:worker`
- **Command:** `NODE_OPTIONS="--dns-result-order=ipv4first" npx wrangler dev`
- **Purpose:** Starts the local Cloudflare Worker development environment using Wrangler.
- **Notes:** Sets IPv4-first DNS resolution to avoid IPv6 connection issues with Cloudflare APIs and bindings.

---

### 2. Production Build & Search Indexing

#### `npm run build`
- **Command:** `hugo --gc --minify`
- **Purpose:** Compiles the static site into `public/`. Runs garbage collection on unused cache items and minifies HTML, XML, JSON, and CSS output.
- **Triggers:** Automatically runs `npm run postbuild` afterwards.

#### `npm run postbuild` / `npm run pagefind`
- **Command:** `pagefind --site "public"`
- **Purpose:** Generates static search indexes from compiled HTML pages in `public/`.
- **Notes:** Inspects elements with `data-pagefind-body` to index article content, headings, and metadata without bloating index size.

#### `npm run build:search`
- **Command:** `npm run build`
- **Purpose:** Alias to trigger a full Hugo compilation followed by Pagefind search indexing.

---

### 3. Code Quality, Security & License Compliance

#### `npm run check:licenses`
- **Command:** `node scripts/check-licenses.mjs`
- **Purpose:** 100% offline license compliance auditor. Scans `package-lock.json` and verifies that every direct and transitive dependency conforms to permissive open-source licenses (MIT, ISC, Apache-2.0, BSD).
- **Enforcement:** Rejects copyleft/viral licenses (GPL, LGPL, AGPL, SSPL) with an exit code `1`.

#### `npm run sonar:issues`
- **Command:** `node --dns-result-order=ipv4first --env-file-if-exists=.env scripts/sonar.mjs --issues`
- **Purpose:** Fast (<1s) terminal query against the SonarCloud REST API. Prints current Quality Gate status and all open issues directly in the console.

#### `npm run sonar`
- **Command:** `node --dns-result-order=ipv4first --env-file-if-exists=.env scripts/sonar.mjs`
- **Purpose:** Executes full SonarCloud static code analysis. Prefers globally installed `sonar-scanner-npm` (`@sonar/scan`) and falls back to `npx @sonar/scan` on-demand without registering copyleft scanner packages into `package.json`.

#### `npm run fossa`
- **Command:** `node --env-file-if-exists=.env scripts/fossa.mjs`
- **Purpose:** Runs FOSSA dependency analysis and uploads scan data to the FOSSA cloud dashboard (`app.fossa.com`), followed by policy evaluation test. Reads `FOSSA_API_KEY` from `.env`.

#### `npm run fossa:test`
- **Command:** `node --env-file-if-exists=.env scripts/fossa.mjs test`
- **Purpose:** Verifies that the most recent FOSSA project scan passes all license compliance policies and security vulnerability gates.

#### `npm run fossa:offline`
- **Command:** `node scripts/fossa.mjs analyze --output`
- **Purpose:** 100% offline dependency graph inspection. Extracts the dependency tree directly from package manifests and outputs JSON to the console without contacting the FOSSA server.

---

### 4. Telegram Premium Emoji & KV Synchronization

#### `npm run emoji:download`
- **Command:** `node scripts/sync-emoji.mjs`
- **Purpose:** Checks local `.tgs` animated sticker assets and downloads any missing premium emojis from the Telegram Bot API.

#### `npm run emoji:sync`
- **Command:** `node scripts/sync-emoji.mjs --all`
- **Purpose:** Runs local offline-first validation and uploads missing base64 emoji payloads into the Cloudflare KV `SHOP_DATA` namespace.

#### `npm run emoji:upload`
- **Command:** `node scripts/sync-emoji.mjs --all --upload-all`
- **Purpose:** Forces a full re-upload of all cached Telegram premium emojis to Cloudflare KV.

#### `npm run kv:sync:services`
- **Command:** `node scripts/sync-kv-services.mjs`
- **Purpose:** Synchronizes shop services metadata into Cloudflare KV.

#### `npm run kv:sync`
- **Command:** `npm run kv:sync:services && npm run emoji:sync`
- **Purpose:** Full one-shot synchronization of all shop services and premium emoji assets to Cloudflare KV.

---

### 5. Performance & Lighthouse Audits

#### `npm run lighthouse:pages`
- **Command:** `node scripts/lighthouse-pages.mjs --site https://hhk.my.id`
- **Purpose:** Audits all site pages against Google Lighthouse and generates score datasets for the `/lighthouse/` dashboard.

#### `npm run lighthouse:pages:sample`
- **Command:** `node scripts/lighthouse-pages.mjs --site https://hhk.my.id --limit 5`
- **Purpose:** Fast sample audit of 5 representative pages for quick performance health checks.

---

### 6. Cloudflare Deployment & Versioning

#### `npm run deploy:cloudflare`
- **Command:** `npx --ignore-scripts -y wrangler@4.131.1 deploy`
- **Purpose:** Builds and deploys the Cloudflare Worker and static assets (`public/`) to production.

#### `npm run deploy:cloudflare:ci`
- **Command:** `npm ci --ignore-scripts && npx --ignore-scripts -y wrangler@4.131.1 deploy`
- **Purpose:** Clean, reproducible CI deployment with frozen lockfile installation.

#### `npm run deploy:cloudflare:version`
- **Command:** `npx ... versions upload && npx ... versions deploy -y && npx ... triggers deploy`
- **Purpose:** Deploys a new versioned release on Cloudflare Workers with explicit version tracking and trigger association.

#### `npm run deploy:cloudflare:version:ci`
- **Command:** `npm ci --ignore-scripts && npm run deploy:cloudflare:version`
- **Purpose:** Automated CI versioned release pipeline.

---

### 7. Code Formatting & Git Hooks

#### `npm run format`
- **Command:** `prettier --write "**/*.{html,js,json,css,md}"`
- **Purpose:** Formats all templates, scripts, stylesheets, and markdown files using project Prettier rules.

#### `npm run precommit`
- **Command:** `lint-staged && npm run check:licenses && npm run build`
- **Purpose:** Comprehensive offline pre-commit verification pipeline executed automatically on `git commit`:
  1. Formats staged files with Prettier (`lint-staged`).
  2. Audits dependency licenses for copyleft violations (`check:licenses`).
  3. Validates Hugo compilation and Pagefind search indexing (`build`).
- **Guarantee:** If any step fails, the commit is aborted immediately before changes are written.
