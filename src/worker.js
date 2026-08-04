import { DurableObject } from "cloudflare:workers";

const RATE_LIMIT_WINDOW_MS = 30_000;
const MAX_PATH_LENGTH = 512;
const MAX_TOP_VIEW_LIMIT = 100;

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

const isValidArticlePath = (path) =>
  typeof path === "string" &&
  path.length <= MAX_PATH_LENGTH &&
  /^\/articles\/[a-z0-9][a-z0-9+._~!$&'()*+,;=:@%/-]*\/?$/i.test(path);

const parseViewPath = async (request, url) => {
  if (request.method === "GET") {
    return url.searchParams.get("path");
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return body?.path;
  }

  const body = await request.text();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return new URLSearchParams(body).get("path");
  }

  try {
    return JSON.parse(body)?.path;
  } catch {
    return new URLSearchParams(body).get("path");
  }
};

const isBotRequest = (request) => {
  const userAgent = request.headers.get("User-Agent") || "";
  return /bot|crawl|spider|scraper|curl|wget/i.test(userAgent);
};

const hashVisitor = async (request) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const bytes = new TextEncoder().encode(`${ip}\n${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const getCounterStub = (env, path) => env.VIEW_COUNTER.getByName(path);

const getLegacyCount = async (env, path) => {
  const value = await env.BLOG_VIEWS.get(`views:${path}`);
  return Math.max(0, Number.parseInt(value, 10) || 0);
};

const listLegacyViewEntries = async (env) => {
  const entries = [];
  let cursor;

  do {
    const page = await env.BLOG_VIEWS.list({ prefix: "views:", cursor });
    const values = await Promise.all(
      page.keys.map((key) => env.BLOG_VIEWS.get(key.name)),
    );
    page.keys.forEach((key, index) => {
      entries.push({
        path: key.name.slice("views:".length),
        legacyCount: Math.max(0, Number.parseInt(values[index], 10) || 0),
      });
    });
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return entries;
};

const getAccurateViews = async (env) => {
  const entries = await listLegacyViewEntries(env);
  return Promise.all(
    entries.map(async ({ path, legacyCount }) => ({
      path,
      views: await getCounterStub(env, path).getCount(legacyCount),
    })),
  );
};

const handleAllViews = async (env) => {
  const entries = await getAccurateViews(env);
  const views = Object.fromEntries(
    entries.map(({ path, views: count }) => [path, count]),
  );

  return createJsonResponse(
    {
      success: true,
      totalPosts: entries.length,
      views,
      timestamp: new Date().toISOString(),
    },
    200,
    "public, max-age=60",
  );
};

const handleTopViews = async (env, url) => {
  const requestedLimit =
    Number.parseInt(url.searchParams.get("limit"), 10) || 10;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_TOP_VIEW_LIMIT);
  const views = await getAccurateViews(env);

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
      durableObjectAvailable: Boolean(env.VIEW_COUNTER),
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
  if (!isValidArticlePath(path)) {
    return createJsonResponse(
      {
        error: "Invalid article path",
        usage:
          'GET /api/views?path=/articles/example/ or POST /api/views with {"path":"/articles/example/"}',
      },
      400,
    );
  }

  const normalizedPath = normalizePath(path);
  const legacyCount = await getLegacyCount(env, normalizedPath);
  const counter = getCounterStub(env, normalizedPath);

  if (request.method === "GET") {
    const views = await counter.getCount(legacyCount);
    return createJsonResponse(
      {
        success: true,
        path: normalizedPath,
        views,
        timestamp: new Date().toISOString(),
      },
      200,
      "public, max-age=60",
    );
  }

  if (isBotRequest(request)) {
    const views = await counter.getCount(legacyCount);
    return createJsonResponse({
      success: true,
      path: normalizedPath,
      views,
      incremented: false,
    });
  }

  const visitorKey = await hashVisitor(request);
  const result = await counter.increment(legacyCount, visitorKey, Date.now());

  // Preserve the existing KV key as a discovery index and migration fallback.
  // Reads use the Durable Object, so KV propagation cannot lose an increment.
  await env.BLOG_VIEWS.put(`views:${normalizedPath}`, result.views.toString());

  return createJsonResponse({
    success: true,
    path: normalizedPath,
    ...result,
    timestamp: new Date().toISOString(),
  });
};

export class ViewCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        value INTEGER NOT NULL CHECK (value >= 0)
      );
      CREATE TABLE IF NOT EXISTS visitor_limits (
        visitor_key TEXT PRIMARY KEY,
        expires_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS visitor_limits_expiry
        ON visitor_limits (expires_at);
    `);
  }

  initialize(initialCount) {
    const safeInitialCount = Math.max(
      0,
      Number.parseInt(initialCount, 10) || 0,
    );
    this.ctx.storage.sql.exec(
      "INSERT OR IGNORE INTO counter (id, value) VALUES (1, ?)",
      safeInitialCount,
    );
  }

  getCount(initialCount = 0) {
    this.initialize(initialCount);
    return this.ctx.storage.sql
      .exec("SELECT value FROM counter WHERE id = 1")
      .one().value;
  }

  increment(initialCount, visitorKey, now) {
    this.initialize(initialCount);
    this.ctx.storage.sql.exec(
      "DELETE FROM visitor_limits WHERE expires_at <= ?",
      now,
    );

    const accepted = this.ctx.storage.sql
      .exec(
        "INSERT OR IGNORE INTO visitor_limits (visitor_key, expires_at) VALUES (?, ?) RETURNING visitor_key",
        visitorKey,
        now + RATE_LIMIT_WINDOW_MS,
      )
      .toArray();

    if (accepted.length === 0) {
      return {
        views: this.getCount(),
        incremented: false,
        rateLimited: true,
      };
    }

    const views = this.ctx.storage.sql
      .exec("UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value")
      .one().value;

    return {
      views,
      incremented: true,
      rateLimited: false,
    };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
          {
            error: "View counter request failed",
          },
          500,
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
