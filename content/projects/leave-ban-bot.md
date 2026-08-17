---
title: Leave Ban Bot
linkTitle: Leave Ban Bot
username: MPXLeaveBanBot
category: Moderation
summary: A moderation system that records and bans departing members, manages connected chats, and supports resumable unban and reconciliation workflows.
technologies: [Python, PostgreSQL, Redis, Docker]
weight: 3
---

## The problem

Some private communities need departed members to remain blocked until an administrator deliberately restores access. Telegram membership updates look simple, but production moderation must account for owners, administrators, restricted members, linked channels, missing permissions, stale records, rate limits, and interrupted bulk operations.

Leave Ban Bot watches valid departure transitions, applies the required restriction, and records the result in PostgreSQL. Chat owners can connect groups they control, inspect statistics, review recorded bans, unban individual users, or start a mass-unban operation without handing global control to every administrator.

## How it works

The service uses `python-telegram-bot` with asynchronous handlers and PostgreSQL-backed state. Redis provides bounded caching and cross-process coordination, while durable moderation records and queue claims remain in PostgreSQL.

Bulk unban work is checkpointed so it can resume after a restart. Administrators can inspect progress, request cancellation, or run verification that compares stored records with current Telegram state. Retry and backoff handling protects the bot from treating temporary Telegram errors as permanent failures.

## Engineering focus

- Precise membership-transition handling
- Permission validation before connecting a chat
- Durable, resumable mass-unban operations
- Reconciliation between Telegram and database state
- Rate-limit handling, metrics, health checks, and backups

The bot treats moderation as a state-management problem, making destructive actions visible, recoverable, and attributable.
