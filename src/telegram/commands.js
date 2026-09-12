/**
 * Telegram Bot command and callback query dispatcher.
 */

import {
  getShopData,
  updatePlanPrice,
  updatePlanEmoji,
  togglePlanHighlight,
  findPlanIndex,
} from "./shop-service.js";
import {
  getMainMenuKeyboard,
  getAppLaunchKeyboard,
  getHelpKeyboard,
  getCategoriesKeyboard,
  getPlansListKeyboard,
  getPlanDetailsKeyboard,
  getPaymentMethodsKeyboard,
} from "./keyboards.js";
import {
  extractCustomEmojiInfo,
  fetchAndCacheEmoji,
  resolveEmojiFromUrl,
} from "./emoji.js";

/**
 * Formats a plan's emoji for HTML messages using <tg-emoji>.
 * @param {any} plan
 * @returns {string}
 */
export function formatPlanEmoji(plan) {
  if (plan.premium_emoji_id) {
    return `<tg-emoji emoji-id="${plan.premium_emoji_id}">${plan.emoji || "🎁"}</tg-emoji>`;
  }
  return plan.emoji || "📦";
}

/**
 * Sends a message using Telegram Bot API with link previews disabled.
 * @param {number|string} chatId
 * @param {string} text
 * @param {object} [extra]
 * @param {string} botToken
 */
export async function sendTelegramMessage(chatId, text, extra, botToken) {
  if (!botToken) return;

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    ...extra,
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

/**
 * Answers a Telegram callback query.
 * @param {string} queryId
 * @param {string} [text]
 * @param {string} botToken
 */
export async function answerCallbackQuery(queryId, text, botToken) {
  if (!botToken) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: queryId,
        text: text || "",
      }),
    });
  } catch (error) {
    console.error("Failed to answer callback query:", error);
  }
}

/**
 * Edits an existing Telegram message with link previews disabled.
 * @param {number|string} chatId
 * @param {number} messageId
 * @param {string} text
 * @param {object} [extra]
 * @param {string} botToken
 */
export async function editTelegramMessage(
  chatId,
  messageId,
  text,
  extra,
  botToken,
) {
  if (!botToken) return;

  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    ...extra,
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to edit Telegram message:", error);
  }
}

async function handlePendingPriceUpdate(chatId, text, env, botToken) {
  if (!env.SHOP_DATA) return false;

  let pendingPriceData = null;
  try {
    const stored = await env.SHOP_DATA.get(`pending_price:${chatId}`);
    if (stored) pendingPriceData = JSON.parse(stored);
  } catch {
    return false;
  }

  if (!pendingPriceData || typeof pendingPriceData.index !== "number") return false;
  if (!/^\d[\d,\s]*(?:mmk|ks)?$/i.test(text)) return false;

  const targetIndex = pendingPriceData.index;
  const categoryKey = pendingPriceData.categoryKey || "all";
  const originalMessageId = pendingPriceData.messageId;

  const result = await updatePlanPrice(env, targetIndex, text);
  await env.SHOP_DATA.delete(`pending_price:${chatId}`).catch(() => {});

  if (!result.success) return false;

  const plan = result.plan;
  const star = plan.highlight ? "⭐️ [POPULAR]" : "";
  const emojiDisplay = formatPlanEmoji(plan);
  const detailText = `✅ <b>Price updated to ${plan.price}!</b>\n\n${emojiDisplay} <b>${plan.title}</b>\n• <b>Duration:</b> ${plan.duration || "N/A"}\n• <b>Price:</b> <b>${plan.price}</b>\n• <b>Category:</b> ${plan.category || "General"}\n• <b>Status:</b> ${star || "Normal"}\n• <b>Custom Emoji ID:</b> <code>${plan.premium_emoji_id || "None"}</code>`;

  if (originalMessageId) {
    await editTelegramMessage(
      chatId,
      originalMessageId,
      detailText,
      { reply_markup: getPlanDetailsKeyboard(targetIndex, plan, categoryKey) },
      botToken,
    );
  } else {
    await sendTelegramMessage(
      chatId,
      detailText,
      { reply_markup: getPlanDetailsKeyboard(targetIndex, plan, categoryKey) },
      botToken,
    );
  }
  return true;
}

