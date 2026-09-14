# System Architecture & Edge Capabilities

This document provides an in-depth overview of the system architecture, edge computing capabilities, data storage layers, and technology stack powering **HHK B/Vlog**.

---

### Table of Contents
- [1. Architectural Overview](#1-architectural-overview)
- [2. Zero-Runtime Static Generation](#2-zero-runtime-static-generation)
- [3. Global Edge Delivery & Security](#3-global-edge-delivery--security)
- [4. Stateful Edge Compute & Storage](#4-stateful-edge-compute--storage)
- [5. Serverless APIs & Telegram Ecosystem](#5-serverless-apis--telegram-ecosystem)
- [6. Multi-Tier Quality & Compliance Pipeline](#6-multi-tier-quality--compliance-pipeline)
- [7. Project Directory Structure](#7-project-directory-structure)
- [8. Technology Stack Reference](#8-technology-stack-reference)

---

### 1. Architectural Overview

The site is built on a hybrid architecture that pairs a high-performance static generator with a stateful Cloudflare Workers serverless edge runtime:

- **Frontend & Content:** Pre-rendered static pages generated ahead-of-time with zero client-side framework overhead.
- **Edge Routing & Delivery:** Cloudflare Workers Static Assets (`env.ASSETS`) serving files directly from 300+ global edge locations.
- **Stateful Edge Compute:** Cloudflare Durable Objects (with SQLite storage engine) handling atomic view counts and low-latency mutations.
- **Key-Value Persistence:** Dual KV namespaces handling analytical time-series records and remote e-commerce/vector sticker data.
- **Search & Interactivity:** Client-side static search index compiled with Pagefind, alongside targeted ES modules for animations and clipboard interactions.

---

### 2. Zero-Runtime Static Generation

1. **Hugo Extended Compilation:**
   - Powered by **Hugo Extended (v0.165+)**, taking advantage of modern content methods (`site.RegularPages`, `page.GetPage`, `.RelPermalink`) and page bundles (`content/articles/<slug>/index.md`).
   - Generates fully optimized, semantic HTML5 with zero client runtime overhead.

2. **Tailwind CSS v4 Partial Architecture:**
   - Compiled with `@tailwindcss/cli` using modern Tailwind CSS v4 conventions (`@theme`, `@variant dark`, CSS-native nesting).
   - Strict modular separation: `assets/css/main.css` is an import-only entrypoint, with all component and utility styles distributed across dedicated partials in `assets/css/partials/_*.css`.

3. **Static Search with Pagefind:**
   - Builds isolated, chunked search indexes directly from compiled static HTML.
   - Leverages `data-pagefind-body` attributes to index article content, headings, and metadata without bloating client payload.

---

### 3. Global Edge Delivery & Security

1. **Edge-Level Asset Serving:**
   - Static assets are mounted via Cloudflare Workers Static Assets (`env.ASSETS`) configured in [`wrangler.jsonc`](../wrangler.jsonc).
   - Edge handler routes requests through custom security, header injection, and API middleware before fallback to static assets.

2. **Security Headers & Defense in Depth:**
   - Enforces strict Content Security Policy (CSP) headers, Subresource Integrity (SRI), and HSTS preloading (`max-age=63072000; includeSubDomains; preload`).
   - W3C-validated markup compliance and A+ grade security ratings.

---

### 4. Stateful Edge Compute & Storage

1. **Durable Objects (SQLite Storage Engine):**
   - The `ViewCounter` Durable Object class (`src/index.ts`) provides strongly consistent, atomic view incrementing.
   - Built on Cloudflare's embedded SQLite storage engine for fast, transactional read/write operations without external database dependencies.
   - Exposes `/api/views` for client-side view retrieval and increments.

2. **Cloudflare Workers KV Namespaces:**
   - **`BLOG_VIEWS`:** Stores aggregated analytics, historical view tallies, and reader engagement metrics.
   - **`SHOP_DATA`:** Remote KV store containing shop product catalogs, service tiers, and base64-encoded Telegram Premium Animated Sticker vector payloads (`.tgs` / Lottie).

---

### 5. Serverless APIs & Telegram Ecosystem

1. **Visitor Telemetry (`/api/edge-info`):**
   - Dynamically inspects edge request metadata to return visitor telemetry:
     - Client IP address and geographic location
     - Cloudflare Radar datacenter airport code (colo)
     - Autonomous System Number (ASN) and network provider
     - TLS protocol version and cipher suite

2. **Telegram Bot Webhook & Mini App API:**
   - Direct integration via `/api/bot` and `/api/telegram` executing natively at the Cloudflare edge.
   - Handles interactive user commands, dynamic order intake, and Telegram Mini App authentication without needing an independent backend server.

---

### 6. Multi-Tier Quality & Compliance Pipeline

1. **100% Offline License Auditor:**
   - Custom Node.js engine ([`scripts/check-licenses.mjs`](../scripts/check-licenses.mjs)) validating all direct and transitive dependencies against a strict zero-copyleft policy.
   - Only permissive open-source licenses (MIT, ISC, Apache-2.0, BSD) are allowed; copyleft (GPL, LGPL, AGPL, SSPL) is automatically blocked in pre-commit and CI.

2. **Continuous FOSSA SBOM Tracking:**
   - Automated FOSSA scanning ([`.github/workflows/fossa.yml`](./workflows/fossa.yml)) tracking dependency vulnerabilities and ongoing software bill of materials (SBOM) compliance.

3. **Dual Static Code Analysis:**
   - **SonarCloud:** Strict Clean Code Quality Gate enforcing a maximum cognitive complexity of 15 and 0 open issues across JavaScript, CSS, HTML, and shell scripts.
   - **GitHub CodeQL:** Semantic Abstract Syntax Tree (AST) analysis continuously inspecting for security vulnerabilities and taint propagation.

4. **Performance & Core Web Vitals:**
   - Weekly automated Google Lighthouse audits tracking Desktop and Mobile scores.
   - Historical scores are committed to repository datasets in `data/lighthouse.json` and rendered on the live status dashboard at `/lighthouse/`.

---

### 7. Project Directory Structure

```
.
├── .agents/              # Antigravity agent configuration, rules, and specialized skills
├── .github/              # GitHub Actions workflows, documentation, and issue templates
├── assets/               # CSS partials (_*.css), JavaScript modules, and images
│   ├── css/              # Tailwind CSS v4 partials architecture
│   └── js/               # ES modules (anime-enhancements.js, code-copy.js, main.js)
├── content/              # Markdown articles organized as Hugo page bundles
│   └── articles/         # Individual article bundles with co-located assets
├── data/                 # Static data sources (e.g. lighthouse.json scores)
├── layouts/              # Hugo semantic HTML5 templates, partials, and shortcodes
├── public/               # Generated static output from Hugo and Pagefind (git-ignored)
├── scripts/              # Build, license auditor, SonarCloud, FOSSA, and KV sync utilities
├── src/                  # Cloudflare Worker TypeScript source and Durable Objects
├── static/               # Static assets served at domain root (icons, fonts, robots.txt)
├── wrangler.jsonc        # Cloudflare Workers, KV, and Durable Objects configuration
├── .fossa.yml            # FOSSA license compliance policy configuration
└── package.json          # Node.js dependencies, scripts, and build commands
```

---

### 8. Technology Stack Reference

#### Core Frameworks & Runtimes
- **Static Site Generator:** [Hugo Extended](https://gohugo.io/) (v0.165+)
- **Edge Compute Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) & [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- **Node.js LTS:** `>= 24.18.0`
- **CLI Deployment:** [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (`^4.131.0`)

#### Styling & Design System
- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/cli`)
- **Preprocessor:** [Sass / SCSS](https://sass-lang.com/) for legacy asset compilation
- **Typography & Layout:** Semantic HTML5, CSS Grid, and responsive flexbox

#### Client-Side Libraries & Enhancements
- **Search Engine:** [Pagefind](https://pagefind.app/)
- **Micro-Animations:** [Anime.js](https://animejs.com/)
- **Code Copy:** [ClipboardJS](https://clipboardjs.com/)
- **Math Typesetting:** [KaTeX](https://katex.org/)
- **Community Comments:** [Giscus](https://giscus.app/) (GitHub Discussions API)
- **Emoji Support:** [Twemoji](https://twemoji.twitter.com/)

#### Quality & Code Standards
- **Linter & Formatter:** [Prettier](https://prettier.io/)
- **License Auditor:** Custom offline scanner (`npm run check:licenses`) & [FOSSA](https://fossa.com/)
- **Code Quality:** [SonarCloud](https://sonarcloud.io/)
- **Security Scanner:** [GitHub CodeQL](https://codeql.github.com/)
