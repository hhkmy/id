const INTERACTIVE_LABEL_SELECTOR =
  'a[aria-label]:not([aria-label=""]), button[aria-label]:not([aria-label=""]), [role="button"][aria-label]:not([aria-label=""])';
const LABEL_SELECTOR = '[aria-label]:not([aria-label=""])';
const ICON_SELECTOR = ".hi-svg-inline";

const getTooltipTarget = (node) => {
  if (!(node instanceof Element)) return null;

  return (
    node.closest(INTERACTIVE_LABEL_SELECTOR) ||
    node.closest(ICON_SELECTOR) ||
    node.closest(LABEL_SELECTOR)
  );
};

const getTooltipLabel = (target) => {
  const ariaLabel = target.getAttribute("aria-label")?.trim();
  if (ariaLabel) return ariaLabel;

  return target.dataset.tooltipLabel || "";
};

const prepareIconLabels = () => {
  document.querySelectorAll(ICON_SELECTOR).forEach((icon) => {
    const title = icon.querySelector("title");
    const label = title?.textContent?.trim();
    if (label) icon.dataset.tooltipLabel = label;
    title?.remove();
  });
};

const positionTooltip = (tooltip, target) => {
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportPadding = 8;
  const gap = 8;
  const targetCenter = targetRect.left + targetRect.width / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - viewportPadding;
  const left = Math.min(
    Math.max(targetCenter - tooltipRect.width / 2, viewportPadding),
    Math.max(maxLeft, viewportPadding),
  );
  const opensAbove =
    targetRect.top >= tooltipRect.height + gap + viewportPadding;
  const top = opensAbove
    ? targetRect.top - tooltipRect.height - gap
    : targetRect.bottom + gap;
  const arrowLeft = Math.min(
    Math.max(targetCenter - left, 8),
    tooltipRect.width - 8,
  );

  tooltip.dataset.placement = opensAbove ? "top" : "bottom";
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.setProperty("--tooltip-arrow-left", `${arrowLeft}px`);
};

export function initSiteTooltips() {
  const tooltip = document.createElement("div");
  const arrow = document.createElement("span");
  let activeTarget = null;

  prepareIconLabels();

  tooltip.className = "site-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  arrow.className = "site-tooltip-arrow";
  arrow.setAttribute("aria-hidden", "true");
  tooltip.append(arrow);
  document.body.append(tooltip);

  const hideTooltip = () => {
    activeTarget = null;
    tooltip.hidden = true;
  };

  const showTooltip = (target) => {
    const label = getTooltipLabel(target);
    if (!label) {
      hideTooltip();
      return;
    }

    activeTarget = target;
    tooltip.replaceChildren(document.createTextNode(label), arrow);
    tooltip.hidden = false;
    positionTooltip(tooltip, target);
  };

  document.addEventListener("pointerover", (event) => {
    const target = getTooltipTarget(event.target);
    if (target && target !== activeTarget) showTooltip(target);
  });

  document.addEventListener("pointerout", (event) => {
    if (!activeTarget) return;
    if (
      event.relatedTarget instanceof Node &&
      activeTarget.contains(event.relatedTarget)
    )
      return;
    hideTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const target = getTooltipTarget(event.target);
    if (target) showTooltip(target);
  });

  document.addEventListener("focusout", (event) => {
    if (!activeTarget) return;
    if (
      event.relatedTarget instanceof Node &&
      activeTarget.contains(event.relatedTarget)
    )
      return;
    hideTooltip();
  });

  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip, { passive: true });
}
