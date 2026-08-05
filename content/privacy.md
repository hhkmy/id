---
author: "heinhtetkyaw"
title: Privacy
slug: /privacy
type: page
layout: legal
description: How HHK BVlog handles visitor data, article view counts, comments, local preferences, and third-party services.
summary: A plain-language explanation of the limited information processed when you visit and interact with HHK BVlog.
lastmod: 2026-08-05T14:00:00+06:30
---

This privacy notice explains how HHK BVlog handles information when you visit `hhk.my.id` or use its interactive features. It reflects the website as of August 5, 2026.

## Who operates this website

HHK BVlog is a personal website operated by Hein Htet Kyaw. For privacy questions or requests, email [mr.kiddomonster@gmail.com](mailto:mr.kiddomonster@gmail.com).

## Information processed

### Basic requests and security

The website is delivered through Cloudflare. Like most hosting and security providers, Cloudflare may process request information such as your IP address, browser user agent, requested URL, request time, and security signals to deliver the site, prevent abuse, and troubleshoot failures.

### Article view counts

When you open an article, the website sends its path to the local `/api/views` endpoint. To prevent repeated views from being counted immediately, the Worker creates a SHA-256 hash from the IP address supplied by Cloudflare and the browser user agent.

The raw IP address and user agent are not stored in the view-counter database. The derived rate-limit identifier expires after 30 seconds and is removed during subsequent counter activity. Aggregate article view totals are retained so the website can display them.

### Comments

Article comments are provided by the self-hosted Remark42 service at `comments.hhk.my.id`. If you comment or sign in, Remark42 processes the information you choose to provide, which may include your display name, authentication-provider details, email address, comment content, and moderation metadata. Authentication providers you select may process information under their own privacy terms.

### Local preferences

The theme selector stores your light or dark mode preference in your browser's local storage. This preference stays on your device until you change it or clear your browser data.

### GitHub updates

The Updates page requests public commit information and author avatars directly from GitHub. When that page loads, your browser connects to GitHub, which receives normal request information such as your IP address and user agent. GitHub handles that information under its own privacy statement.

### Embedded content

Some articles may contain third-party content, such as privacy-enhanced YouTube embeds. A connection to that provider is made when you interact with or load the embed, and the provider's own privacy terms apply.

## Cookies and analytics

HHK BVlog itself uses local storage for the theme preference. Remark42 or an authentication provider may use cookies or similar browser storage when you use comments or sign in.

At the time this notice was updated, the website does not load Google Analytics or advertising trackers. This notice will be updated if that changes.

## Why this information is used

Information is processed only as needed to:

- deliver and secure the website;
- count article views without keeping raw visitor identifiers in the counter database;
- provide comments and moderation;
- remember your selected theme;
- display public repository updates; and
- diagnose technical problems.

Where applicable, these activities rely on the legitimate interests of operating, securing, and improving a personal website, or on actions you choose to take, such as submitting a comment or selecting a sign-in provider.

## Sharing and retention

Information is shared only with services needed for the feature you use, including Cloudflare for hosting and security, GitHub for the Updates feed, Remark42 and any authentication provider selected for comments, and embedded-content providers when you load their content.

Retention depends on the feature: theme preferences remain in your browser, view totals are retained as aggregate counts, short-lived view rate-limit identifiers expire after 30 seconds, and comments remain until they are removed under the comment service's moderation or deletion process. Infrastructure providers may retain request or security logs under their own policies.

## Your choices and requests

You can clear local storage and cookies through your browser, avoid loading third-party embeds, and choose not to use comments or external sign-in providers. You may request information about, correction of, or deletion of personal information controlled through this website by emailing the address above. Requests involving a third-party provider may also need to be directed to that provider.

## Changes to this notice

This page may be revised when the website's features or service providers change. The latest revision date appears in the page metadata.
