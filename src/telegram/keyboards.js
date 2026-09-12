/**
 * Telegram inline keyboard builders for shop administration.
 */

export const WEBSITE_EMOJI_ID = "6134272527817515691";

/**
 * Builds the main admin navigation keyboard.
 * Rule: Never include regular unicode emojis in text when an icon_custom_emoji_id is set.
 *
 * @param {string} [appUrl]
 * @returns {object} InlineKeyboardMarkup
 */
export function getMainMenuKeyboard(appUrl) {
  const inline_keyboard = [];

  if (appUrl) {
    inline_keyboard.push([
      {
        text: "Open Mini App Dashboard",
        web_app: { url: appUrl },
        icon_custom_emoji_id: "6158861769637891517", // Telegram Star
      },
    ]);
  }

  inline_keyboard.push(
    [
      {
        text: "Service Plans",
        callback_data: "cmd_plans",
        icon_custom_emoji_id: "6190715746775993073",
      },
      {
        text: "Telegram Stars",
        callback_data: "cmd_stars",
        icon_custom_emoji_id: "6325838686378269641",
      },
    ],
    [
      {
        text: "Payment Details",
        callback_data: "cmd_payment",
        icon_custom_emoji_id: "6206487605421280759",
      },
      {
        text: "Website Shop",
        url: "https://hhk.my.id/shop/",
        icon_custom_emoji_id: WEBSITE_EMOJI_ID,
      },
    ],
    [
      {
        text: "Commands & Help",
        callback_data: "cmd_help",
      },
    ],
  );

  return { inline_keyboard };
}

/**
 * Dedicated Mini App launcher keyboard.
 * @param {string} [appUrl]
 * @returns {object} InlineKeyboardMarkup
 */
export function getAppLaunchKeyboard(appUrl) {
  const inline_keyboard = [];

  if (appUrl) {
    inline_keyboard.push(
      [
        {
          text: "Launch Mini App",
          web_app: { url: appUrl },
          icon_custom_emoji_id: "6158861769637891517",
        },
      ],
      [
        {
          text: "Web Dashboard",
          url: appUrl,
          icon_custom_emoji_id: WEBSITE_EMOJI_ID,
        },
        {
          text: "Main Menu",
          callback_data: "cmd_main",
        },
      ],
    );
  } else {
    inline_keyboard.push([
      {
        text: "Main Menu",
        callback_data: "cmd_main",
      },
    ]);
  }

  return { inline_keyboard };
}

/**
 * Dedicated Help navigation keyboard.
 * @returns {object} InlineKeyboardMarkup
 */
export function getHelpKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "Service Plans",
          callback_data: "cmd_plans",
          icon_custom_emoji_id: "6190715746775993073",
        },
        {
          text: "Telegram Stars",
          callback_data: "cmd_stars",
          icon_custom_emoji_id: "6325838686378269641",
        },
      ],
      [
        {
          text: "Open Mini App",
          callback_data: "cmd_app",
        },
        {
          text: "Main Menu",
          callback_data: "cmd_main",
        },
      ],
    ],
  };
}

/**
 * Builds category selection keyboard with item counts and custom emojis.
 * @param {Array<any>} plans
 * @returns {object} InlineKeyboardMarkup
 */
