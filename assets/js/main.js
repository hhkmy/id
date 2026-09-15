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

document.addEventListener("DOMContentLoaded", () => {
  const theme = initTheme();

  initQrModal();
  initLiteYoutube();
  initMermaid();
  initCodeCopy();
  initGithubUpdates();
  initArticleViews();
  initSearch();
  initScrollToTop();
  initSiteTooltips();
  initSkillFilter();
  initSpoiler();
  initSpeedlifyScore();
  initTelegramPremiumEmoji();
  initVisitorLocation();
  initShopHydration();
  theme.watchSystemTheme();
});
