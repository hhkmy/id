---
title: Markdown Bot
linkTitle: Markdown Bot
username: MPXMarkdownBot
category: Content Tools
summary: A Cloudflare Worker that converts Markdown-style content into Telegram rich messages and inline keyboards while preserving media and custom emoji.
technologies: [JavaScript, Cloudflare Workers, KV, Telegram]
weight: 4
---

## The problem

Telegram channel publishing often requires carefully formatted text, inline URL buttons, media captions, custom emoji, content protection, and discussion-topic routing. Rebuilding the same keyboard by hand for every post is slow, and a naive text conversion can lose Telegram entities or break the relationship between a channel post and its discussion reply.

Markdown Bot accepts compact Markdown-style input and turns it into Telegram-native rich messages and inline keyboards. Authors can build multiple button rows, attach buttons to existing posts, preserve supported custom emoji, and process text or media without maintaining a separate publishing application.

## How it works

The bot runs as a JavaScript Cloudflare Worker behind a secret Telegram webhook path. Cloudflare KV stores optional channel-to-topic mappings and lightweight configuration. The message pipeline handles private chats, groups, channel posts, captions, and automatic discussion forwards as distinct Telegram contexts.

Special reply commands can add buttons without rewriting the original channel text or toggle content protection on supported posts. Thread-aware handling keeps generated replies attached to the correct discussion topic rather than posting them as unrelated messages.

## Engineering focus

- Telegram entity preservation during rich-text conversion
- Inline keyboard parsing with multi-button row support
- Channel-post, caption, and discussion-thread awareness
- Optional protected-content handling
- Serverless webhook deployment through Cloudflare Workers

The project turns Telegram itself into a lightweight publishing interface while respecting the platform’s different message contexts.
