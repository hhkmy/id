import ClipboardJS from "clipboard";
import { animate, onScroll, remove } from "animejs";
import { morphTo, createMotionPath, createDrawable } from "animejs/svg";

document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher for Tailwind dark mode
  const darkBtn = document.getElementById("theme-toggle-dark");
  const lightBtn = document.getElementById("theme-toggle-light");
  const root = document.documentElement;
  const qrImg = document.getElementById("qr-image");
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
    setQrImageByTheme(theme);
    setGiscusTheme(theme);
  }

  function setQrImageByTheme(theme) {
    syncQrObjectThemes(theme);
  }

  function getQrObjectSvg(qrObject) {
    if (!(qrObject instanceof HTMLObjectElement)) return null;

    return qrObject.contentDocument?.documentElement || null;
  }

  function syncQrObjectTheme(qrObject, theme) {
    if (qrObject instanceof SVGSVGElement) {
      qrObject.dataset.theme = theme;
      return;
    }

    if (!(qrObject instanceof HTMLObjectElement)) return;

    const svg = getQrObjectSvg(qrObject);
    if (svg) {
      svg.dataset.theme = theme;
      return;
    }

    qrObject.dataset.pendingTheme = theme;
    if (qrObject.dataset.themeLoadBound === "true") return;

    qrObject.dataset.themeLoadBound = "true";
    qrObject.addEventListener("load", () => {
      const loadedSvg = getQrObjectSvg(qrObject);
      if (loadedSvg) {
        loadedSvg.dataset.theme = qrObject.dataset.pendingTheme || theme;
      }
    });
  }

  function syncQrObjectThemes(theme) {
    document
      .querySelectorAll(".qr-svg-object")
      .forEach((qrObject) => syncQrObjectTheme(qrObject, theme));
  }

  async function replaceQrObjectWithSvg(qrObject) {
    if (!(qrObject instanceof HTMLObjectElement)) return null;

    const svgUrl = qrObject.getAttribute("data");
    if (!svgUrl) return null;

    const response = await fetch(svgUrl);
    if (!response.ok) return null;

    const svgText = await response.text();
    const svgDocument = new DOMParser().parseFromString(
      svgText,
      "image/svg+xml",
    );
    const svg = svgDocument.documentElement;
    if (svg.nodeName.toLowerCase() !== "svg") return null;

    const importedSvg = document.importNode(svg, true);
    importedSvg.id = qrObject.id;
    importedSvg.setAttribute(
      "class",
      qrObject.getAttribute("class") || "qr-svg-object",
    );
    importedSvg.setAttribute("aria-label", "HHK QR code");
    importedSvg.setAttribute("focusable", "false");
    importedSvg.dataset.theme = getActiveTheme();

    qrObject.replaceWith(importedSvg);
    return importedSvg;
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

  if (canAnimate) {
    const revealItems = document.querySelectorAll(revealSelectors.join(","));
    revealItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.dataset.revealIndex = String(index);

      animate(item, {
        opacity: [0, 1],
        "--reveal-y": ["18px", "0px"],
        duration: 520,
        delay: (index % 4) * 60,
        ease: "outQuad",
        persist: true,
        autoplay: onScroll({
          target: item,
          sync: "restart none none none",
          enter: "92% start",
          leave: "start end",
          repeat: true,
        }),
      });
    });

    const setupQrSvgMotion = (qrSvg) => {
      if (!qrSvg) return null;

      const qrPath = qrSvg.querySelector("#qr-path");
      const drawPath = qrSvg.querySelector("#qr-draw-path");
      const morphTarget = qrSvg.querySelector("#qr-morph-target");
      const marker = qrSvg.querySelector("#qr-motion-dot");
      if (!qrPath || !drawPath || !morphTarget || !marker) return null;
      if (
        typeof qrPath.getTotalLength !== "function" ||
        typeof drawPath.getTotalLength !== "function" ||
        typeof morphTarget.getTotalLength !== "function"
      )
        return null;

      const qrPathData = qrPath.getAttribute("d");
      if (!qrPathData) return null;

      const helperIdPrefix = qrSvg.id || "qr-image";
      qrPath.id = `${helperIdPrefix}-path`;
      drawPath.id = `${helperIdPrefix}-draw-path`;
      morphTarget.id = `${helperIdPrefix}-morph-target`;
      marker.id = `${helperIdPrefix}-motion-dot`;

      const qrPathSelector = `#${CSS.escape(qrPath.id)}`;
      const drawPathSelector = `#${CSS.escape(drawPath.id)}`;
      const morphTargetSelector = `#${CSS.escape(morphTarget.id)}`;
      const drawable = createDrawable(drawPathSelector, 0, 0)[0];
      const motionPath = createMotionPath(qrPathSelector, 0.12);
      if (!drawable || !motionPath) return null;

      return () => {
        remove([drawPath, marker]);
        drawPath.setAttribute("d", qrPathData);
        drawPath.style.opacity = "0";

        animate(drawable, {
          draw: ["0 0", "0 1"],
          duration: 700,
          ease: "inOutQuad",
        });

        animate(drawPath, {
          d: morphTo(morphTargetSelector, 0.015),
          opacity: [0.72, 0],
          duration: 520,
          ease: "inOutQuad",
          onComplete: () => {
            drawPath.setAttribute("d", qrPathData);
            drawPath.style.opacity = "0";
          },
        });

        animate(marker, {
          ...motionPath,
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
          duration: 900,
          ease: "inOutQuad",
        });
      };
    };

    let playQrSvgMotion = null;
    let qrSvgMotionInitialized = false;
    const initQrSvgMotion = () => {
      if (qrSvgMotionInitialized) return;

      const qrSvg = document.getElementById("qr-image");
      if (!(qrSvg instanceof SVGSVGElement)) return;

      playQrSvgMotion = setupQrSvgMotion(qrSvg);
      if (playQrSvgMotion) {
        qrSvgMotionInitialized = true;
        window.setTimeout(playQrSvgMotion, 350);
      }
    };

    if (qrImg instanceof HTMLObjectElement) {
      replaceQrObjectWithSvg(qrImg)
        .then(() => initQrSvgMotion())
        .catch(() => {});
    } else {
      initQrSvgMotion();
    }

    if (qrImg instanceof HTMLObjectElement) {
      qrImg.addEventListener("load", () => {
        syncQrObjectTheme(qrImg, getActiveTheme());
      });
    }

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
      remove(element, null, "--lift-y");
      remove(element, null, "boxShadow");
      animate(element, {
        "--lift-y": `${y}px`,
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
    const qrImageTrigger = document.getElementById("qr-image-trigger");
    if (qrImage && qrImageTrigger) {
      qrImageTrigger.addEventListener("mouseenter", () => {
        playQrSvgMotion?.();
        remove(qrImage);
        animate(qrImage, { scale: 1.05, duration: 150, ease: "outQuad" });
      });
      qrImageTrigger.addEventListener("mouseleave", () => {
        remove(qrImage);
        animate(qrImage, { scale: 1, duration: 150, ease: "outQuad" });
      });
      qrImageTrigger.addEventListener("focus", () => {
        playQrSvgMotion?.();
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
