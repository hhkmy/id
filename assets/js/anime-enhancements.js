import { animate, onScroll, remove } from "animejs";
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

async function replaceQrImageWithSvg(qrImage) {
  if (!(qrImage instanceof HTMLImageElement)) return null;

  const response = await fetch(qrImage.currentSrc || qrImage.src);
  if (!response.ok) return null;

  const svgText = await response.text();
  const svgDocument = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = svgDocument.documentElement;
  if (svg.nodeName.toLowerCase() !== "svg") return null;

  const importedSvg = document.importNode(svg, true);
  importedSvg.id = qrImage.id;
  importedSvg.setAttribute("class", qrImage.getAttribute("class") || "");
  importedSvg.classList.remove("dark:invert");
  importedSvg.setAttribute("aria-hidden", "true");
  importedSvg.setAttribute("focusable", "false");
  importedSvg.dataset.theme = getActiveTheme();

  qrImage.replaceWith(importedSvg);
  return importedSvg;
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

function initRevealAnimations() {
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

  document.querySelectorAll(revealSelectors.join(",")).forEach((item, index) => {
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

  document.querySelectorAll(subtleLiftSelectors.join(",")).forEach((element) => {
    element.addEventListener("mouseenter", () => animateLift(element, -2));
    element.addEventListener("mouseleave", () => animateLift(element, 0));
    element.addEventListener("focusin", () => animateLift(element, -2));
    element.addEventListener("focusout", () => animateLift(element, 0));
  });

  document.querySelectorAll(".focus-card, .about-contact-card").forEach((card) => {
    const icon = card.querySelector(".focus-card-icon, .about-contact-icon");
    if (!icon) return;

    card.addEventListener("mouseenter", () => {
      remove(icon);
      animate(icon, { rotate: -2, scale: 1.05, duration: 220, ease: "outQuad" });
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

async function initQrAnimation() {
  const qrImage = document.getElementById("qr-image");
  const qrImageTrigger = document.getElementById("qr-image-trigger");
  if (!qrImage || !qrImageTrigger) return;

  const qrSvg =
    qrImage instanceof SVGSVGElement ? qrImage : await replaceQrImageWithSvg(qrImage);
  const playQrSvgMotion = setupQrSvgMotion(qrSvg);

  if (playQrSvgMotion) window.setTimeout(playQrSvgMotion, 350);
  qrImageTrigger.addEventListener("mouseenter", () => {
    playQrSvgMotion?.();
    remove(qrSvg || qrImage);
    animate(qrSvg || qrImage, { scale: 1.05, duration: 150, ease: "outQuad" });
  });
  qrImageTrigger.addEventListener("mouseleave", () => {
    remove(qrSvg || qrImage);
    animate(qrSvg || qrImage, { scale: 1, duration: 150, ease: "outQuad" });
  });
  qrImageTrigger.addEventListener("focus", () => {
    playQrSvgMotion?.();
  });
}

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  initRevealAnimations();
  initHoverAnimations();
  initQrAnimation().catch(() => {});

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
