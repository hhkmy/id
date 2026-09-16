import { initArticleViews } from "./article-views.js";
import { initCodeCopy } from "./code-copy.js";
import { initGithubUpdates } from "./github-updates.js";
import { initLiteYoutube } from "./lite-youtube.js";
import { initMermaid } from "./mermaid.js";
import { initQrModal } from "./qr-modal.js";
import { initSearch } from "./search.js";
import { initScrollToTop } from "./scroll-to-top.js";
import { initShopHydration } from "./shop.js";
import { initSiteTooltips } from "./site-tooltips.js";
import { initSkillFilter } from "./skill-filter.js";
import { initSpeedlifyScore } from "./speedlify2-score.js";
import { initSpoiler } from "./spoiler.js";
import { initTelegramPremiumEmoji } from "./telegram-premium-emoji.js";
import { initTheme } from "./theme.js";
import { initVisitorLocation } from "./visitor-location.js";

function runWhenIdle(callback, timeout = 2000) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 50);
  }
}

function runIdleTasks(tasks) {
  const queue = [...tasks];
  function step() {
    if (queue.length > 0) {
      const task = queue.shift();
      try {
        task();
      } catch (_) {
        // Safely ignore non-critical task errors during background hydration
      }
    }
    if (queue.length > 0) {
      runWhenIdle(step, 1000);
    }
  }
  runWhenIdle(step, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
  const theme = initTheme();

  initQrModal();
  initSearch();
  initSkillFilter();
  initSpoiler();
  theme.watchSystemTheme();

  runIdleTasks([
    initLiteYoutube,
    initMermaid,
    initCodeCopy,
    initGithubUpdates,
    initArticleViews,
    initScrollToTop,
    initSiteTooltips,
    initSpeedlifyScore,
    initTelegramPremiumEmoji,
    initVisitorLocation,
    initShopHydration,
  ]);
});
