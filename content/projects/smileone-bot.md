---
title: SmileOne Bot
linkTitle: SmileOne Bot
username: MPXSmileOneBot
category: Commerce Automation
summary: A private bot and internal API for controlled game top-ups, country-aware products, encrypted customer sessions, and account verification.
technologies: [Python, Node.js, PostgreSQL, Docker]
weight: 6
---

## The problem

Game top-up workflows require more than a product list. The system must verify player details, select products for the correct country, protect purchasing access, manage provider sessions, and ensure a user confirms the exact order before any purchase occurs.

SmileOne Bot provides a private Telegram interface for Mobile Legends, Magic Chess: Go Go, Identity V, and supported activation-code operations. Owners control which users and groups may access the system, while group ID detection speeds up repeated account lookups.

## How it works

The project separates the Telegram interface from a Node.js internal API. The Python bot owns conversations, commands, permissions, and confirmation flows. The API owns provider-specific requests. PostgreSQL stores allowed users, groups, tenant configuration, and per-user sessions.

Provider session cookies are encrypted before storage, and bot-to-API requests use a separate internal authentication boundary. Product lookup is country-aware, so the confirmation view can reflect the correct account, region, product, and price before the user proceeds.

## Engineering focus

- Owner-controlled user and group access
- Purchase confirmation before external actions
- Encrypted provider-session storage
- Separation between Telegram UI and provider API logic
- PostgreSQL-backed sessions, health checks, and Docker deployment

This separation keeps Telegram interaction code readable while isolating the more sensitive commerce integration behind an internal service boundary.
