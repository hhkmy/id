---
title: Monitor Bot
linkTitle: Monitor Bot
username: MPXMonitorBot
category: Monitoring
summary: An asynchronous service that checks Telegram bots and health endpoints, then maintains a live status message in a channel.
technologies: [Python, Telethon, aiohttp, Docker]
weight: 5
---

## The problem

A Telegram username being reachable does not prove the bot behind it is running. At the same time, posting a new status message for every check creates noise and makes it difficult to see the current state of a collection of services.

Monitor Bot keeps one persistent status message in a Telegram channel and edits it as checks change. It can resolve configured bot usernames and, when a project exposes a health endpoint, verify the actual service through an HTTP request.

## How it works

The service uses Telethon for Telegram identity and channel operations, with `aiohttp` for asynchronous endpoint checks. Display names are cached to reduce unnecessary Telegram requests. The monitor safely handles timeouts, Telegram rate limits, and temporary network failures.

Its status model deliberately distinguishes online, offline, and unknown. A successful health response can establish that a service is online. A failed endpoint can establish a service problem. A resolvable Telegram username alone remains unknown because Telegram does not expose the runtime status of a bot process.

## Engineering focus

- Honest health classification without false online claims
- Optional per-bot HTTP health endpoints
- One reusable channel status message
- Cached identity lookups and bounded network retries
- Docker deployment with restart and log-rotation controls

The design favors accurate operational signals over a visually reassuring but misleading list of green statuses.
