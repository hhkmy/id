import { handleEdgeInfo } from "./edge-info.js";
import { handleViewCounter } from "./view-counter.js";
import { applySecurity } from "./security.js";
import { createJsonResponse } from "./utils.js";

export { ViewCounter } from "./view-counter.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    // 1. Visitor edge info endpoint
    if (pathname === "/api/edge-info") {
      return handleEdgeInfo(request);
    }

    // 2. View counter endpoints
    if (pathname === "/api/views" || pathname === "/api/views/health") {
      try {
        return await handleViewCounter(request, env);
      } catch (error) {
        console.error(
          JSON.stringify({
            level: "error",
            message: "View counter request failed",
            path: url.pathname,
            error: error instanceof Error ? error.message : String(error),
          }),
        );
        return createJsonResponse(
          { error: "View counter request failed" },
          500,
        );
      }
    }

    // 3. Shop public API endpoint
    if (pathname === "/api/shop") {
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

    // 4. Telegram Webhook endpoint
    if (pathname === "/api/telegram/webhook") {
      const { handleTelegramWebhook } = await import("./telegram/index.js");
      return handleTelegramWebhook(request, env);
    }

    // 5. Telegram Mini App HTML dashboard
    if (pathname === "/api/telegram/miniapp") {
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

    // 6. Telegram Admin authentication check endpoint
    if (pathname === "/api/telegram/api/auth-check" && request.method === "POST") {
      try {
        const {
          verifyTelegramInitData,
          verifyTelegramWidgetAuth,
          createSessionToken,
          verifySessionToken,
        } = await import("./telegram/index.js");

        const body = await request.json();
        const secret = env.TELEGRAM_SECRET_TOKEN || env.TELEGRAM_BOT_TOKEN;

        // A. Existing Session Token check
        if (body.type === "session" && body.token) {
          const valid = await verifySessionToken(
            body.token,
            secret,
            env.TELEGRAM_ADMIN_ID,
          );
          if (valid) {
            return createJsonResponse({
              success: true,
              authorized: true,
              token: body.token,
            });
          }
          return createJsonResponse(
            { success: false, authorized: false, error: "Session expired" },
            401,
          );
        }

        // B. Secret Passcode check
        if (body.type === "secret" && body.secret) {
          if (
            env.TELEGRAM_SECRET_TOKEN &&
            body.secret === env.TELEGRAM_SECRET_TOKEN
          ) {
            const primaryAdminId =
              String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
            const token = await createSessionToken(
              primaryAdminId,
              secret,
            );
            return createJsonResponse({
              success: true,
              authorized: true,
              token,
              user: { id: primaryAdminId, name: "Admin" },
            });
          }
          return createJsonResponse(
            { success: false, authorized: false, error: "Invalid admin passcode" },
            401,
          );
        }

        // C. Telegram Mini App initData check
        if (body.type === "initData" && body.initData) {
          const auth = await verifyTelegramInitData(
            body.initData,
            env.TELEGRAM_BOT_TOKEN,
            env.TELEGRAM_ADMIN_ID,
          );
          if (auth.valid) {
            const primaryAdminId =
              auth.user?.id || String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
            const token = await createSessionToken(
              primaryAdminId,
              secret,
            );
            return createJsonResponse({
              success: true,
              authorized: true,
              token,
              user: auth.user,
            });
          }
          return createJsonResponse(
            { success: false, authorized: false, error: auth.error || "Unauthorized" },
            401,
          );
        }

        // D. Telegram Login Widget check
        if (body.type === "widget" && body.widgetData) {
          const auth = await verifyTelegramWidgetAuth(
            body.widgetData,
            env.TELEGRAM_BOT_TOKEN,
            env.TELEGRAM_ADMIN_ID,
          );
          if (auth.valid) {
            const primaryAdminId =
              auth.user?.id || String(env.TELEGRAM_ADMIN_ID || "100285683").split(/[\s,]+/)[0];
            const token = await createSessionToken(
              primaryAdminId,
              secret,
            );
            return createJsonResponse({
              success: true,
              authorized: true,
              token,
              user: auth.user,
            });
          }
          return createJsonResponse(
            { success: false, authorized: false, error: auth.error || "Unauthorized" },
            401,
          );
        }

        return createJsonResponse(
          { success: false, authorized: false, error: "Invalid auth request" },
          400,
        );
      } catch (error) {
        return createJsonResponse(
          { success: false, error: error instanceof Error ? error.message : "Auth check failed" },
          500,
        );
      }
    }

    // 7. Telegram Mini App persistence endpoint
    if (pathname === "/api/telegram/api/save" && request.method === "POST") {
      try {
        const {
          verifyTelegramInitData,
          verifySessionToken,
          saveShopData,
        } = await import("./telegram/index.js");

        const authHeader = request.headers.get("Authorization") || "";
        const initData = request.headers.get("X-Telegram-Init-Data") || "";
        const secret = env.TELEGRAM_SECRET_TOKEN || env.TELEGRAM_BOT_TOKEN;

        let authorized = false;

        if (authHeader.startsWith("Bearer ")) {
          const token = authHeader.slice("Bearer ".length).trim();
          authorized = await verifySessionToken(
            token,
            secret,
            env.TELEGRAM_ADMIN_ID,
          );
        } else if (initData) {
          const auth = await verifyTelegramInitData(
            initData,
            env.TELEGRAM_BOT_TOKEN,
            env.TELEGRAM_ADMIN_ID,
          );
          authorized = auth.valid;
        }

        if (!authorized) {
          return createJsonResponse(
            { error: "Unauthorized: Admin privileges required" },
            401,
          );
        }

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

    // 8. Telegram Premium Emoji serving & caching proxy
    if (url.pathname.startsWith("/api/emoji/")) {
      const emojiId = url.pathname.slice("/api/emoji/".length);
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

    // 9. Static & Dynamic Telegram Premium Emojis fallback
    if (url.pathname.startsWith("/icons/premiumemojis/")) {
      const match = url.pathname.match(/\/icons\/premiumemojis\/(\d+)\.tgs\.base64/);
      if (match) {
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
      }
    }

    // 8. Static Assets with Security Headers & CSP
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
  },
};