export function getCategoriesKeyboard(plans) {
  let premiumCount = 0;
  let starsCount = 0;
  let gramCount = 0;
  let otherCount = 0;

  for (const p of plans) {
    const cat = (p.category || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    if (cat.includes("premium") || title.includes("premium")) {
      premiumCount++;
    } else if (cat.includes("star") || title.includes("star")) {
      starsCount++;
    } else if (cat.includes("gram") || title.includes("gram")) {
      gramCount++;
    } else {
      otherCount++;
    }
  }

  return {
    inline_keyboard: [
      [
        {
          text: `Telegram Premium (${premiumCount})`,
          callback_data: "cat:premium",
          icon_custom_emoji_id: "6192798024230505469",
        },
        {
          text: `Telegram Stars (${starsCount})`,
          callback_data: "cat:stars",
          icon_custom_emoji_id: "6325838686378269641",
        },
      ],
      [
        {
          text: `Gram (${gramCount})`,
          callback_data: "cat:gram",
          icon_custom_emoji_id: "6169992765795999529",
        },
        {
          text: `Other Services (${otherCount})`,
          callback_data: "cat:other",
          icon_custom_emoji_id: "6294148308839442271",
        },
      ],
      [
        {
          text: `All Plans (${plans.length})`,
          callback_data: "cat:all",
        },
        {
          text: "Back to Menu",
          callback_data: "cmd_main",
        },
      ],
    ],
  };
}

/**
 * Builds clean, short product buttons (no prices in button text to prevent truncation).
 * @param {Array<any>} plans
 * @param {string} [categoryKey="all"]
 * @returns {object} InlineKeyboardMarkup
 */
export function getPlansListKeyboard(plans, categoryKey = "all") {
  const filtered = [];

  plans.forEach((plan, realIndex) => {
    const cat = (plan.category || "").toLowerCase();
    const title = (plan.title || "").toLowerCase();
    let matches = false;

    if (categoryKey === "premium") {
      matches = cat.includes("premium") || title.includes("premium");
    } else if (categoryKey === "stars") {
      matches = cat.includes("star") || title.includes("star");
    } else if (categoryKey === "gram") {
      matches = cat.includes("gram") || title.includes("gram");
    } else if (categoryKey === "other") {
      matches =
        !cat.includes("premium") &&
        !cat.includes("star") &&
        !cat.includes("gram") &&
        !title.includes("premium") &&
        !title.includes("star") &&
        !title.includes("gram");
    } else {
      matches = true;
    }

    if (matches) {
      filtered.push({ plan, realIndex });
    }
  });

  const inline_keyboard = [];

  // 2-column grid with concise text
  for (let i = 0; i < filtered.length; i += 2) {
    const chunk = filtered.slice(i, i + 2);
    const row = chunk.map(({ plan, realIndex }) => {
      const popular = plan.highlight ? " ⭐️" : "";
      // Keep label concise: only duration or title
      const label = (plan.duration || plan.title) + popular;
      const button = {
        text: label,
        callback_data: `plan:${realIndex}:${categoryKey}`,
      };
      if (plan.premium_emoji_id) {
        button.icon_custom_emoji_id = String(plan.premium_emoji_id);
      }
      return button;
    });
    inline_keyboard.push(row);
  }

  inline_keyboard.push([
    {
      text: "Categories",
      callback_data: "cmd_plans",
    },
    {
      text: "Main Menu",
      callback_data: "cmd_main",
    },
  ]);

  return { inline_keyboard };
}

/**
 * Builds simple payment details navigation keyboard.
 * @returns {object} InlineKeyboardMarkup
 */
export function getPaymentMethodsKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "Main Menu",
          callback_data: "cmd_main",
        },
      ],
    ],
  };
}

/**
 * Builds management actions for a specific plan.
 * @param {number} planIndex
 * @param {any} plan
 * @param {string} [categoryKey="all"]
 * @returns {object} InlineKeyboardMarkup
 */
export function getPlanDetailsKeyboard(planIndex, plan, categoryKey = "all") {
  const highlightLabel = plan.highlight ? "Popular: ON" : "Popular: OFF";

  const emojiButton = {
    text: "Change Custom Emoji",
    callback_data: `emoji:${planIndex}:${categoryKey}`,
  };

  if (plan.premium_emoji_id) {
    emojiButton.icon_custom_emoji_id = String(plan.premium_emoji_id);
  }

  const highlightButton = {
    text: highlightLabel,
    callback_data: `highlight:${planIndex}:${categoryKey}`,
    icon_custom_emoji_id: "6158861769637891517", // Star
  };

  return {
    inline_keyboard: [
      [
        {
          text: "Change Price",
          callback_data: `price:${planIndex}:${categoryKey}`,
        },
        highlightButton,
      ],
      [emojiButton],
      [
        {
          text: "Back to Plans",
          callback_data: `cat:${categoryKey}`,
        },
        {
          text: "Main Menu",
          callback_data: "cmd_main",
        },
      ],
    ],
  };
}
