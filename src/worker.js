const jsonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const createJsonResponse = (data, status = 200, cacheControl = "no-store") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...jsonHeaders,
      "Cache-Control": cacheControl,
    },
  });

const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

const parseViewPath = async (request, url) => {
  if (request.method === "GET") {
    return url.searchParams.get("path");
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return body.path;
  }

  const body = await request.text();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return new URLSearchParams(body).get("path");
  }

  try {
    return JSON.parse(body).path;
  } catch {
    return new URLSearchParams(body).get("path");
  }
};

const isBotRequest = (request) => {
  const userAgent = request.headers.get("User-Agent") || "";
  return /bot|crawl|spider|scraper|curl|wget/i.test(userAgent);
};

const handleAllViews = async (env) => {
  const keys = await env.BLOG_VIEWS.list({ prefix: "views:" });
  const views = {};

  await Promise.all(
    keys.keys.map(async (key) => {
      const path = key.name.replace("views:", "");
      const count = await env.BLOG_VIEWS.get(key.name);
      views[path] = parseInt(count, 10) || 0;
    }),
  );

  return createJsonResponse(
    {
      success: true,
      totalPosts: Object.keys(views).length,
      views,
      timestamp: new Date().toISOString(),
    },
    200,
    "public, max-age=60",
  );
};

const handleTopViews = async (env, url) => {
  const limit = parseInt(url.searchParams.get("limit"), 10) || 10;
  const keys = await env.BLOG_VIEWS.list({ prefix: "views:" });
  const views = [];

  await Promise.all(
    keys.keys.map(async (key) => {
      const count = await env.BLOG_VIEWS.get(key.name);
      views.push({
        path: key.name.replace("views:", ""),
        views: parseInt(count, 10) || 0,
      });
    }),
  );

  return createJsonResponse(
    {
      success: true,
      topViews: views.sort((a, b) => b.views - a.views).slice(0, limit),
      timestamp: new Date().toISOString(),
    },
    200,
    "public, max-age=60",
  );
};

const handleViewCounter = async (request, env) => {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: jsonHeaders });
  }

  if (url.pathname === "/api/views/health") {
    return createJsonResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      kvAvailable: Boolean(env.BLOG_VIEWS),
    });
  }

  if (!["GET", "POST"].includes(request.method)) {
    return createJsonResponse(
      {
        error: "Method not allowed",
        allowedMethods: ["GET", "POST", "OPTIONS"],
      },
      405,
    );
  }

  const path = await parseViewPath(request, url);
  if (path === "ALL_VIEWS") {
    return handleAllViews(env);
  }
  if (path === "TOP_VIEWS") {
    return handleTopViews(env, url);
  }
  if (!path) {
    return createJsonResponse(
      {
        error: "Missing path parameter",
        usage:
          'GET /api/views?path=/articles/example/ or POST /api/views with {"path":"/articles/example/"}',
      },
      400,
    );
  }

  const normalizedPath = normalizePath(path);
  const countKey = `views:${normalizedPath}`;

  if (request.method === "GET") {
    const views = await env.BLOG_VIEWS.get(countKey);
    return createJsonResponse(
      {
        success: true,
        path: normalizedPath,
        views: parseInt(views, 10) || 0,
        timestamp: new Date().toISOString(),
      },
      200,
      "public, max-age=60",
    );
  }

  if (isBotRequest(request)) {
    const views = await env.BLOG_VIEWS.get(countKey);
    return createJsonResponse({
      success: true,
      path: normalizedPath,
      views: parseInt(views, 10) || 0,
      incremented: false,
    });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateLimitKey = `rate:${ip}:${countKey}`;
  const lastIncrement = await env.BLOG_VIEWS.get(rateLimitKey);

  if (lastIncrement && Date.now() - parseInt(lastIncrement, 10) < 30000) {
    const views = await env.BLOG_VIEWS.get(countKey);
    return createJsonResponse({
      success: true,
      path: normalizedPath,
      views: parseInt(views, 10) || 0,
      incremented: false,
      rateLimited: true,
    });
  }

  const currentViews = await env.BLOG_VIEWS.get(countKey);
  const views = (parseInt(currentViews, 10) || 0) + 1;
  await env.BLOG_VIEWS.put(countKey, views.toString());
  await env.BLOG_VIEWS.put(rateLimitKey, Date.now().toString(), {
    expirationTtl: 60,
  });

  return createJsonResponse({
    success: true,
    path: normalizedPath,
    views,
    incremented: true,
    timestamp: new Date().toISOString(),
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/views" || url.pathname === "/api/views/health") {
      try {
        return await handleViewCounter(request, env);
      } catch (error) {
        return createJsonResponse(
          {
            error: "View counter request failed",
            message: error.message,
          },
          500,
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
