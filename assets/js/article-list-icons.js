export function initArticleListIcons() {
  document.querySelectorAll(".article-content ul").forEach((list) => {
    list.setAttribute("role", "list");

    list.querySelectorAll(":scope > li").forEach((item) => {
      if (item.querySelector(":scope > svg")) return;

      const icon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      icon.setAttribute("class", "article-list-icon");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("width", "24");
      icon.setAttribute("height", "24");
      icon.setAttribute("fill", "none");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.innerHTML =
        '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>';

      item.prepend(icon);
    });
  });
}