async function resolveEmojiFromMessage(message, text) {
  let emojiInfo = extractCustomEmojiInfo(message);
  if (!emojiInfo && text.includes("t.me/")) {
    const urlMatch = text.match(/https?:\/\/t\.me\/[^\s]+/i);
    if (urlMatch) emojiInfo = await resolveEmojiFromUrl(urlMatch[0]);
  }
  if (!emojiInfo) {
    const idMatch = text.match(/\b(\d{18,20})\b/);
    if (idMatch) {
      emojiInfo = { customEmojiId: idMatch[1], unicodeChar: "🎁" };
    }
  }
  return emojiInfo;
}

async function handlePendingEmojiUpdate(chatId, text, message, env, botToken) {
  const emojiInfo = await resolveEmojiFromMessage(message, text);
  if (!emojiInfo) return false;

  const pendingEmojiKey = `pending_emoji:${chatId}`;
  let targetIndex = -1;

  if (env.SHOP_DATA) {
    try {
      const stored = await env.SHOP_DATA.get(pendingEmojiKey);
      if (stored !== null && stored !== undefined) {
        targetIndex = Number.parseInt(stored, 10);
      }
    } catch {
      // Ignore KV read error
    }
  }

  if (targetIndex === -1) {
    const match = text.match(/^(?:emoji|\/emoji)\s+([^\s]+)/i);
    if (match) {
      const data = await getShopData(env);
      targetIndex = findPlanIndex(data.plans, match[1]);
    }
  }

  if (targetIndex === -1) return false;

  const data = await getShopData(env);
  const plan = data.plans[targetIndex];
  if (!plan) return false;

  await updatePlanEmoji(env, targetIndex, emojiInfo.customEmojiId, emojiInfo.unicodeChar);
  if (env.SHOP_DATA) {
    await env.SHOP_DATA.delete(pendingEmojiKey).catch(() => {});
  }
  await fetchAndCacheEmoji(emojiInfo.customEmojiId, env);

  const emojiDisplay = `<tg-emoji emoji-id="${emojiInfo.customEmojiId}">${emojiInfo.unicodeChar}</tg-emoji>`;
  const star = plan.highlight ? "⭐️ [POPULAR]" : "";
  const detailText = `✅ <b>Custom emoji updated!</b>\n\n${emojiDisplay} <b>${plan.title}</b>\n• <b>Duration:</b> ${plan.duration || "N/A"}\n• <b>Price:</b> <b>${plan.price}</b>\n• <b>Status:</b> ${star || "Normal"}\n• <b>Emoji ID:</b> <code>${emojiInfo.customEmojiId}</code>`;

  await sendTelegramMessage(
    chatId,
    detailText,
    { reply_markup: getPlanDetailsKeyboard(targetIndex, plan, "all") },
    botToken,
  );
  return true;
}

async function handlePriceCommand(chatId, text, env, botToken) {
  const parts = text.split(/\s+/).slice(1);
  if (parts.length < 2) {
    await sendTelegramMessage(
      chatId,
      "⚠️ <b>Usage:</b> <code>/price &lt;plan&gt; &lt;amount&gt;</code>\nExample: <code>/price 1m 24500</code>",
      {},
      botToken,
    );
    return;
  }

  const query = parts[0];
  const newPrice = parts.slice(1).join(" ");
  const result = await updatePlanPrice(env, query, newPrice);

  if (result.success) {
    await sendTelegramMessage(
      chatId,
      `✅ <b>Price Updated!</b>\n<b>${result.plan.title} (${result.plan.duration})</b> is now <b>${result.plan.price}</b>.`,
      {},
      botToken,
    );
  } else {
    await sendTelegramMessage(
      chatId,
      `❌ ${result.error || "Failed to update price"}`,
      {},
      botToken,
    );
  }
}

async function handleEmojiCommand(chatId, text, env, botToken) {
  const parts = text.split(/\s+/).slice(1);
  if (parts.length === 0) return;

  const data = await getShopData(env);
  const targetIndex = findPlanIndex(data.plans, parts[0]);
  if (targetIndex === -1) return;

  const plan = data.plans[targetIndex];
  if (env.SHOP_DATA) {
    await env.SHOP_DATA.put(`pending_emoji:${chatId}`, String(targetIndex), {
      expirationTtl: 600,
    });
  }
  await sendTelegramMessage(
    chatId,
    `🎭 <b>Set Custom Emoji</b>\n\nSend any Telegram Premium custom emoji or post link for <b>${plan.title} (${plan.duration})</b>:`,
    {},
    botToken,
  );
}

