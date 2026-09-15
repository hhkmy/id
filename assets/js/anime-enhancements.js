import { animate, createTimeline, remove } from "animejs";
import { createDrawable, createMotionPath, morphTo } from "animejs/svg";

function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
}

function getActiveTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function setupQrSvgMotion(qrSvg) {
  if (!(qrSvg instanceof SVGSVGElement)) return null;

  const qrPath = qrSvg.querySelector("#qr-path");
  const drawPath = qrSvg.querySelector("#qr-draw-path");
  const morphTarget = qrSvg.querySelector("#qr-morph-target");
  const marker = qrSvg.querySelector("#qr-motion-dot");
  if (!qrPath || !drawPath || !morphTarget || !marker) return null;
  if (
    typeof qrPath.getTotalLength !== "function" ||
    typeof drawPath.getTotalLength !== "function" ||
    typeof morphTarget.getTotalLength !== "function"
  ) {
    return null;
  }

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
}

function createRevealTimeline(item) {
  return createTimeline({ autoplay: false }).add(item, {
    opacity: [0, 1],
    "--reveal-y": ["28px", "0px"],
    scale: [0.96, 1],
    rotate: [-1.4, 0],
    duration: 620,
    ease: "outQuad",
  });
}

function createRevealController(item) {
  item.classList.add("scroll-reveal");
  remove(item, null, "opacity");
  remove(item, null, "--reveal-y");
  remove(item, null, "scale");
  remove(item, null, "rotate");
  item.style.opacity = "0";
  item.style.setProperty("--reveal-y", "22px");

  let isRevealed = false;
  let timerId = null;
  let revealTimeline = null;

  const playReveal = (delay = 0) => {
    if (isRevealed) return;
    isRevealed = true;
    if (!revealTimeline) {
      revealTimeline = createRevealTimeline(item);
    }
    if (delay > 0) {
      timerId = window.setTimeout(() => {
        revealTimeline.restart();
        timerId = null;
      }, delay);
    } else {
      revealTimeline.restart();
    }
  };

  const resetReveal = () => {
    if (!isRevealed) return;
    isRevealed = false;
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    if (revealTimeline) {
      revealTimeline.reset();
    }
    item.style.opacity = "0";
    item.style.setProperty("--reveal-y", "22px");
  };

  return {
    target: item,
    isRevealed: () => isRevealed,
    playReveal,
    resetReveal,
  };
}

function sortNewlyVisible(items) {
  return items.sort((a, b) => {
    if (Math.abs(a.top - b.top) <= 24) {
      return a.left - b.left;
    }
    return a.top - b.top;
  });
}

