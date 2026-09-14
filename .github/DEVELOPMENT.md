# Development, Setup & Operations Guide

This guide covers local environment setup, configuration prerequisites, the development workflow, quality verification suites, and deployment operations for **HHK B/Vlog**.

---

### Table of Contents
- [1. Prerequisites](#1-prerequisites)
- [2. Environment Configuration](#2-environment-configuration)
- [3. Local Development Workflow](#3-local-development-workflow)
- [4. Quality Assurance & Compliance Verification](#4-quality-assurance--compliance-verification)
- [5. Production Build & Deployment](#5-production-build--deployment)
- [6. Companion Documentation](#6-companion-documentation)

---

### 1. Prerequisites

Before setting up the repository locally, ensure your machine satisfies the following version requirements:

| Component | Required Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 24.18.0` (LTS) | Package management, Tailwind v4 compiler, build scripts, and offline auditors |
| **Hugo Extended** | `>= 0.165.0` | High-performance static site compilation with Sass/PostProcess support |
| **Git** & **GitHub CLI** | Latest | Source code management, automated secret sync, and PR workflows |
| **Cloudflare Wrangler** | `^4.131.0` (npm) | Cloudflare Workers edge deployment, KV synchronization, and local testing |
| **FOSSA CLI** | `^3.18.0` *(Optional)* | Local license compliance scanning and offline dependency graph audits |

---

### 2. Environment Configuration

The repository includes a companion [`.env.example`](../.env.example) template. Copy it to `.env` in the repository root to configure local credentials:

```bash
cp .env.example .env
```

| Variable | Description | Required For |
| :--- | :--- | :--- |
| `SONAR_TOKEN` | SonarCloud user token for running local code analysis and querying open issues | `npm run sonar:issues` / `npm run sonar` |
| `FOSSA_API_KEY` | FOSSA API token for running local policy tests and uploading scan trees | `npm run fossa` / `npm run fossa:test` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token for non-interactive automated deployments via Wrangler | `npm run deploy:cloudflare` (CI/headless) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID for targeting specific accounts in CI | Cloudflare deployments |

> [!NOTE]
> All credentials in `.env` are strictly git-ignored. Never commit secrets, API tokens, or session variables to version control.

---

### 3. Local Development Workflow

#### Step 1: Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone git@github.com:hhkmy/id.git && cd id

# Install Node.js packages
npm install
```

#### Step 2: Install or Provision Hugo Extended
Ensure Hugo Extended is installed on your system PATH:
```bash
# Run the automated Hugo installer script
./scripts/hugo_installer.sh
```
> [!TIP]
> Alternatively, execute `./build.sh --serve` to automatically detect or provision both Node.js and Hugo Extended in a single self-contained command.

#### Step 3: Start the Development Server
```bash
# Start Hugo with live reloading on http://localhost:1313/
npm run watch:hugo
```
*Note:* `npm run watch:hugo` uses `--disableFastRender` to guarantee full template reconstruction on file changes.

#### Optional: Local Cloudflare Edge Worker
To test edge routes, Durable Objects, and `/api/` endpoints locally:
```bash
npm run dev:worker
```
This runs `wrangler dev` with IPv4-first DNS resolution.

---

### 4. Quality Assurance & Compliance Verification

The repository enforces strict quality, security, and license compliance standards. Run this suite before submitting changes or opening pull requests:

```bash
# 1. 100% offline license compliance audit (~20ms)
npm run check:licenses

# 2. Check SonarCloud Quality Gate status & verify 0 open issues
npm run sonar:issues

# 3. Perform offline FOSSA dependency tree analysis
npm run fossa:offline

# 4. Verify full production compilation and search indexing
npm run build
```

#### Compliance Policies
- **License Compliance:** All packages must have permissive licenses (MIT, ISC, Apache-2.0, BSD). Copyleft licenses (GPL, LGPL, AGPL, SSPL) are automatically rejected.
- **SonarCloud Clean Code:** Cognitive complexity must not exceed 15 per function, and there must be 0 open issues.
- **Tailwind CSS v4:** Never use inline base and dark property collisions in HTML templates; wrap reusable styles into semantic component classes in `assets/css/partials/_*.css`.

---

### 5. Production Build & Deployment

#### Production Build
Compiles the static site using Hugo and builds the Pagefind static search index:
```bash
npm run build
```
Output is generated in `public/` and minified.

#### Deploy to Cloudflare Workers
Deploys the static assets, worker script, Durable Objects, and KV bindings to Cloudflare's global edge network:
```bash
npm run deploy:cloudflare
```

#### Progressive Versioned Releases
For deployments with version tags and rollback capabilities:
```bash
npm run deploy:cloudflare:version
```

---

### 6. Companion Documentation

- **[System Architecture & Edge Guide](./ARCHITECTURE.md):** Deep-dive into Cloudflare Workers, Durable Objects SQLite storage, and the 5 architectural pillars.
- **[NPM Scripts Guide](./NPM_SCRIPTS.md):** Detailed reference for all 25+ development, sync, performance, and deployment commands.
- **[Package Updates Guide](./PACKAGE_UPDATES.md):** Step-by-step procedures for managing dependency updates safely.
- **[Security Policy](./SECURITY.md):** Vulnerability reporting process and security disclosure guidelines.
