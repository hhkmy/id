import ClipboardJS from "clipboard";
import { animate, remove } from "animejs";

document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher for Tailwind dark mode
  const darkBtn = document.getElementById("theme-toggle-dark");
  const lightBtn = document.getElementById("theme-toggle-light");
  const root = document.documentElement;
  const qrImg = document.getElementById("qr-image");
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
    setQrImageByTheme(theme);
    setGiscusTheme(theme);
  }

  function setQrImageByTheme(theme) {
    if (!qrImg) return;
    if (theme === "dark") {
      qrImg.src = qrImg.getAttribute("data-dark");
    } else {
      qrImg.src = qrImg.getAttribute("data-light");
    }
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

  giscusObserver.observe(document.body, { childList: true, subtree: true });

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

  const codeClipboard = new ClipboardJS(".code-copy-button", {
    text(trigger) {
      return (
        trigger.closest(".code-window")?.querySelector("code")?.textContent ||
        ""
      );
    },
  });

  codeClipboard.on("success", (event) => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = "Copied";
    button.classList.add("border-emerald-500", "text-emerald-300");
    event.clearSelection();

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("border-emerald-500", "text-emerald-300");
    }, 1600);
  });

  codeClipboard.on("error", (event) => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = "Failed";
    button.classList.add("border-red-500", "text-red-300");

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("border-red-500", "text-red-300");
    }, 1600);
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

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !motionQuery.matches;
  const revealSelectors = [
    ".home-hero",
    ".article-hero",
    ".home-hero-panel",
    ".article-meta",
    ".panel",
    ".article-card",
    ".focus-card",
    ".about-card",
    ".about-contact-card",
    ".about-timeline-item",
    ".about-skill-card",
    ".archive-year-card",
    ".archive-item",
    ".book-card",
    ".article-content",
    ".article-footer",
  ];

  const revealItems = document.querySelectorAll(revealSelectors.join(","));
  const showRevealItem = (item) => {
    remove(item);
    item.classList.add("is-visible");
    item.style.opacity = "1";
    item.style.transform = "none";
  };
  const hideRevealItem = (item) => {
    remove(item);
    item.classList.remove("is-visible");
    item.style.opacity = "0";
    item.style.transform = "translateY(18px)";
  };
  const isNearViewport = (item) => {
    const bounds = item.getBoundingClientRect();
    return bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0;
  };
  const isOutsideViewport = (item) => {
    const bounds = item.getBoundingClientRect();
    return bounds.bottom <= 0 || bounds.top >= window.innerHeight;
  };

  if (!canAnimate || !("IntersectionObserver" in window)) {
    revealItems.forEach(showRevealItem);
  } else {
    const revealItem = (item) => {
      if (item.classList.contains("is-visible")) return;

      remove(item);
      animate(item, {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 520,
        delay: (Number(item.dataset.revealIndex) % 4) * 60,
        ease: "outQuad",
        onComplete: () => showRevealItem(item),
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealItem(entry.target);
            return;
          }

          if (!document.hidden && isOutsideViewport(entry.target)) {
            hideRevealItem(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    revealItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.dataset.revealIndex = String(index);
      revealObserver.observe(item);
    });

    const finishVisibleRevealItems = () => {
      revealItems.forEach((item) => {
        if (isNearViewport(item)) showRevealItem(item);
      });
    };

    window.addEventListener("pageshow", finishVisibleRevealItems);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden)
        window.requestAnimationFrame(finishVisibleRevealItems);
    });
  }

  if (canAnimate) {
    const liftedSelectors = [
      ".article-card",
      ".focus-card",
      ".about-card",
      ".about-contact-card",
      ".about-timeline-item",
      ".about-skill-card",
      ".archive-year-card",
      ".book-card",
      ".article-adjacent-link",
    ];
    const subtleLiftSelectors = [
      ".archive-item",
      ".pagination-control:not(.pagination-control-disabled)",
      ".pagination-page",
      ".article-tag",
      ".book-download-link",
      ".link-button",
      ".quiet-button",
      ".code-copy-button",
    ];

    const animateLift = (element, y) => {
      remove(element);
      animate(element, {
        translateY: y,
        boxShadow:
          y < 0
            ? "0 14px 40px rgba(15, 23, 42, 0.10)"
            : "0 0 0 rgba(15, 23, 42, 0)",
        duration: 180,
        ease: "outQuad",
      });
    };

    document.querySelectorAll(liftedSelectors.join(",")).forEach((element) => {
      element.addEventListener("mouseenter", () => animateLift(element, -3));
      element.addEventListener("mouseleave", () => animateLift(element, 0));
      element.addEventListener("focusin", () => animateLift(element, -3));
      element.addEventListener("focusout", () => animateLift(element, 0));
    });

    document
      .querySelectorAll(subtleLiftSelectors.join(","))
      .forEach((element) => {
        element.addEventListener("mouseenter", () => animateLift(element, -2));
        element.addEventListener("mouseleave", () => animateLift(element, 0));
        element.addEventListener("focusin", () => animateLift(element, -2));
        element.addEventListener("focusout", () => animateLift(element, 0));
      });

    document
      .querySelectorAll(".focus-card, .about-contact-card")
      .forEach((card) => {
        const icon = card.querySelector(
          ".focus-card-icon, .about-contact-icon",
        );
        if (!icon) return;

        card.addEventListener("mouseenter", () => {
          remove(icon);
          animate(icon, {
            rotate: -2,
            scale: 1.05,
            duration: 220,
            ease: "outQuad",
          });
        });
        card.addEventListener("mouseleave", () => {
          remove(icon);
          animate(icon, {
            rotate: 0,
            scale: 1,
            duration: 220,
            ease: "outQuad",
          });
        });
      });

    document.querySelectorAll(".book-card").forEach((card) => {
      const cover = card.querySelector(".book-cover");
      if (!cover) return;

      card.addEventListener("mouseenter", () => {
        remove(cover);
        animate(cover, { scale: 1.015, duration: 220, ease: "outQuad" });
      });
      card.addEventListener("mouseleave", () => {
        remove(cover);
        animate(cover, { scale: 1, duration: 220, ease: "outQuad" });
      });
    });

    document.querySelectorAll(".article-featured-image").forEach((image) => {
      image.addEventListener("mouseenter", () => {
        remove(image);
        animate(image, { scale: 1.015, duration: 220, ease: "outQuad" });
      });
      image.addEventListener("mouseleave", () => {
        remove(image);
        animate(image, { scale: 1, duration: 220, ease: "outQuad" });
      });
    });

    document.querySelectorAll(".lite-youtube-trigger").forEach((trigger) => {
      const image = trigger.querySelector("img");
      if (!image) return;

      trigger.addEventListener("mouseenter", () => {
        remove(image);
        animate(image, { scale: 1.05, duration: 150, ease: "outQuad" });
      });
      trigger.addEventListener("mouseleave", () => {
        remove(image);
        animate(image, { scale: 1, duration: 150, ease: "outQuad" });
      });
    });

    const qrImage = document.getElementById("qr-image");
    const qrLink = qrImage?.closest("a");
    if (qrImage && qrLink) {
      qrLink.addEventListener("mouseenter", () => {
        remove(qrImage);
        animate(qrImage, { scale: 1.05, duration: 150, ease: "outQuad" });
      });
      qrLink.addEventListener("mouseleave", () => {
        remove(qrImage);
        animate(qrImage, { scale: 1, duration: 150, ease: "outQuad" });
      });
    }

    const notFoundIcon = document.querySelector(".not-found-icon");
    if (notFoundIcon) {
      animate(notFoundIcon, {
        translateY: [0, -14, 0],
        duration: 900,
        loop: true,
        ease: "inOutQuad",
      });
    }
  }

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
