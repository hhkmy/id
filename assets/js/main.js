import { initArticleListIcons } from "./article-list-icons.js";
import { initArticleViews } from "./article-views.js";
import { initCodeCopy } from "./code-copy.js";
import { initLiteYoutube } from "./lite-youtube.js";
import { initQrModal } from "./qr-modal.js";
import { initSearch } from "./search.js";
import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  const theme = initTheme();

  initQrModal();
  initLiteYoutube();
  initCodeCopy();
  initArticleListIcons();
  initArticleViews();
  initSearch();
  theme.watchSystemTheme();
});
