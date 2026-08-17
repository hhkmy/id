---
title: Crypto Wallet Bot
linkTitle: Crypto Wallet Bot
username: MPXCryptoWalletBot
category: Finance Automation
summary: A private operations bot for Telegram Stars, Premium gifts, Fragment purchases, TON transfers, approvals, reconciliation, and audit reporting.
technologies: [Python, SQLite, TON, Docker]
weight: 1
---

## The problem

Fragment purchases and TON wallet operations involve more than sending a request and waiting for a success message. A reliable system must validate the destination, protect sensitive actions, survive restarts, distinguish a submitted transaction from a confirmed one, and retain enough history to investigate problems later.

Crypto Wallet Bot brings those operational steps into a controlled Telegram interface. It can send Telegram Stars, gift Telegram Premium, top up Fragment balances, recharge Telegram Ads accounts, transfer TON, and inspect the configured wallet without turning every operation into a manual browser workflow.

## How it works

The bot is an asynchronous Python application built around `python-telegram-bot`. SQLite stores operation records, spend history, wallet mappings, application state, and audit events. Sensitive operations are written to durable storage before the user receives confirmation controls, so a process restart does not silently discard the pending work.

Operations move through explicit states such as pending confirmation, broadcasting, completed, failed, and cancelled. Failed operations cannot immediately spend again: retrying creates a fresh confirmation step. A reconciliation worker checks transactions that were broadcast but not yet finalized, while operational alerts surface authentication failures, stale transactions, health-check failures, and wallet-balance thresholds.

## Engineering focus

- Confirmation-first handling for purchases and transfers
- Durable recovery of pending operations after restarts
- Reconciliation against blockchain transaction state
- Spend limits, audit exports, and administrative reporting
- Docker-based deployment with health and alert monitoring

The result is an internal financial operations tool designed around traceability and recovery rather than a collection of one-off payment commands.
