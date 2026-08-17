---
title: ID Bot
linkTitle: ID Bot
username: MPXIDBot
category: Group Operations
summary: An internal group assistant for game-ID detection, scam reporting, risk signals, crypto price tracking, and escrow workflows.
technologies: [Python, aiogram, PostgreSQL, Redis]
weight: 2
---

## The problem

High-volume game trading groups repeatedly exchange player IDs, payment evidence, wallet addresses, prices, and scam reports. Copying identifiers by hand is error-prone, while disconnected moderation records make it difficult to recognize repeated suspicious activity.

ID Bot combines those small but frequent tasks in one private Telegram service. It recognizes supported Mobile Legends and PUBG ID formats and returns copy-ready controls. In approved groups, members can also submit structured scam reports with text or media evidence instead of relying on messages that are difficult to search later.

## How it works

The bot uses aiogram v3 for asynchronous Telegram handling. PostgreSQL stores approved groups, scam reports, evidence, broadcasts, escrow history, and other durable records. Redis accelerates repeated risk checks and cached information without becoming the source of truth.

Incoming messages can be compared with known entities, repeated content, verified users, and phishing-domain signals. The bot also recognizes TON wallet addresses, verifies supported transaction evidence, tracks selected cryptocurrency prices, and provides owner-controlled tools for group access and operational health.

## Engineering focus

- Fast parsing of common game-ID formats
- Persistent, evidence-backed scam reporting
- Redis-assisted risk scoring with PostgreSQL durability
- Owner-managed access for closed operational groups
- Health checks, structured logs, and controlled broadcasts

The project evolved from a simple ID-copy helper into a broader operational assistant while retaining strict access boundaries for private groups.
