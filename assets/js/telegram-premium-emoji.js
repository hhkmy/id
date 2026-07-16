import lottie from "lottie-web/build/player/lottie_light";

const animationDataCache = new Map();

async function decodeTgs(response) {
  if (!("DecompressionStream" in window)) {
    throw new Error("This browser cannot decode Telegram TGS animations");
  }

  const encoded = (await response.text()).trim();
  const compressed = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0),
  );
  const decompressed = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));

  return new Response(decompressed).json();
}

function getAnimationData(source) {
  if (!animationDataCache.has(source)) {
    animationDataCache.set(
      source,
      fetch(source).then((response) => {
        if (!response.ok)
          throw new Error(`Unable to load Telegram Premium emoji: ${source}`);
        return decodeTgs(response);
      }),
    );
  }

  return animationDataCache.get(source);
}

async function renderEmoji(element, reduceMotion) {
  if (element.dataset.emojiState) return;

  const source = element.dataset.telegramEmoji;
  if (!source) return;

  element.dataset.emojiState = "loading";

  try {
    const animationData = await getAnimationData(source);
    const animation = lottie.loadAnimation({
      animationData: structuredClone(animationData),
      autoplay: !reduceMotion,
      container: element,
      loop: !reduceMotion,
      renderer: "svg",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    if (reduceMotion) animation.goToAndStop(0, true);
    element.dataset.emojiState = "ready";
  } catch {
    element.textContent = element.getAttribute("aria-label") || "";
    element.dataset.emojiState = "fallback";
  }
}

export function initTelegramPremiumEmoji() {
  const emojis = Array.from(document.querySelectorAll("[data-telegram-emoji]"));
  if (!emojis.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!("IntersectionObserver" in window)) {
    emojis.forEach((emoji) => renderEmoji(emoji, reduceMotion));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        renderEmoji(entry.target, reduceMotion);
      });
    },
    { rootMargin: "160px" },
  );

  emojis.forEach((emoji) => observer.observe(emoji));
}
