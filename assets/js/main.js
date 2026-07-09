document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher for Tailwind dark mode
  const darkBtn = document.getElementById("theme-toggle-dark");
  const lightBtn = document.getElementById("theme-toggle-light");
  const root = document.documentElement;
  const qrTrigger = document.getElementById("qr-image-trigger");
  const qrModal = document.getElementById("qr-modal");
  let qrModalPreviousFocus = null;
  const getStoredTheme = () => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  };
  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  };

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    root.toggleAttribute("data-pf-theme", isDark);
    if (isDark) {
      root.setAttribute("data-pf-theme", "dark");
    }
    if (darkBtn) darkBtn.style.display = isDark ? "none" : "";
    if (lightBtn) lightBtn.style.display = isDark ? "" : "none";
    setGiscusTheme(theme);
  }

  function getActiveTheme() {
    return root.classList.contains("dark") ? "dark" : "light";
  }

  function setGiscusTheme(theme) {
    const giscusTheme = theme === "dark" ? "dark" : "light";
    const giscusScript = document.querySelector(
      'script[src="https://giscus.app/client.js"]',
    );
    if (giscusScript) {
      giscusScript.setAttribute("data-theme", giscusTheme);
    }

    const giscusFrame = document.querySelector(
      'iframe.giscus-frame[src^="https://giscus.app"]',
    );
    if (!giscusFrame?.contentWindow) return;

    if (giscusFrame.dataset.loaded !== "true") {
      giscusFrame.addEventListener(
        "load",
        () => {
          giscusFrame.dataset.loaded = "true";
          setGiscusTheme(getActiveTheme());
        },
        { once: true },
      );
      return;
    }

    try {
      giscusFrame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: giscusTheme,
            },
          },
        },
        "https://giscus.app",
      );
    } catch {
      giscusFrame.addEventListener(
        "load",
        () => setGiscusTheme(getActiveTheme()),
        { once: true },
      );
    }
  }

  const giscusObserver = new MutationObserver(() => {
    if (
      !document.querySelector('iframe.giscus-frame[src^="https://giscus.app"]')
    )
      return;

    setGiscusTheme(getActiveTheme());
    giscusObserver.disconnect();
  });

  if (document.body) {
    giscusObserver.observe(document.body, { childList: true, subtree: true });
  }

  // User-requested theme logic
  const storedTheme = getStoredTheme();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme;
  if (storedTheme === "dark" || (!storedTheme && systemDark)) {
    setStoredTheme("dark");
    theme = "dark";
  } else {
    setStoredTheme("light");
    theme = "light";
  }
  applyTheme(theme);

  if (darkBtn && lightBtn) {
    darkBtn.addEventListener("click", () => {
      setStoredTheme("dark");
      applyTheme("dark");
    });
    lightBtn.addEventListener("click", () => {
      setStoredTheme("light");
      applyTheme("light");
    });
  }

  function openQrModal() {
    if (!qrModal) return;

    const modalImage = document.getElementById("qr-modal-image");
    if (modalImage instanceof HTMLImageElement && !modalImage.src) {
      modalImage.src = modalImage.dataset.src || "";
    }
    qrModalPreviousFocus = document.activeElement;
    qrModal.classList.remove("hidden");
    qrModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    qrModal.focus({ preventScroll: true });
  }

  function closeQrModal() {
    if (!qrModal) return;

    qrModal.classList.add("hidden");
    qrModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (qrModalPreviousFocus instanceof HTMLElement) {
      qrModalPreviousFocus.focus({ preventScroll: true });
    }
    qrModalPreviousFocus = null;
  }

  qrTrigger?.addEventListener("click", (event) => {
    event.preventDefault();
    openQrModal();
  });

  qrModal?.addEventListener("click", (event) => {
    if (event.target === qrModal) {
      closeQrModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !qrModal?.classList.contains("hidden")) {
      closeQrModal();
    }
  });

  document.querySelectorAll(".lite-youtube").forEach((embed) => {
    const trigger = embed.querySelector(".lite-youtube-trigger");
    if (!trigger) return;

    trigger.addEventListener(
      "click",
      () => {
        const iframe = document.createElement("iframe");
        iframe.src = embed.getAttribute("data-youtube-src");
        iframe.title =
          embed.getAttribute("data-youtube-title") || "YouTube video";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
        iframe.allowFullscreen = true;
        embed.replaceChildren(iframe);
      },
      { once: true },
    );
  });

  document.querySelectorAll(".code-copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const originalText = button.textContent;
      const code =
        button.closest(".code-window")?.querySelector("code")?.textContent ||
        "";

      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        button.classList.add("border-emerald-500", "text-emerald-300");
      } catch {
        button.textContent = "Failed";
        button.classList.add("border-red-500", "text-red-300");
      }

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove(
          "border-emerald-500",
          "text-emerald-300",
          "border-red-500",
          "text-red-300",
        );
      }, 1600);
    });
  });

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

  // Listen for system theme changes and update Tailwind dark class
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const systemTheme = e.matches ? "dark" : "light";
      const storedTheme = getStoredTheme();
      if (!storedTheme) {
        applyTheme(systemTheme);
      } else {
        applyTheme(storedTheme);
      }
    });
});
