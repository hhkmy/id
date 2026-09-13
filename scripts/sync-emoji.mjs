#!/usr/bin/env node

/**
 * Offline Telegram Custom Emoji Downloader & KV Sync Tool.
 *
 * Workflow:
 * 1. If emoji already exists locally -> Skip KV search completely (use local asset).
 * 2. If emoji is missing (does not exist) -> Do NOT search KV.
 *    Directly download via Telegram Bot API offline.
 * 3. Once downloaded, automatically save locally AND upload to Cloudflare KV (SHOP_DATA).
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const STATIC_BASE64_DIR = path.join(ROOT_DIR, "static", "icons", "premiumemojis");
const STATIC_TGS_DIR = path.join(ROOT_DIR, "static", "telegram-premium-emoji");
const CURL_BIN = fs.existsSync("/usr/bin/curl") ? "/usr/bin/curl" : "/bin/curl";
const NPX_BIN = path.join(path.dirname(process.execPath), "npx");

/**
 * Reads TELEGRAM_BOT_TOKEN from environment, .dev.vars, or .env.
 * @returns {string|null}
 */
function getBotToken() {
  if (process.env.TELEGRAM_BOT_TOKEN) {
    return process.env.TELEGRAM_BOT_TOKEN.trim();
  }

  const varFiles = [".dev.vars", ".env"];
  for (const file of varFiles) {
    const filePath = path.join(ROOT_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const match = /^TELEGRAM_BOT_TOKEN\s*=\s*["']?([^"'\r\n]+)["']?/m.exec(content);
      if (match) {
        return match[1].trim();
      }
    }
  }

  return null;
}

/**
 * Collects all custom emoji IDs from data/services.json.
 * @returns {string[]}
 */
function getServicesEmojiIds() {
  const servicesPath = path.join(ROOT_DIR, "data", "services.json");
  if (!fs.existsSync(servicesPath)) {
    return [];
  }

  const raw = fs.readFileSync(servicesPath, "utf8");
  const data = JSON.parse(raw);
  const emojiSet = new Set();

  for (const plan of data.plans || []) {
    if (plan.premium_emoji_id) {
      emojiSet.add(String(plan.premium_emoji_id));
    }
  }

  for (const method of data.payment_methods || []) {
    if (method.premium_emoji_id) {
      emojiSet.add(String(method.premium_emoji_id));
    }
  }

  if (data.payment_details?.account_name_emoji_id) {
    emojiSet.add(String(data.payment_details.account_name_emoji_id));
  }

  return Array.from(emojiSet);
}

/**
 * Performs a curl request and returns the stdout buffer.
 * @param {string} url
 * @param {number} [retries=3]
 * @returns {Buffer|null}
 */
function curlGet(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return execFileSync(CURL_BIN, ["-s", "--fail", "--connect-timeout", "20", "--retry", "2", url]);
    } catch (err) {
      if (attempt === retries) {
        console.error(`[curl error] Failed to fetch ${url} (attempt ${attempt}/${retries}):`, err.message);
        return null;
      }
    }
  }
  return null;
}

/**
 * Downloads a custom emoji via Telegram Bot API and returns its base64 string.
 * @param {string} botToken
 * @param {string} customEmojiId
 * @returns {{ base64: string, buffer: Buffer }|null}
 */
function downloadEmoji(botToken, customEmojiId) {
  const param = encodeURIComponent(JSON.stringify([customEmojiId]));
  const apiUrl = `https://api.telegram.org/bot${botToken}/getCustomEmojiStickers?custom_emoji_ids=${param}`;

  const metaBuf = curlGet(apiUrl);
  if (!metaBuf) return null;

  let meta;
  try {
    meta = JSON.parse(metaBuf.toString("utf8"));
  } catch (parseErr) {
    console.error(`[json error] Invalid response for emoji ${customEmojiId}:`, parseErr.message);
    return null;
  }

  const sticker = meta.result?.[0];
  if (!sticker?.file_id) {
    console.warn(`[warn] No sticker found for custom emoji ID: ${customEmojiId}`);
    return null;
  }

  const fileInfoBuf = curlGet(`https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`);
  if (!fileInfoBuf) return null;

  let fileInfo;
  try {
    fileInfo = JSON.parse(fileInfoBuf.toString("utf8"));
  } catch (parseErr) {
    console.error(`[json error] Invalid file info response:`, parseErr.message);
    return null;
  }

  const filePath = fileInfo.result?.file_path;
  if (!filePath) {
    console.warn(`[warn] No file_path returned for file_id: ${sticker.file_id}`);
    return null;
  }

  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  const fileBuf = curlGet(downloadUrl);
  if (!fileBuf) return null;

  return {
    base64: fileBuf.toString("base64"),
    buffer: fileBuf,
  };
}

