/**
 * Security and authentication helpers for Telegram Bot and Mini App.
 */

/**
 * Validates incoming Telegram Webhook secret token header.
 * @param {Request} request
 * @param {Record<string, any>} env
 * @returns {boolean}
 */
export function verifyWebhookSecret(request, env) {
  if (!env.TELEGRAM_SECRET_TOKEN) {
    return true; // If secret token is not yet configured, allow for initial testing
  }
  const token = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  return token === env.TELEGRAM_SECRET_TOKEN;
}

export const DEFAULT_ADMIN_IDS = ["100285683", "2042832333"];

/**
 * Gets all authorized admin IDs from environment and defaults.
 * @param {Record<string, any>} [env]
 * @returns {string[]}
 */
export function getAuthorizedAdminIds(env) {
  const ids = new Set(DEFAULT_ADMIN_IDS);
  if (env?.TELEGRAM_ADMIN_ID) {
    String(env.TELEGRAM_ADMIN_ID)
      .split(/[\s,]+/)
      .forEach((id) => id.trim() && ids.add(id.trim()));
  }
  if (env?.TELEGRAM_ADMIN_IDS) {
    String(env.TELEGRAM_ADMIN_IDS)
      .split(/[\s,]+/)
      .forEach((id) => id.trim() && ids.add(id.trim()));
  }
  return Array.from(ids);
}

/**
 * Checks if a given Telegram user ID matches an authorized admin.
 * @param {number|string} userId
 * @param {Record<string, any>} [env]
 * @returns {boolean}
 */
export function isAdmin(userId, env) {
  if (!userId) return false;
  const allowed = getAuthorizedAdminIds(env);
  return allowed.includes(String(userId));
}

/**
 * Validates if user ID matches expected admin or any authorized admin.
 * @param {number|string} userId
 * @param {string|number|string[]} [expectedAdminId]
 * @param {Record<string, any>} [env]
 * @returns {boolean}
 */
export function checkAdminAllowed(userId, expectedAdminId, env) {
  if (!userId) return false;
  const allowed = new Set(getAuthorizedAdminIds(env));
  if (expectedAdminId) {
    const custom = Array.isArray(expectedAdminId)
      ? expectedAdminId.map(String)
      : String(expectedAdminId).split(/[\s,]+/);
    custom.forEach((id) => id.trim() && allowed.add(id.trim()));
  }
  return allowed.has(String(userId));
}

/**
 * Validates Telegram Mini App initData HMAC-SHA256 signature.
 * @param {string} initDataString
 * @param {string} botToken
 * @param {string|number} [expectedAdminId]
 * @returns {Promise<{ valid: boolean, user?: any, error?: string }>}
 */
export async function verifyTelegramInitData(
  initDataString,
  botToken,
  expectedAdminId,
) {
  if (!initDataString) {
    return { valid: false, error: "Missing initData" };
  }

  if (!botToken) {
    return { valid: false, error: "Bot token not configured on server" };
  }

  try {
    const params = new URLSearchParams(initDataString);
    const hash = params.get("hash");
    if (!hash) {
      return { valid: false, error: "Missing hash parameter" };
    }

    params.delete("hash");

    // Sort parameters alphabetically
    const entries = Array.from(params.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

    const encoder = new TextEncoder();

    // 1. secret_key = HMAC_SHA256("WebAppData", botToken)
    const webAppDataKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode("WebAppData"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const secretKeyBytes = await crypto.subtle.sign(
      "HMAC",
      webAppDataKey,
      encoder.encode(botToken),
    );

    // 2. data_hash = HMAC_SHA256(secretKeyBytes, dataCheckString)
    const secretKey = await crypto.subtle.importKey(
      "raw",
      secretKeyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      secretKey,
      encoder.encode(dataCheckString),
    );

    // Convert to hex string
    const hex = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex !== hash) {
      return { valid: false, error: "Invalid HMAC signature" };
    }

    // Parse user object
    const userStr = params.get("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && !checkAdminAllowed(user.id, expectedAdminId)) {
      return { valid: false, error: "Unauthorized user" };
    }

    return { valid: true, user };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

/**
 * Validates Telegram Login Widget authentication data.
 * @param {Record<string, any>} data
 * @param {string} botToken
 * @param {string|number} [expectedAdminId]
 * @returns {Promise<{ valid: boolean, user?: any, error?: string }>}
 */
export async function verifyTelegramWidgetAuth(
  data,
  botToken,
  expectedAdminId,
) {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Missing widget data" };
  }

  const { hash, ...fields } = data;
  if (!hash) {
    return { valid: false, error: "Missing hash parameter" };
  }

  if (!botToken) {
    return { valid: false, error: "Bot token not configured" };
  }

  try {
    const encoder = new TextEncoder();

    // 1. secret_key = SHA256(botToken)
    const secretKeyBytes = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(botToken),
    );

    // 2. data_check_string
    const sortedKeys = Object.keys(fields)
      .filter((k) => fields[k] !== undefined && fields[k] !== null)
      .sort((a, b) => a.localeCompare(b));
    const dataCheckString = sortedKeys
      .map((k) => `${k}=${fields[k]}`)
      .join("\n");

    // 3. HMAC_SHA256(secret_key, dataCheckString)
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      secretKeyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(dataCheckString),
    );

    const hex = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex !== hash) {
      return { valid: false, error: "Invalid widget signature" };
    }

    // Check auth_date (within 24 hours)
    if (fields.auth_date) {
      const now = Math.floor(Date.now() / 1000);
      const authDate = Number.parseInt(fields.auth_date, 10);
      if (Math.abs(now - authDate) > 86400) {
        return { valid: false, error: "Widget login has expired" };
      }
    }

    if (fields.id && !checkAdminAllowed(fields.id, expectedAdminId)) {
      return { valid: false, error: "Unauthorized user ID" };
    }

    return { valid: true, user: fields };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Widget verification failed",
    };
  }
}

/**
 * Creates a signed admin session token.
 * @param {string|number} userId
 * @param {string} secret
 * @returns {Promise<string>}
 */
export async function createSessionToken(userId, secret) {
  const timestamp = Date.now();
  const payload = `${timestamp}.${userId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${hex}`;
}

/**
 * Verifies a signed admin session token.
 * @param {string} token
 * @param {string} secret
 * @param {string|number} [expectedAdminId]
 * @returns {Promise<boolean>}
 */
export async function verifySessionToken(token, secret, expectedAdminId) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestampStr, userId, sigHex] = parts;
  const timestamp = Number.parseInt(timestampStr, 10);
  if (Number.isNaN(timestamp) || Date.now() - timestamp > 7 * 86400 * 1000) {
    return false; // Expired after 7 days
  }

  if (!checkAdminAllowed(userId, expectedAdminId)) {
    return false;
  }

  const payload = `${timestampStr}.${userId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const sigBytes = new Uint8Array(
    sigHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) || [],
  );

  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
}
