/**
 * Shop data access layer with Cloudflare KV storage and fallback defaults.
 */

import DEFAULT_SERVICES from "../../data/services.json" with { type: "json" };
export { DEFAULT_SERVICES };
export const KV_KEY_SERVICES = "services";
export const KV_KEY_PREMIUM = "products:telegram_premium";
export const KV_KEY_STARS = "products:telegram_stars";
export const KV_KEY_GRAM = "products:gram";
export const KV_KEY_OTHER = "products:other";
export const KV_KEY_STORE_INFO = "store:info";
export const KV_KEY_PAYMENT_DETAILS = "payment:details";

/**
 * Segregates plans into 4 distinct product categories.
 * @param {Array<any>} plans
 * @returns {{ premium: any[], stars: any[], gram: any[], other: any[] }}
 */
export function segregatePlansByCategory(plans) {
  const premium = [];
  const stars = [];
  const gram = [];
  const other = [];

  for (const plan of plans) {
    const cat = (plan.category || "").toLowerCase();
    const title = (plan.title || "").toLowerCase();

    if (cat.includes("premium") || title.includes("premium")) {
      premium.push(plan);
    } else if (cat.includes("star") || title.includes("star")) {
      stars.push(plan);
    } else if (cat.includes("gram") || title.includes("gram")) {
      gram.push(plan);
    } else {
      other.push(plan);
    }
  }

  return { premium, stars, gram, other };
}

function reconstructFromCategoryKvs(categories, storeInfo, payment) {
  const [premium, stars, gram, other] = categories;
  if (!premium && !stars && !gram && !other) return null;

  const plans = [
    ...(Array.isArray(premium) ? premium : []),
    ...(Array.isArray(stars) ? stars : []),
    ...(Array.isArray(gram) ? gram : []),
    ...(Array.isArray(other) ? other : []),
  ];

  if (plans.length === 0) return null;

  return {
    store: storeInfo?.store || DEFAULT_SERVICES.store,
    stars_info: storeInfo?.stars_info || DEFAULT_SERVICES.stars_info,
    payment_details: payment?.payment_details || payment || DEFAULT_SERVICES.payment_details,
    payment_methods: payment?.payment_methods || DEFAULT_SERVICES.payment_methods,
    plans,
  };
}

/**
 * Retrieves the current shop data from Cloudflare KV, falling back to modular keys or default values.
 * @param {Record<string, any>} env
 * @returns {Promise<typeof DEFAULT_SERVICES>}
 */
