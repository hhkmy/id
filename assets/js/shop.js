/**
 * Client-side hydration for Shop page.
 * Seamlessly synchronizes live product prices, popular highlights,
 * and payment details from Cloudflare Workers/KV with static fallback DOM.
 */

import { initSpoiler } from "./spoiler.js";
import { initTelegramPremiumEmoji } from "./telegram-premium-emoji.js";

/**
 * Hydrates an individual plan card with live data.
 * @param {HTMLElement} card
 * @param {any} plan
 */
function hydratePlanCard(card, plan) {
  if (!card || !plan) return;

  // 1. Update Price if changed
  const priceEl = card.querySelector("[data-shop-price]");
  if (priceEl && plan.price) {
    const spoiler = priceEl.querySelector(".spoiler");
    if (spoiler && spoiler.textContent.trim() !== plan.price) {
      const inner = spoiler.querySelector(".spoiler-inner");
      if (inner) {
        inner.textContent = plan.price;
      } else {
        spoiler.textContent = plan.price;
      }
    } else if (!spoiler && priceEl.textContent.trim() !== plan.price) {
      priceEl.textContent = plan.price;
    }
  }

  // 2. Update Popular badge & highlight class
  const popularBadge = card.querySelector("[data-shop-popular-badge]");
  if (plan.highlight) {
    card.classList.add("shop-card-highlight");
    if (!popularBadge) {
      const header = card.querySelector(".shop-card-header");
      if (header) {
        const badge = document.createElement("span");
        badge.className = "shop-popular-badge";
        badge.dataset.shopPopularBadge = "true";
        badge.innerHTML = "<span>Popular</span>";
        header.appendChild(badge);
      }
    }
  } else {
    card.classList.remove("shop-card-highlight");
    if (popularBadge) {
      popularBadge.remove();
    }
  }

  // 3. Update Buy URL if changed
  const buyBtn = card.querySelector("[data-shop-buy-btn]");
  if (buyBtn && plan.buy_url && buyBtn.getAttribute("href") !== plan.buy_url) {
    buyBtn.setAttribute("href", plan.buy_url);
  }

  // 4. Update Custom Emoji if changed
  if (plan.premium_emoji_id) {
    const emojiEl = card.querySelector("[data-shop-emoji]");
    if (emojiEl) {
      const currentSource = emojiEl.dataset.telegramEmoji || "";
      const expectedSource = `/api/emoji/${plan.premium_emoji_id}`;
      const staticSource = `/icons/premiumemojis/${plan.premium_emoji_id}.tgs.base64`;

      if (currentSource !== expectedSource && currentSource !== staticSource) {
        emojiEl.dataset.telegramEmoji = expectedSource;
        delete emojiEl.dataset.emojiState;
        emojiEl.replaceChildren();
        initTelegramPremiumEmoji();
      }
    }
  }
}

/**
 * Hydrates payment details from live shop data.
 * @param {any} paymentDetails
 */
function hydratePaymentDetails(paymentDetails) {
  if (!paymentDetails) return;

  if (paymentDetails.phone) {
    const phoneBtn = document.querySelector("[data-shop-pay-phone]");
    if (phoneBtn && phoneBtn.textContent.trim() !== paymentDetails.phone) {
      phoneBtn.textContent = paymentDetails.phone;
      phoneBtn.dataset.clipboardText = paymentDetails.phone;
      phoneBtn.setAttribute(
        "aria-label",
        `Copy pay phone number: ${paymentDetails.phone}`,
      );
    }
  }

  if (paymentDetails.account_name) {
    const nameBtn = document.querySelector("[data-shop-pay-name]");
    if (nameBtn && nameBtn.textContent.trim() !== paymentDetails.account_name) {
      nameBtn.textContent = paymentDetails.account_name;
      nameBtn.dataset.clipboardText = paymentDetails.account_name;
      nameBtn.setAttribute(
        "aria-label",
        `Copy pay account name: ${paymentDetails.account_name}`,
      );
    }
  }

  if (paymentDetails.note) {
    const noteBtn = document.querySelector("[data-shop-pay-note]");
    if (noteBtn && noteBtn.textContent.trim() !== paymentDetails.note) {
      noteBtn.textContent = paymentDetails.note;
      noteBtn.dataset.clipboardText = paymentDetails.note;
      noteBtn.setAttribute(
        "aria-label",
        `Copy payment note: ${paymentDetails.note}`,
      );
    }
  }
}

/**
 * Initializes interactive category filtering on the shop page.
 */
export function initShopFilter() {
  const nav = document.querySelector("[data-shop-filter-nav]");
  if (!nav) return;

  const buttons = Array.from(nav.querySelectorAll("[data-filter]"));
  const sections = Array.from(document.querySelectorAll("[data-shop-category]"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.toggle("active", b === btn));

      sections.forEach((sec) => {
        if (filter === "all" || sec.dataset.shopCategory === filter) {
          sec.classList.remove("hidden");
        } else {
          sec.classList.add("hidden");
        }
      });
    });
  });
}

/**
 * Initializes shop client hydration and filtering on the shop page.
 */
export async function initShopHydration() {
  initShopFilter();

  const cards = Array.from(document.querySelectorAll("[data-shop-card]"));
  if (cards.length === 0) return;

  try {
    const res = await fetch("/api/shop");
    if (!res.ok) return;

    const data = await res.json();
    if (!data || !Array.isArray(data.plans)) return;

    // Hydrate each card
    data.plans.forEach((plan, index) => {
      let card = cards.find(
        (el) => Number.parseInt(el.dataset.planIndex, 10) === index,
      );
      if (!card) {
        card = cards.find(
          (el) =>
            el.dataset.planDuration === (plan.duration || plan.title) &&
            el.dataset.planTitle === plan.title,
        );
      }
      if (card) {
        hydratePlanCard(card, plan);
      }
    });

    // Hydrate payment info
    if (data.payment_details) {
      hydratePaymentDetails(data.payment_details);
    }

    // Refresh spoiler listeners
    initSpoiler();
  } catch (error) {
    // Graceful silent fallback to statically pre-rendered Hugo content
    console.debug("Shop hydration skipped (using static fallback):", error);
  }
}

