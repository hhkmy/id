/**
 * Telegram Premium Custom Emoji fetcher and cache manager.
 */

/**
 * Extracts custom_emoji_id and unicode character from a Telegram message.
 * @param {any} message
 * @returns {{ customEmojiId: string, unicodeChar: string } | null}
 */
export function extractCustomEmojiInfo(message) {
  if (!message) return null;

  const entities = message.entities || message.caption_entities;
  const text = message.text || message.caption || "";

  if (Array.isArray(entities)) {
    const customEmojiEntity = entities.find(
      (entity) => entity.type === "custom_emoji" && entity.custom_emoji_id,
    );
    if (customEmojiEntity) {
      const customEmojiId = String(customEmojiEntity.custom_emoji_id);
      let unicodeChar = "🎁";
      try {
        const slice = text.slice(
          customEmojiEntity.offset,
          customEmojiEntity.offset + customEmojiEntity.length,
        );
        if (slice) unicodeChar = slice;
      } catch {
        // Use fallback
      }
      return { customEmojiId, unicodeChar };
    }
  }

  return null;
}

/**
 * Extracts a custom_emoji_id from a Telegram message if present.
 * @param {any} message
 * @returns {string|null}
 */
export function extractCustomEmojiId(message) {
  const info = extractCustomEmojiInfo(message);
  return info ? info.customEmojiId : null;
}

/**
 * Fetches a Telegram custom emoji sticker (.tgs.base64) using Bot API and caches it in KV.
 * @param {string} customEmojiId
 * @param {Record<string, any>} env
 * @returns {Promise<string|null>} Base64 encoded .tgs string or null
 */
export async function fetchAndCacheEmoji(customEmojiId, env) {
  if (!customEmojiId) return null;

  const cacheKey = `emoji:${customEmojiId}`;

  // 1. Check KV cache first
  if (env.SHOP_DATA) {
    try {
      const cached = await env.SHOP_DATA.get(cacheKey);
      if (cached) return cached;
    } catch (error) {
      console.warn("Error reading emoji from KV:", error);
    }
  }

  // 2. Fetch via Telegram Bot API
  if (!env.TELEGRAM_BOT_TOKEN) {
    return null;
  }

  try {
    const botToken = env.TELEGRAM_BOT_TOKEN;

    // Get sticker metadata for this custom emoji ID
    const stickersUrl = `https://api.telegram.org/bot${botToken}/getCustomEmojiStickers?custom_emoji_ids=["${customEmojiId}"]`;
    const stickersRes = await fetch(stickersUrl);
    if (!stickersRes.ok) return null;

    const stickersData = await stickersRes.json();
    const sticker = stickersData.result?.[0];
    if (!sticker || !sticker.file_id) return null;

    // Get file path from Telegram
    const fileRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`,
    );
    if (!fileRes.ok) return null;

    const fileData = await fileRes.json();
    const filePath = fileData.result?.file_path;
    if (!filePath) return null;

    // Download the .tgs file (gzipped lottie)
    const downloadRes = await fetch(
      `https://api.telegram.org/file/bot${botToken}/${filePath}`,
    );
    if (!downloadRes.ok) return null;

    const buffer = await downloadRes.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCodePoint(bytes[i]);
    }
    const base64 = btoa(binary);

    // Cache in KV
    if (env.SHOP_DATA && base64) {
      await env.SHOP_DATA.put(cacheKey, base64);
    }

    return base64;
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to fetch and cache Telegram custom emoji",
        customEmojiId,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return null;
  }
}

/**
 * Resolves custom emoji information from a public Telegram post link (e.g. https://t.me/MPXPremiumEmojis/61).
 * @param {string} url
 * @returns {Promise<{ customEmojiId: string, unicodeChar: string }|null>}
 */
export async function resolveEmojiFromUrl(url) {
  if (!url || typeof url !== "string" || !url.includes("t.me/")) return null;

  let fetchUrl = url.trim();
  if (fetchUrl.includes("t.me/") && !fetchUrl.includes("t.me/s/")) {
    fetchUrl = fetchUrl.replace("t.me/", "t.me/s/");
  }

  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Cloudflare-Worker)",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const match =
      html.match(/<tg-emoji\s+emoji-id="(\d+)"[^>]*>.*?<b>([^<]+)<\/b>.*?<\/tg-emoji>/s) ||
      html.match(/<tg-emoji\s+emoji-id="(\d+)"/);

    if (match) {
      return {
        customEmojiId: match[1],
        unicodeChar: match[2] || "🎁",
      };
    }
  } catch (err) {
    console.warn("Failed to resolve emoji from post URL:", err);
  }

  return null;
}
