---
title: Song Bot
linkTitle: Song Bot
username: MPXSongBot
category: Media Tools
summary: A Telegram bot and FastAPI backend that finds YouTube media, converts it to tagged audio, and delivers the finished file through Telegram.
technologies: [Python, FastAPI, yt-dlp, Docker]
weight: 8
---

## The problem

Turning an online video into a useful audio file involves search, media extraction, metadata cleanup, tagging, file transfer, and several external services that can fail independently. Large files also make the standard public Telegram Bot API less convenient for a self-hosted workflow.

Song Bot lets users send a YouTube URL or video ID, or search from a private chat and select a result. The system downloads the source, extracts audio, enriches its metadata, and returns a tagged file through Telegram.

## How it works

The project separates the Telegram worker from a FastAPI download service. The bot handles commands, search results, progress messages, and delivery. The API coordinates yt-dlp, audio processing, and metadata services. A local Telegram Bot API service supports the self-hosted file-transfer path, while an internal API key protects bot-to-service requests.

The production stack is composed of independent Docker services for the bot, download API, local Telegram API, and supporting token provider. Health endpoints allow each important runtime component to be monitored separately.

## Engineering focus

- Separation of chat interaction from media processing
- Search and direct-link input workflows
- Audio metadata enrichment and tagging
- Local Telegram Bot API integration for file delivery
- Container health checks and service-level monitoring

The architecture keeps resource-heavy downloads away from the update-handling process, making failures easier to isolate and operations easier to observe.
