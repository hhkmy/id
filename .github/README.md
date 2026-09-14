<a href="https://hhk.my.id">
    <img src="../assets/ui/qr.svg" alt="K's V/Blog" title="HHK B/Vlog" align="right" height="50" />
</a>

# HHK B/Vlog [![Netlify Status](https://api.netlify.com/api/v1/badges/9bebb371-d351-437c-ab5b-c64a3ef6b71c/deploy-status)](https://app.netlify.com/projects/hhkmyid/deploys)

> Modern Hugo static blog & digital knowledge base powered by Tailwind CSS v4 and Cloudflare Workers edge architecture.

### Status & Health

[![Website](https://img.shields.io/website?up_message=online&up_color=green&down_message=offline&down_color=lightgrey&url=https%3A%2F%2Fhhk.my.id)](https://hhk.my.id)
[![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhhkmy%2Fstats%2Fmaster%2Fapi%2Fhhk%2Fuptime.json)](https://stats.hhk.my.id)
[![ResponseTime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhhkmy%2Fstats%2Fmaster%2Fapi%2Fhhk%2Fresponse-time.json)](https://stats.hhk.my.id)
[![All Checks](https://img.shields.io/github/checks-status/hhkmy/id/main?label=all%20checks)](https://github.com/hhkmy/id/commits/main)
[![CodeQL Advanced](https://github.com/hhkmy/id/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/hhkmy/id/actions/workflows/codeql.yml)
[![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=hhkmy_id&metric=alert_status)](https://sonarcloud.io/dashboard?id=hhkmy_id&branch=main)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2b39619%2fgit%40github.com%3Ahhkmy%2fid.git.svg?type=shield)](https://app.fossa.com/projects/custom%2b39619%2fgit%40github.com%3Ahhkmy%2fid.git?ref=badge_shield)

---

### Welcome to My Digital World

**HHK B/Vlog** is my personal technical website for publishing practical notes, project updates, and troubleshooting guides. It focuses on modern web systems, software workflows, server administration, and the tools I use to build and maintain reliable digital infrastructure.

This repository contains the complete source code for the site, including Hugo templates, content, assets, serverless Cloudflare Workers backend, and automated CI/CD pipelines.

---

### Architecture Highlights

The platform pairs zero-runtime static site generation with a stateful serverless edge runtime:

- **Static Core:** Compiled with **Hugo Extended (v0.165+)**, **Tailwind CSS v4** modular partials, and instant client-side search via **Pagefind**.
- **Edge Runtime:** Served globally on **Cloudflare Workers** with Static Assets (`env.ASSETS`), strict Content Security Policy (CSP), and HSTS preloading.
- **Stateful Edge Compute:** Real-time view tracking powered by **Cloudflare Durable Objects (SQLite Storage Engine)** and Workers KV namespaces (`BLOG_VIEWS`, `SHOP_DATA`).
- **Serverless Integrations:** Visitor edge telemetry (`/api/edge-info`), Telegram Bot Webhooks (`/api/bot`), and Telegram Mini App endpoints (`/api/telegram`).
- **Strict QA & Compliance:** Zero-copyleft license auditor (`npm run check:licenses`), continuous FOSSA SBOM analysis, and SonarCloud Clean Code gate.

👉 For complete architectural diagrams, storage schemas, and directory structure, read the **[System Architecture Guide](./ARCHITECTURE.md)**.

---

### Quick Start

Get a local development server running in three quick steps:

```bash
# 1. Clone the repository
git clone git@github.com:hhkmy/id.git && cd id

# 2. Install dependencies & provision Hugo
npm install
./scripts/hugo_installer.sh

# 3. Start the live-reload development server
npm run dev
```

Visit `http://localhost:1313/` to view the site.

👉 For system requirements, environment variables (`.env.example`), and edge worker testing, consult the **[Development & Operations Guide](./DEVELOPMENT.md)**.

---

### Recent Articles

<!-- BLOG-POST-LIST:START -->
- [Antigravity IDE မှာ Arrow နဲ့ Mermaid ပြင်နည်း](https://hhk.my.id/article/antigravity-ide-arrow-mermaid-fix-guide/)
- [NPM အသုံးပြုနည်းနှင့် ပြဿနာဖြေရှင်းနည်း လမ်းညွှန်](https://hhk.my.id/article/npm-essentials-and-troubleshooting-guide/)
- [Telegram Shop Bot နဲ့ Mini App အဆင့်မြှင့်တင်မှု မှတ်တမ်း](https://hhk.my.id/article/telegram-shop-bot-miniapp-premium-emoji-enhancements/)
- [GitHub README မှာ Blog Post တွေ Auto Update လုပ်နည်း](https://hhk.my.id/article/github-readme-blog-post-workflow-automation/)
- [Hugo Website မှာ Twemoji ထည့်သွင်း အသုံးပြုနည်း](https://hhk.my.id/article/hugo-twemoji-modern-setup-guide/)
<!-- BLOG-POST-LIST:END -->

---

### Documentation

Deep-dive documentation and specialized guides are organized inside the [`.github/`](./) folder:

- 🏗️ **[System Architecture & Edge Guide](./ARCHITECTURE.md):** Detailed breakdown of Hugo compilation, Cloudflare Workers, Durable Objects SQLite engine, and KV storage.
- ⚙️ **[Development & Operations Guide](./DEVELOPMENT.md):** Prerequisites matrix, environment variable configuration, compliance verification, and Cloudflare deployment.
- 📜 **[NPM Scripts Guide](./NPM_SCRIPTS.md):** Complete reference for all 25+ development, build, test, and maintenance scripts.
- 📦 **[Package Updates Guide](./PACKAGE_UPDATES.md):** Guidelines for safely updating dependencies and managing license compliance.
- 🔒 **[Security Policy](./SECURITY.md):** Security practices and vulnerability reporting procedures.

---

### License

Licensed under the permissive **[ISC License](../LICENSE)**. Continuous license compliance is audited by [FOSSA](https://app.fossa.com/projects/custom%2b39619%2fgit%40github.com%3Ahhkmy%2fid.git?ref=badge_large).