async function handleStandardCommand(chatId, text, env, appUrl, botToken) {
  if (text.startsWith("/start")) {
    const data = await getShopData(env);
    const welcome = `👋 <b>MPX Shop Manager</b>\n\nLive catalog: <b>${data.plans.length}</b> plans active.\nInstant sync: <a href="https://hhk.my.id/shop/">hhk.my.id/shop/</a>\n\nChoose an option:`;
    await sendTelegramMessage(chatId, welcome, { reply_markup: getMainMenuKeyboard(appUrl) }, botToken);
    return;
  }

  if (text.startsWith("/app") || text.startsWith("/admin")) {
    const msg = `📱 <b>Shop Mini App</b>\n\nVisual dashboard to edit products, prices, and animated custom emojis:`;
    await sendTelegramMessage(chatId, msg, { reply_markup: getAppLaunchKeyboard(appUrl) }, botToken);
    return;
  }

  if (text.startsWith("/help")) {
    const helpMsg = `📖 <b>Bot Commands</b>\n\n• <code>/plans</code> — Browse products by category\n• <code>/stars</code> — Telegram Stars price tiers\n• <code>/price &lt;plan&gt; &lt;amount&gt;</code> — Quick price update\n  <i>e.g.</i> <code>/price 50s 3500</code>\n• <code>/emoji &lt;plan&gt; [id|url]</code> — Set custom emoji\n  <i>e.g.</i> <code>/emoji 1m https://t.me/s/MPXPremiumEmojis/61</code>\n• <code>/app</code> — Open Mini App dashboard\n• <code>/start</code> — Return to main menu`;
    await sendTelegramMessage(chatId, helpMsg, { reply_markup: getHelpKeyboard() }, botToken);
    return;
  }

  if (text.startsWith("/stars")) {
    const data = await getShopData(env);
    const starPlans = data.plans.filter((p) => p.title.toLowerCase().includes("star"));
    const listText = starPlans
      .map((p) => `⭐️ ${p.duration} ➡️ <b>${p.price}</b>${p.highlight ? " ⭐️" : ""}`)
      .join("\n");
    const note = data.stars_info?.note ? `\n\n💡 <i>${data.stars_info.note}</i>` : "\n\n💡 <i>1 Star = 70 MMK. Min 50 Stars.</i>";
    await sendTelegramMessage(chatId, `⭐️ <b>Telegram Stars</b>\n\n${listText}${note}`, { reply_markup: getPlansListKeyboard(data.plans, "stars") }, botToken);
    return;
  }

  if (text.startsWith("/plans")) {
    const data = await getShopData(env);
    await sendTelegramMessage(chatId, `📦 <b>Product Categories</b>\n\nSelect a category to view and edit plans:`, { reply_markup: getCategoriesKeyboard(data.plans) }, botToken);
    return;
  }

  if (text.startsWith("/price")) {
    await handlePriceCommand(chatId, text, env, botToken);
    return;
  }

  if (text.startsWith("/emoji")) {
    await handleEmojiCommand(chatId, text, env, botToken);
    return;
  }

  await sendTelegramMessage(
    chatId,
    "🤖 Use <code>/plans</code> to browse products or <code>/app</code> for dashboard.",
    { reply_markup: getMainMenuKeyboard(appUrl) },
    botToken,
  );
}

/**
 * Dispatches text commands and messages.
 * @param {any} message
 * @param {Record<string, any>} env
 * @param {string} appUrl
 */
export async function handleMessage(message, env, appUrl) {
  const chatId = message.chat.id;
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const text = (message.text || message.caption || "").trim();

  if (await handlePendingPriceUpdate(chatId, text, env, botToken)) return;
  if (await handlePendingEmojiUpdate(chatId, text, message, env, botToken)) return;
  await handleStandardCommand(chatId, text, env, appUrl, botToken);
}