function initRevealAnimations() {
  const revealSelectors = [
    ".panel",
    ".article-card",
    ".focus-card",
    ".about-card",
    ".about-contact-card",
    ".about-timeline-item",
    ".about-skill-card",
    ".archive-year-card",
    ".archive-item",
    ".article-meta",
    ".article-meta-card",
    ".article-adjacent-link",
    ".book-card",
    ".project-card",
    ".shop-card",
    ".shop-payment-method",
    ".shop-order-note",
    ".article-content",
    ".series-nav",
    ".article-footer",
    ".lighthouse-table-wrap",
  ];
  const nestedRevealSelectors = [
    ".article-card",
    ".focus-card",
    ".about-card",
    ".about-contact-card",
    ".about-timeline-item",
    ".about-skill-card",
    ".archive-year-card",
    ".archive-item",
    ".article-meta",
    ".article-meta-card",
    ".article-adjacent-link",
    ".book-card",
    ".project-card",
    ".shop-card",
    ".shop-payment-method",
    ".shop-order-note",
    ".article-content",
    ".series-nav",
    ".article-footer",
    ".lighthouse-table-wrap",
  ];

  const nestedRevealSelector = nestedRevealSelectors.join(",");
  const rawItems = Array.from(
    document.querySelectorAll(revealSelectors.join(",")),
  );

  const revealTargets = rawItems.filter(
    (item) =>
      !item.matches(".panel") || !item.querySelector(nestedRevealSelector),
  );

  const revealControllers = revealTargets.map(createRevealController);

  let revealSyncQueued = false;
  const syncRevealState = () => {
    revealSyncQueued = false;
    const windowH = window.innerHeight;
    const newlyVisible = [];

    for (const controller of revealControllers) {
      const rect = controller.target.getBoundingClientRect();
      const isCompletelyOut = rect.bottom < -40 || rect.top > windowH + 40;
      const isInView = rect.top < windowH * 0.94 && rect.bottom > 0;

      if (isCompletelyOut) {
        controller.resetReveal();
      } else if (isInView && !controller.isRevealed()) {
        newlyVisible.push({
          controller,
          top: rect.top,
          left: rect.left,
        });
      }
    }

    if (newlyVisible.length === 0) return;

    sortNewlyVisible(newlyVisible);

    newlyVisible.forEach(({ controller }, i) => {
      const delay = Math.min(i * 65, 390);
      controller.playReveal(delay);
    });
  };

  const queueRevealSync = () => {
    if (revealSyncQueued) return;
    revealSyncQueued = true;
    window.requestAnimationFrame(syncRevealState);
  };

  window.addEventListener("scroll", queueRevealSync, { passive: true });
  window.addEventListener("resize", queueRevealSync);
  window.addEventListener("pageshow", queueRevealSync);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) queueRevealSync();
  });
  queueRevealSync();
}

function initHoverAnimations() {
  const liftedSelectors = [
    ".article-card",
    ".focus-card",
    ".about-card",
    ".about-contact-card",
    ".about-timeline-item",
    ".about-skill-card",
    ".archive-year-card",
    ".book-card",
    ".project-card",
    ".shop-card",
    ".shop-payment-method",
    ".shop-order-note",
    ".article-adjacent-link",
  ];
  const subtleLiftSelectors = [
    ".archive-item",
    ".pagination-control:not(.pagination-control-disabled)",
    ".pagination-page",
    ".article-tag",
    ".book-download-link",
    ".project-telegram-link",
    ".project-case-study-link",
    ".link-button",
    ".quiet-button",
    ".shop-buy-button",
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
    .querySelectorAll(
      ".focus-card, .about-contact-card, .shop-card, .shop-order-note",
    )
    .forEach((card) => {
      const icon = card.querySelector(
        ".focus-card-icon, .about-contact-icon, .shop-card-icon",
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
        animate(icon, { rotate: 0, scale: 1, duration: 220, ease: "outQuad" });
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
}

function initQrAnimation() {
  const qrSvg = document.getElementById("qr-image");
  const qrImageTrigger = document.getElementById("qr-image-trigger");
  if (!(qrSvg instanceof SVGSVGElement) || !qrImageTrigger) return;

  qrSvg.dataset.theme = getActiveTheme();
  const playQrSvgMotion = setupQrSvgMotion(qrSvg);

  if (playQrSvgMotion) window.setTimeout(playQrSvgMotion, 350);
  qrImageTrigger.addEventListener("mouseenter", () => {
    playQrSvgMotion?.();
    remove(qrSvg);
    animate(qrSvg, { scale: 1.05, duration: 150, ease: "outQuad" });
  });
  qrImageTrigger.addEventListener("mouseleave", () => {
    remove(qrSvg);
    animate(qrSvg, { scale: 1, duration: 150, ease: "outQuad" });
  });
  qrImageTrigger.addEventListener("focus", () => {
    playQrSvgMotion?.();
  });
}

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  initRevealAnimations();
  initHoverAnimations();
  initQrAnimation();

  const notFoundIcon = document.querySelector(".not-found-icon");
  if (notFoundIcon) {
    animate(notFoundIcon, {
      translateY: [0, -14, 0],
      duration: 900,
      loop: true,
      ease: "inOutQuad",
    });
  }
});
