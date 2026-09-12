export const initScrollToTop = () => {
  const btn = document.getElementById("scroll-to-top");
  if (!btn) {
    return;
  }

  const threshold = 300;
  let ticking = false;

  const updateVisibility = () => {
    const isPastThreshold = window.scrollY > threshold;
    if (isPastThreshold) {
      if (!btn.classList.contains("is-visible")) {
        btn.classList.add("is-visible");
        btn.setAttribute("tabindex", "0");
        btn.removeAttribute("aria-hidden");
      }
    } else {
      if (btn.classList.contains("is-visible")) {
        btn.classList.remove("is-visible");
        btn.setAttribute("tabindex", "-1");
        btn.setAttribute("aria-hidden", "true");
      }
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateVisibility();
};