async function handleMenuCallback(data, queryId, chatId, messageId, appUrl, botToken, env) {
  if (data === "cmd_main") {
    await answerCallbackQuery(queryId, "", botToken);
    await editTelegramMessage(chatId, messageId, "👋 <b>MPX Shop Manager</b>\n\nChoose an action:", { reply_markup: getMainMenuKeyboard(appUrl) }, botToken);
    return true;
  }

  if (data === "cmd_app") {
    await answerCallbackQuery(queryId, "", botToken);
    await editTelegramMessage(chatId, messageId, "📱 <b>Shop Mini App Dashboard</b>\n\nVisual interface to edit products, prices, and custom emojis:", { reply_markup: getAppLaunchKeyboard(appUrl) }, botToken);
    return true;
  }

  if (data === "cmd_help") {
    await answerCallbackQuery(queryId, "", botToken);
    const helpMsg = `📖 <b>Bot Commands</b>\n\n• <code>/plans</code> — Browse products by category\n• <code>/stars</code> — Telegram Stars price list\n• <code>/price &lt;plan&gt; &lt;amount&gt;</code> — Fast price update\n• <code>/emoji &lt;plan&gt; [id|url]</code> — Set custom emoji\n• <code>/app</code> — Mini App dashboard\n• <code>/start</code> — Main menu`;
    await editTelegramMessage(chatId, messageId, helpMsg, { reply_markup: getHelpKeyboard() }, botToken);
    return true;
  }

  if (data === "cmd_stars") {
    await answerCallbackQuery(queryId, "", botToken);
    const shopData = await getShopData(env);
    const starPlans = shopData.plans.filter((p) => p.title.toLowerCase().includes("star"));
    const listText = starPlans.map((p) => `⭐️ ${p.duration} ➡️ <b>${p.price}</b>${p.highlight ? " ⭐️" : ""}`).join("\n");
    const note = shopData.stars_info?.note ? `\n\n💡 <i>${shopData.stars_info.note}</i>` : "\n\n💡 <i>1 Star = 70 MMK. Min 50 Stars.</i>";
    await editTelegramMessage(chatId, messageId, `⭐️ <b>Telegram Stars</b>\n\n${listText}${note}`, { reply_markup: getPlansListKeyboard(shopData.plans, "stars") }, botToken);
    return true;
  }

  if (data === "cmd_plans") {
    await answerCallbackQuery(queryId, "", botToken);
    const shopData = await getShopData(env);
    await editTelegramMessage(chatId, messageId, "📦 <b>Product Categories</b>\n\nSelect a category:", { reply_markup: getCategoriesKeyboard(shopData.plans) }, botToken);
    return true;
  }

  if (data === "cmd_payment") {
    await answerCallbackQuery(queryId, "", botToken);
    const shopData = await getShopData(env);
    const p = shopData.payment_details || {};
    const methods = shopData.payment_methods || [];
    const methodsList = methods.map((m) => `💳 ${m.name}`).join(" • ");
    const text = `💳 <b>Payment Details</b>\n\n• <b>Account Name:</b> ${p.account_name || "Hein Htet Kyaw"}\n• <b>Phone:</b> <code>${p.phone || "09695811161"}</code>\n• <b>Pay Note:</b> <code>${p.note || "Be Happy Money"}</code>\n\n<b>Supported Payment Methods:</b>\n${methodsList || "💳 AYA Pay • 💳 CB Pay • 💳 KBZ Pay • 💳 UAB Pay • 💳 Wave Money"}`;
    await editTelegramMessage(chatId, messageId, text, { reply_markup: getPaymentMethodsKeyboard() }, botToken);
    return true;
  }

  if (data.startsWith("cat:")) {
    await answerCallbackQuery(queryId, "", botToken);
    const categoryKey = data.split(":")[1] || "all";
    const shopData = await getShopData(env);
    const catTitles = {
      premium: "Telegram Premium Plans",
      stars: "Telegram Stars Tiers",
      gram: "Gram Plans",
      other: "Other Services",
      all: "All Service Plans",
    };
    const title = catTitles[categoryKey] || "Service Plans";
    await editTelegramMessage(chatId, messageId, `<b>${title}</b>\n\nSelect a plan to edit:`, { reply_markup: getPlansListKeyboard(shopData.plans, categoryKey) }, botToken);
    return true;
  }

  return false;
}

