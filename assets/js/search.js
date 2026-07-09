const loadStyle = (href) =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      resolve(existing);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.addEventListener("load", () => resolve(link), { once: true });
    link.addEventListener(
      "error",
      () => reject(new Error(`Failed to load ${href}`)),
      { once: true },
    );
    document.head.append(link);
  });

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve(existing);
        return;
      }
      existing.addEventListener("load", () => resolve(existing), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve(script);
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load ${src}`)),
      { once: true },
    );
    document.head.append(script);
  });

const openSearch = async () => {
  await Promise.all([
    loadStyle("/pagefind/pagefind-component-ui.css"),
    loadScript("/pagefind/pagefind-component-ui.js"),
  ]);

  let searchModal = document.querySelector("pagefind-modal");
  if (!searchModal) {
    searchModal = document.createElement("pagefind-modal");
    document.body.append(searchModal);
    await customElements.whenDefined("pagefind-modal");
  }

  if (typeof searchModal.open === "function") {
    searchModal.open();
    return;
  }

  searchModal.querySelector("dialog")?.showModal();
};

export function initSearch() {
  document
    .getElementById("site-search-trigger")
    ?.addEventListener("click", () => {
      openSearch().catch((error) => console.error(error));
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        !event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const searchModal = document.querySelector("pagefind-modal");
      if (searchModal?.isOpen || searchModal?.querySelector("dialog[open]")) {
        if (typeof searchModal.close === "function") {
          searchModal.close();
        }
        return;
      }

      openSearch().catch((error) => console.error(error));
    },
    true,
  );
}