export async function getShopData(env) {
  if (!env.SHOP_DATA) {
    return structuredClone(DEFAULT_SERVICES);
  }

  try {
    const cachedServices = await env.SHOP_DATA.get(KV_KEY_SERVICES, "json");
    if (cachedServices && Array.isArray(cachedServices.plans) && cachedServices.plans.length > 0) {
      return cachedServices;
    }

    // Fallback / modular reconstruction from category KV keys
    const [premium, stars, gram, other, storeInfo, payment] = await Promise.all([
      env.SHOP_DATA.get(KV_KEY_PREMIUM, "json"),
      env.SHOP_DATA.get(KV_KEY_STARS, "json"),
      env.SHOP_DATA.get(KV_KEY_GRAM, "json"),
      env.SHOP_DATA.get(KV_KEY_OTHER, "json"),
      env.SHOP_DATA.get(KV_KEY_STORE_INFO, "json"),
      env.SHOP_DATA.get(KV_KEY_PAYMENT_DETAILS, "json"),
    ]);

    const reconstructed = reconstructFromCategoryKvs(
      [premium, stars, gram, other],
      storeInfo,
      payment,
    );
    if (reconstructed) {
      return reconstructed;
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "warn",
        message: "Failed to read shop data from KV, using default",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  return structuredClone(DEFAULT_SERVICES);
}

async function normalizePlanEmoji(plan, env, resolveEmojiFromUrl, fetchAndCacheEmoji) {
  if (!plan.premium_emoji_id) return;

  const rawId = String(plan.premium_emoji_id).trim();
  if (rawId.includes("t.me/")) {
    const resolved = await resolveEmojiFromUrl(rawId);
    if (resolved) {
      plan.premium_emoji_id = resolved.customEmojiId;
      if (resolved.unicodeChar) plan.emoji = resolved.unicodeChar;
    }
  }

  // Trigger background cache if it's a numeric ID
  if (plan.premium_emoji_id && /^\d{18,20}$/.test(plan.premium_emoji_id)) {
    fetchAndCacheEmoji(plan.premium_emoji_id, env).catch(() => {});
  }
}

/**
 * Saves updated shop data to Cloudflare KV partitioned into 4 distinct product categories.
 * @param {Record<string, any>} env
 * @param {typeof DEFAULT_SERVICES} data
 * @returns {Promise<boolean>}
 */
export async function saveShopData(env, data) {
  if (!data || !Array.isArray(data.plans)) {
    throw new Error("Invalid shop data format");
  }

  // Auto-resolve any Telegram post URLs or raw links pasted in premium_emoji_id
  const { resolveEmojiFromUrl, fetchAndCacheEmoji } = await import("./emoji.js");
  for (const plan of data.plans) {
    await normalizePlanEmoji(plan, env, resolveEmojiFromUrl, fetchAndCacheEmoji);
  }

  if (!env.SHOP_DATA) {
    console.warn(
      "SHOP_DATA KV binding is not present; update not persisted to KV.",
    );
    return false;
  }

  const { premium, stars, gram, other } = segregatePlansByCategory(data.plans);

  const storeInfo = {
    store: data.store || DEFAULT_SERVICES.store,
    stars_info: data.stars_info || DEFAULT_SERVICES.stars_info,
  };

  const paymentDetails = {
    ...(data.payment_details || DEFAULT_SERVICES.payment_details),
    payment_methods: data.payment_methods || DEFAULT_SERVICES.payment_methods,
  };

  // Persist partitioned keys and unified services mirror in parallel
  await Promise.all([
    env.SHOP_DATA.put(KV_KEY_PREMIUM, JSON.stringify(premium, null, 2)),
    env.SHOP_DATA.put(KV_KEY_STARS, JSON.stringify(stars, null, 2)),
    env.SHOP_DATA.put(KV_KEY_GRAM, JSON.stringify(gram, null, 2)),
    env.SHOP_DATA.put(KV_KEY_OTHER, JSON.stringify(other, null, 2)),
    env.SHOP_DATA.put(KV_KEY_STORE_INFO, JSON.stringify(storeInfo, null, 2)),
    env.SHOP_DATA.put(KV_KEY_PAYMENT_DETAILS, JSON.stringify(paymentDetails, null, 2)),
    env.SHOP_DATA.put(KV_KEY_SERVICES, JSON.stringify(data, null, 2)),
  ]);

  return true;
}

/**
 * Normalizes price input string into a standard "X,XXX MMK" representation.
 * @param {string|number} priceInput
 * @returns {string}
 */
export function formatPrice(priceInput) {
  const digits = String(priceInput).replaceAll(/[^\d]/g, "");
  if (!digits) return String(priceInput);
  const number = Number.parseInt(digits, 10);
  return `${number.toLocaleString("en-US")} MMK`;
}

/**
 * Resolves a plan index based on query (number index, duration, or title keyword).
 * @param {typeof DEFAULT_SERVICES.plans} plans
 * @param {string|number} query
 * @returns {number}
 */
export function findPlanIndex(plans, query) {
  const q = String(query).trim().toLowerCase();

  // 1. Direct number (1-based or 0-based index)
  if (/^\d+$/.test(q)) {
    const num = Number.parseInt(q, 10);
    if (num >= 1 && num <= plans.length) return num - 1;
    if (num >= 0 && num < plans.length) return num;
  }

  // 2. Stars shortcuts (e.g. "50s", "50 stars", "1000s")
  const starMatch = /^(\d+)\s*(?:stars?|s)$/.exec(q);
  if (starMatch) {
    const targetCount = starMatch[1];
    const match = plans.findIndex(
      (p) =>
        p.title.toLowerCase().includes("star") &&
        p.duration.replaceAll(/[^\d]/g, "") === targetCount,
    );
    if (match !== -1) return match;
  }

  // 3. Exact duration match (e.g., "1m", "1 month", "1 year", "1y", "6m", "1 gram")
  const aliasMap = {
    "1y": "1 year",
    "1yr": "1 year",
    "6m": "6 months",
    "3m": "3 months",
    "1m": "1 month",
    "18m": "18 months",
    gram: "1 gram",
    "1g": "1 gram",
  };
  const normalizedDuration = aliasMap[q] || q;

  const durationMatch = plans.findIndex(
    (p) =>
      p.duration.toLowerCase() === normalizedDuration ||
      p.duration.toLowerCase().includes(normalizedDuration),
  );
  if (durationMatch !== -1) return durationMatch;

  // 4. Keyword in title (e.g., "gemini", "vpn", "telegram", "gram")
  return plans.findIndex((p) => p.title.toLowerCase().includes(q));
}

/**
 * Updates a plan's price and persists to KV.
 * @param {Record<string, any>} env
 * @param {string|number} query
 * @param {string} newPrice
 * @returns {Promise<{ success: boolean, plan?: any, error?: string }>}
 */
export async function updatePlanPrice(env, query, newPrice) {
  const data = await getShopData(env);
  const index = findPlanIndex(data.plans, query);

  if (index === -1) {
    return { success: false, error: `Plan not found for query: "${query}"` };
  }

  const formatted = formatPrice(newPrice);
  data.plans[index].price = formatted;
  await saveShopData(env, data);

  return { success: true, plan: data.plans[index], index };
}

/**
 * Updates a plan's premium emoji ID (and unicode fallback) and persists to KV.
 * @param {Record<string, any>} env
 * @param {number} planIndex
 * @param {string} customEmojiId
 * @param {string} [unicodeChar]
 * @returns {Promise<{ success: boolean, plan?: any, error?: string }>}
 */
export async function updatePlanEmoji(
  env,
  planIndex,
  customEmojiId,
  unicodeChar,
) {
  const data = await getShopData(env);
  if (!data.plans[planIndex]) {
    return { success: false, error: `Invalid plan index: ${planIndex}` };
  }

  data.plans[planIndex].premium_emoji_id = customEmojiId;
  if (unicodeChar) {
    data.plans[planIndex].emoji = unicodeChar;
  }
  delete data.plans[planIndex].twemoji_icon;
  await saveShopData(env, data);

  return { success: true, plan: data.plans[planIndex] };
}

/**
 * Toggles a plan's highlight (popular badge).
 * @param {Record<string, any>} env
 * @param {number} planIndex
 * @returns {Promise<{ success: boolean, plan?: any, error?: string }>}
 */
export async function togglePlanHighlight(env, planIndex) {
  const data = await getShopData(env);
  if (!data.plans[planIndex]) {
    return { success: false, error: `Invalid plan index: ${planIndex}` };
  }

  data.plans[planIndex].highlight = !data.plans[planIndex].highlight;
  await saveShopData(env, data);

  return { success: true, plan: data.plans[planIndex] };
}