async function handlePlanDetailCallback(data, queryId, chatId, messageId, botToken, env) {
  const parts = data.split(":");
  const index = Number.parseInt(parts[1], 10);
  const categoryKey = parts[2] || "all";

  if (data.startsWith("plan:")) {
    await answerCallbackQuery(queryId, "", botToken);
    const shopData = await getShopData(env);
    const plan = shopData.plans[index];
    if (!plan) {
      await editTelegramMessage(chatId, messageId, "❌ Plan not found", {}, botToken);
      return true;
    }

    const star = plan.highlight ? "⭐️ [POPULAR]" : "";
    const emojiDisplay = formatPlanEmoji(plan);
    const text = `${emojiDisplay} <b>${plan.title}</b>\n• <b>Duration:</b> ${plan.duration || "N/A"}\n• <b>Price:</b> <b>${plan.price}</b>\n• <b>Category:</b> ${plan.category || "General"}\n• <b>Status:</b> ${star || "Normal"}\n• <b>Custom Emoji ID:</b> <code>${plan.premium_emoji_id || "None"}</code>`;
    await editTelegramMessage(chatId, messageId, text, { reply_markup: getPlanDetailsKeyboard(index, plan, categoryKey) }, botToken);
    return true;
  }

  if (data.startsWith("highlight:")) {
    const res = await togglePlanHighlight(env, index);
    await answerCallbackQuery(queryId, res.plan.highlight ? "Popular: ON" : "Popular: OFF", botToken);

    const star = res.plan.highlight ? "⭐️ [POPULAR]" : "";
    const emojiDisplay = formatPlanEmoji(res.plan);
    const text = `${emojiDisplay} <b>${res.plan.title}</b>\n• <b>Duration:</b> ${res.plan.duration || "N/A"}\n• <b>Price:</b> <b>${res.plan.price}</b>\n• <b>Category:</b> ${res.plan.category || "General"}\n• <b>Status:</b> ${star || "Normal"}\n• <b>Custom Emoji ID:</b> <code>${res.plan.premium_emoji_id || "None"}</code>`;
    await editTelegramMessage(chatId, messageId, text, { reply_markup: getPlanDetailsKeyboard(index, res.plan, categoryKey) }, botToken);
    return true;
  }

  return false;
}

async function handlePlanActionPrompt(data, queryId, chatId, messageId, botToken, env) {
  const parts = data.split(":");
  const index = Number.parseInt(parts[1], 10);
  const categoryKey = parts[2] || "all";
  const shopData = await getShopData(env);
  const plan = shopData.plans[index];
  if (!plan) return true;

  await answerCallbackQuery(queryId, "", botToken);

  if (data.startsWith("price:")) {
    if (env.SHOP_DATA) {
      await env.SHOP_DATA.put(
        `pending_price:${chatId}`,
        JSON.stringify({ index, categoryKey, messageId }),
        { expirationTtl: 300 },
      );
    }
    const promptText = `✏️ <b>Change Price</b> for <b>${plan.title} (${plan.duration})</b>\n\nCurrent Price: <b>${plan.price}</b>\n\nReply with the new price (e.g. <code>24500</code>):`;
    await editTelegramMessage(chatId, messageId, promptText, {
      reply_markup: { inline_keyboard: [[{ text: "Cancel", callback_data: `plan:${index}:${categoryKey}` }]] },
    }, botToken);
    return true;
  }

  if (data.startsWith("emoji:")) {
    if (env.SHOP_DATA) {
      await env.SHOP_DATA.put(`pending_emoji:${chatId}`, String(index), { expirationTtl: 300 });
    }
    const promptText = `🎭 <b>Set Custom Emoji</b> for <b>${plan.title} (${plan.duration})</b>\n\nSend any Telegram Premium custom emoji or post link:`;
    await editTelegramMessage(chatId, messageId, promptText, {
      reply_markup: { inline_keyboard: [[{ text: "Cancel", callback_data: `plan:${index}:${categoryKey}` }]] },
    }, botToken);
    return true;
  }

  return false;
}

async function handlePlanItemCallback(data, queryId, chatId, messageId, botToken, env) {
  if (data.startsWith("plan:") || data.startsWith("highlight:")) {
    return handlePlanDetailCallback(data, queryId, chatId, messageId, botToken, env);
  }
  if (data.startsWith("price:") || data.startsWith("emoji:")) {
    return handlePlanActionPrompt(data, queryId, chatId, messageId, botToken, env);
  }
  return false;
}

/**
 * Dispatches Telegram inline callback queries.
 * @param {any} callbackQuery
 * @param {Record<string, any>} env
 * @param {string} appUrl
 */
export async function handleCallbackQuery(callbackQuery, env, appUrl) {
  const queryId = callbackQuery.id;
  const data = callbackQuery.data;
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const botToken = env.TELEGRAM_BOT_TOKEN;

  if (await handleMenuCallback(data, queryId, chatId, messageId, appUrl, botToken, env)) return;
  if (await handlePlanItemCallback(data, queryId, chatId, messageId, botToken, env)) return;

  await answerCallbackQuery(queryId, "", botToken);
}
