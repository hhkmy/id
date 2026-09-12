/**
 * Interactive Spoiler Controller
 * Supports hover-to-reveal via CSS and click/keyboard-to-toggle permanent reveal.
 */

export function initSpoiler() {
  const spoilers = document.querySelectorAll(".spoiler");
  if (!spoilers.length) return;

  spoilers.forEach((spoiler) => {
    // Ensure inner wrapper for crisp sparkles + blurred text separation
    if (!spoiler.querySelector(".spoiler-inner")) {
      const inner = document.createElement("span");
      inner.className = "spoiler-inner";
      while (spoiler.firstChild) {
        inner.appendChild(spoiler.firstChild);
      }
      spoiler.appendChild(inner);
    }

    // Avoid double-binding
    if (spoiler.dataset.spoilerInit) return;
    spoiler.dataset.spoilerInit = "true";

    if (spoiler.tagName !== "BUTTON") {
      if (!spoiler.hasAttribute("tabindex")) {
        spoiler.setAttribute("tabindex", "0");
      }
      if (!spoiler.hasAttribute("role")) {
        spoiler.setAttribute("role", "button");
      }
    }
    if (!spoiler.hasAttribute("aria-expanded")) {
      spoiler.setAttribute("aria-expanded", "false");
    }

    const toggle = () => {
      const isRevealed = spoiler.classList.toggle("is-revealed");
      spoiler.setAttribute("aria-expanded", isRevealed ? "true" : "false");
    };

    spoiler.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    spoiler.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }
    });
  });
}