/**
 * Uploads an array of { key, value } entries to Cloudflare KV.
 * @param {Array<{ key: string, value: string }>} entries
 */
function uploadEntriesToKv(entries) {
  if (!entries || entries.length === 0) return;

  const bulkJsonPath = path.join(ROOT_DIR, "scratch_emoji_kv_bulk.json");
  fs.writeFileSync(bulkJsonPath, JSON.stringify(entries, null, 2), "utf8");
  console.log(`[kv] Uploading ${entries.length} emoji(s) to Cloudflare KV (SHOP_DATA)...`);

  try {
    execFileSync(NPX_BIN, ["wrangler", "kv", "bulk", "put", bulkJsonPath, "--binding=SHOP_DATA", "--remote"], {
      stdio: "inherit",
      env: { ...process.env, NODE_OPTIONS: "--dns-result-order=ipv4first" },
    });
    console.log("[kv] Successfully updated Cloudflare KV!");
  } catch (err) {
    console.error("[kv:error] Failed to upload emojis to Cloudflare KV:", err.message);
  } finally {
    if (fs.existsSync(bulkJsonPath)) {
      fs.unlinkSync(bulkJsonPath);
    }
  }
}

/**
 * Main execution function.
 */
function main() {
  const args = process.argv.slice(2);
  const uploadAll = args.includes("--upload-all");
  const isAll = args.includes("--all");
  const force = args.includes("--force");
  const targetIds = args.filter((arg) => !arg.startsWith("--"));

  const botToken = getBotToken();
  if (!botToken) {
    console.error("[fatal] TELEGRAM_BOT_TOKEN not found in environment, .dev.vars, or .env.");
    process.exit(1);
  }

  let emojiIds = targetIds;
  if (isAll || emojiIds.length === 0) {
    emojiIds = getServicesEmojiIds();
  }

  if (emojiIds.length === 0) {
    console.log("[info] No emoji IDs specified or found in services.json.");
    return;
  }

  fs.mkdirSync(STATIC_BASE64_DIR, { recursive: true });
  fs.mkdirSync(STATIC_TGS_DIR, { recursive: true });

  console.log(`[start] Checking ${emojiIds.length} custom emoji(s)...`);
  const newlyDownloaded = [];
  const allEntries = [];
  let existingCount = 0;

  for (const id of emojiIds) {
    const base64FilePath = path.join(STATIC_BASE64_DIR, `${id}.tgs.base64`);
    const tgsFilePath = path.join(STATIC_TGS_DIR, `${id}.tgs`);

    if (!force && fs.existsSync(base64FilePath)) {
      // Rule 1: If it already exists, do NOT search KV
      console.log(`[local:skip-kv] ${id} exists locally. Skipping KV search.`);
      const base64 = fs.readFileSync(base64FilePath, "utf8").trim();
      existingCount++;
      allEntries.push({ key: `emoji:${id}`, value: base64 });
    } else {
      // Rule 2: If it does not exist, do NOT search KV -> Download offline -> Upload to KV
      console.log(`[missing:download] ${id} not found locally. Downloading offline via Bot API (bypassing KV search)...`);
      const result = downloadEmoji(botToken, id);
      if (result) {
        fs.writeFileSync(base64FilePath, result.base64, "utf8");
        fs.writeFileSync(tgsFilePath, result.buffer);
        console.log(`[saved] ${id} saved locally (${result.buffer.length} bytes).`);
        newlyDownloaded.push({ key: `emoji:${id}`, value: result.base64 });
        allEntries.push({ key: `emoji:${id}`, value: result.base64 });
      }
    }
  }

  console.log(`[summary] Total: ${emojiIds.length} | Existing (KV bypassed): ${existingCount} | Newly Downloaded: ${newlyDownloaded.length}`);

  // Rule 3: Automatically upload newly downloaded missing emojis to KV
  if (newlyDownloaded.length > 0) {
    console.log(`[sync] Automatically pushing ${newlyDownloaded.length} newly downloaded emoji(s) to Cloudflare KV...`);
    uploadEntriesToKv(newlyDownloaded);
  } else if (uploadAll && allEntries.length > 0) {
    console.log(`[sync] Uploading all ${allEntries.length} local emoji(s) to Cloudflare KV (--upload-all)...`);
    uploadEntriesToKv(allEntries);
  } else {
    console.log("[info] All emojis already exist locally. No KV upload needed.");
  }

  console.log("[done] Operation completed.");
}

main();
