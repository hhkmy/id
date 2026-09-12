import { handleEdgeInfo } from "./edge-info.js";
import { handleViewCounter } from "./view-counter.js";
import { applySecurity } from "./security.js";
import { createJsonResponse } from "./utils.js";

export { ViewCounter } from "./view-counter.js";

function getNormalizedPathname(pathname) {
  let end = pathname.length;
  while (end > 1 && pathname.charCodeAt(end - 1) === 47) {
    end--;
  }
  return end === pathname.length ? pathname : pathname.slice(0, end);
}

async function handleViewCounterEndpoint(request, env, path) {
  try {
    return await handleViewCounter(request, env);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "View counter request failed",
        path,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return createJsonResponse({ error: "View counter request failed" }, 500);
  }
}

async function handleShopData(env) {
  try {
    const { getShopData } = await import("./telegram/index.js");
    const data = await getShopData(env);
    return createJsonResponse(
      data,
      200,
      "public, max-age=60, stale-while-revalidate=300",
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to fetch shop data",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return createJsonResponse({ error: "Failed to load shop data" }, 500);
  }
}

async function renderMiniAppResponse() {
  const { renderMiniAppHtml } = await import("./telegram/index.js");
  const headers = new Headers({
    "Content-Type": "text/html; charset=UTF-8",
    "Cache-Control": "no-cache, no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy":
      "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org https://*.t.me;",
  });
  headers.delete("X-Frame-Options");
  return new Response(renderMiniAppHtml(), {
    status: 200,
    headers,
  });
}

async function authenticateBody(body, env, secret) {
  const {
    verifyTelegramInitData,
    verifyTelegramWidgetAuth,
    createSessionToken,
    verifySessionToken,
  } = await import("./telegram/index.js");

  if (body.type === "session" && body.token) {
    const valid = await verifySessionToken(body.token, secret, env.TELEGRAM_ADMIN_ID);
    return valid
      ? { status: 200, data: { success: true, authorized: true, token: body.token } }
      : { status: 401, data: { success: false, authorized: false, error: "Session expired" } };
  }

  if (body.type === "secret" && body.secret) {
    if (env.TELEGRAM_SECRET_TOKEN && body.secret === env.TELEGRAM_SECRET_TOKEN) {
      const primaryAdminId = String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
      const token = await createSessionToken(primaryAdminId, secret);
      return { status: 200, data: { success: true, authorized: true, token, user: { id: primaryAdminId, name: "Admin" } } };
    }
    return { status: 401, data: { success: false, authorized: false, error: "Invalid admin passcode" } };
  }

  if (body.type === "initData" && body.initData) {
    const auth = await verifyTelegramInitData(body.initData, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_ADMIN_ID);
    if (auth.valid) {
      const primaryAdminId = auth.user?.id || String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
      const token = await createSessionToken(primaryAdminId, secret);
      return { status: 200, data: { success: true, authorized: true, token, user: auth.user } };
    }
    return { status: 401, data: { success: false, authorized: false, error: auth.error || "Unauthorized" } };
  }

  if (body.type === "widget" && body.widgetData) {
    const auth = await verifyTelegramWidgetAuth(body.widgetData, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_ADMIN_ID);
    if (auth.valid) {
      const primaryAdminId = auth.user?.id || String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
      const token = await createSessionToken(primaryAdminId, secret);
      return { status: 200, data: { success: true, authorized: true, token, user: auth.user } };
    }
    return { status: 401, data: { success: false, authorized: false, error: auth.error || "Unauthorized" } };
  }

  return { status: 400, data: { success: false, authorized: false, error: "Invalid auth request" } };
}

async function handleTelegramAuthCheck(request, env) {
  try {
    const body = await request.json();
    const secret = env.TELEGRAM_SECRET_TOKEN || env.TELEGRAM_BOT_TOKEN;
    const result = await authenticateBody(body, env, secret);
    return createJsonResponse(result.data, result.status);
  } catch (error) {
    return createJsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Auth check failed" },
      500,
    );
  }
}

async function isSaveAuthorized(request, env) {
  const { verifyTelegramInitData, verifySessionToken } = await import("./telegram/index.js");
  const authHeader = request.headers.get("Authorization") || "";
  const initData = request.headers.get("X-Telegram-Init-Data") || "";
  const secret = env.TELEGRAM_SECRET_TOKEN || env.TELEGRAM_BOT_TOKEN;

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    return verifySessionToken(token, secret, env.TELEGRAM_ADMIN_ID);
  }
  if (initData) {
    const auth = await verifyTelegramInitData(initData, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_ADMIN_ID);
    return auth.valid;
  }
  return false;
}

async function handleTelegramSave(request, env) {
  try {
    const authorized = await isSaveAuthorized(request, env);
    if (!authorized) {
      return createJsonResponse(
        { error: "Unauthorized: Admin privileges required" },
        401,
      );
    }

    const { saveShopData } = await import("./telegram/index.js");
    const body = await request.json();
    await saveShopData(env, body);
    return createJsonResponse({ success: true });
  } catch (error) {
    return createJsonResponse(
      { error: error instanceof Error ? error.message : "Save failed" },
      400,
    );
  }
}

async function handleEmojiProxy(pathname, env) {
  const emojiId = pathname.slice("/api/emoji/".length);
  const { fetchAndCacheEmoji } = await import("./telegram/index.js");
  const base64 = await fetchAndCacheEmoji(emojiId, env);
  if (!base64) {
    return new Response("Emoji not found", { status: 404 });
  }
  return new Response(base64, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function handleEmojiAssetFallback(request, env, pathname) {
  const match = /\/icons\/premiumemojis\/(\d+)\.tgs\.base64/.exec(pathname);
  if (!match) return null;

  try {
    const assetRes = await env.ASSETS.fetch(request);
    if (assetRes.status === 200) {
      return assetRes;
    }
  } catch {
    // Ignore asset fetch error
  }

  const emojiId = match[1];
  const { fetchAndCacheEmoji } = await import("./telegram/index.js");
  const base64 = await fetchAndCacheEmoji(emojiId, env);
  if (base64) {
    return new Response(base64, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  return null;
}

async function handleStaticAsset(request, env) {
  try {
    const response = await env.ASSETS.fetch(request);
    return await applySecurity(response, request);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Asset fetch failed",
        url: request.url,
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    return new Response("Internal Server Error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = getNormalizedPathname(url.pathname);

    if (pathname === "/api/edge-info") {
      return handleEdgeInfo(request);
    }

    if (pathname === "/api/views" || pathname === "/api/views/health") {
      return handleViewCounterEndpoint(request, env, url.pathname);
    }

    if (pathname === "/api/shop") {
      return handleShopData(env);
    }

    if (pathname === "/api/telegram/webhook") {
      const { handleTelegramWebhook } = await import("./telegram/index.js");
      return handleTelegramWebhook(request, env);
    }

    if (pathname === "/api/telegram/miniapp") {
      return renderMiniAppResponse();
    }

    if (pathname === "/api/telegram/api/auth-check" && request.method === "POST") {
      return handleTelegramAuthCheck(request, env);
    }

    if (pathname === "/api/telegram/api/save" && request.method === "POST") {
      return handleTelegramSave(request, env);
    }

    if (pathname.startsWith("/api/emoji/")) {
      return handleEmojiProxy(pathname, env);
    }

    if (pathname.startsWith("/icons/premiumemojis/")) {
      const fallback = await handleEmojiAssetFallback(request, env, pathname);
      if (fallback) return fallback;
    }

    return handleStaticAsset(request, env);
  },
};
