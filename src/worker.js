import { handleEdgeInfo } from "./edge-info.js";
import { handleViewCounter } from "./view-counter.js";
import { applySecurity } from "./security.js";
import { createJsonResponse } from "./utils.js";

export { ViewCounter } from "./view-counter.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Visitor edge info endpoint
    if (url.pathname === "/api/edge-info") {
      return handleEdgeInfo(request);
    }

    // 2. View counter endpoints
    if (url.pathname === "/api/views" || url.pathname === "/api/views/health") {
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

    // 3. Static Assets with Security Headers & CSP
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
