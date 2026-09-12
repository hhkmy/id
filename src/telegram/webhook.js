/**
 * Telegram Bot webhook request handler.
 */

import { verifyWebhookSecret, isAdmin } from "./auth.js";
import { handleMessage, handleCallbackQuery } from "./commands.js";

/**
 * Handles incoming webhook POST requests from Telegram.
 * @param {Request} request
 * @param {Record<string, any>} env
 * @returns {Promise<Response>}
 */
export async function handleTelegramWebhook(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 1. Verify Secret Token
  if (!verifyWebhookSecret(request, env)) {
    return new Response(JSON.stringify({ error: "Invalid secret token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let update;
  try {
    update = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const appUrl = `${url.origin}/api/telegram/miniapp`;

  // 2. Dispatch updates
  try {
    if (update.message) {
      if (isAdmin(update.message.from?.id, env)) {
        await handleMessage(update.message, env, appUrl);
      }
    } else if (update.callback_query) {
      if (isAdmin(update.callback_query.from?.id, env)) {
        await handleCallbackQuery(update.callback_query, env, appUrl);
      }
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error processing Telegram webhook",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  // Telegram expects 200 OK response
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
