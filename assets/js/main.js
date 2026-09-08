import { initArticleListIcons } from "./article-list-icons.js";
import { initArticleViews } from "./article-views.js";
import { initCodeCopy } from "./code-copy.js";
import { initGithubUpdates } from "./github-updates.js";
import { initLiteYoutube } from "./lite-youtube.js";
import { initQrModal } from "./qr-modal.js";
import { initSearch } from "./search.js";
import { initSiteTooltips } from "./site-tooltips.js";
import { initSkillFilter } from "./skill-filter.js";
import { initTelegramPremiumEmoji } from "./telegram-premium-emoji.js";
import { initTheme } from "./theme.js";
import { initVisitorLocation } from "./visitor-location.js";

document.addEventListener("DOMContentLoaded", () => {
  const theme = initTheme();

  initQrModal();
  initLiteYoutube();
  initCodeCopy();
  initGithubUpdates();
  initArticleListIcons();
  initArticleViews();
  initSearch();
  initSiteTooltips();
  initSkillFilter();
  initTelegramPremiumEmoji();
  initVisitorLocation();
  theme.watchSystemTheme();
});
