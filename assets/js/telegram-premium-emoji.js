let lottieLoader = null;

function getLottie() {
  if (!lottieLoader) {
    lottieLoader = import("lottie-web/build/player/lottie_light").then(
      (m) => m.default || m,
    );
  }
  return lottieLoader;
}

const emojiPayloadCache = new Map();

function getEmojiPayload(source) {
  if (!emojiPayloadCache.has(source)) {
    emojiPayloadCache.set(
      source,
      (async () => {
        let response = await fetch(source);
        if (!response.ok) {
          const matchStatic = source.match(/\/icons\/premiumemojis\/(\d+)\.tgs\.base64/);
          if (matchStatic) {
            const apiRes = await fetch(`/api/emoji/${matchStatic[1]}`);
            if (apiRes.ok) {
              return (await apiRes.text()).trim();
            }
          }
          const matchApi = source.match(/\/api\/emoji\/(\d+)/);
          if (matchApi) {
            const staticRes = await fetch(`/icons/premiumemojis/${matchApi[1]}.tgs.base64`);
            if (staticRes.ok) {
              return (await staticRes.text()).trim();
            }
          }
          throw new Error(`Unable to load Telegram Premium emoji: ${source}`);
        }
        return (await response.text()).trim();
      })(),
    );
  }
  return emojiPayloadCache.get(source);
}

function getMountTarget(element) {
  if (element.tagName.toLowerCase() === "tg-emoji") {
    let wrap = element.querySelector(".tg-emoji-wrap");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "tg-emoji-wrap";
      element.appendChild(wrap);
    }
    wrap.replaceChildren();
    return wrap;
  }
  element.replaceChildren();
  return element;
}

async function renderEmoji(element, reduceMotion) {
  if (element.dataset.emojiState) return;

  const source =
    element.dataset.telegramEmoji ||
    (element.getAttribute("emoji-id")
      ? `/icons/premiumemojis/${element.getAttribute("emoji-id")}.tgs.base64`
      : null);
  if (!source) return;

  element.dataset.emojiState = "loading";

  try {
    const encoded = await getEmojiPayload(source);
    const target = getMountTarget(element);

    // 1. WebP format (Magic: RIFF....WEBP -> base64 starts with UklGR)
    if (encoded.startsWith("UklGR")) {
      const img = document.createElement("img");
      img.src = `data:image/webp;base64,${encoded}`;
      img.className = "shop-plan-emoji";
      img.alt = element.getAttribute("aria-label") || "emoji";
      img.width = 20;
      img.height = 20;
      target.appendChild(img);
      element.dataset.emojiState = "ready";
      return;
    }

    // 2. WebM video sticker (Magic 1A 45 DF A3 -> base64 starts with GkXf)
    if (encoded.startsWith("GkXf")) {
      const video = document.createElement("video");
      video.src = `data:video/webm;base64,${encoded}`;
      video.autoplay = !reduceMotion;
      video.loop = !reduceMotion;
      video.muted = true;
      video.playsInline = true;
      video.className = "shop-plan-emoji";
      video.width = 20;
      video.height = 20;
      target.appendChild(video);
      element.dataset.emojiState = "ready";
      return;
    }

    // 3. TGS vector animation (gzip Lottie JSON)
    if (!("DecompressionStream" in window)) {
      throw new Error("This browser cannot decode Telegram TGS animations");
    }

    const compressed = Uint8Array.from(atob(encoded), (character) =>
      character.codePointAt(0),
    );
    const decompressed = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));

    const animationData = await new Response(decompressed).json();
    const lottie = await getLottie();

    const animation = lottie.loadAnimation({
      animationData: structuredClone(animationData),
      autoplay: !reduceMotion,
      container: target,
      loop: !reduceMotion,
      renderer: "svg",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    if (reduceMotion) animation.goToAndStop(0, true);
    element.dataset.emojiState = "ready";
  } catch (_ignoredError) {
    // Expected exception: safely fallback to static emoji when Lottie fails to parse
    console.debug("Telegram premium emoji animation fallback:", _ignoredError);
    if (
      !element.querySelector(".shop-plan-emoji-fallback") &&
      !element.querySelector("i.emoji") &&
      !element.textContent.trim()
    ) {
      element.textContent = element.getAttribute("aria-label") || "⭐️";
    }
    element.dataset.emojiState = "fallback";
  }
}

export function initTelegramPremiumEmoji() {
  // Register <tg-emoji> web component if supported
  if (typeof customElements !== "undefined" && !customElements.get("tg-emoji")) {
    customElements.define(
      "tg-emoji",
      class extends HTMLElement {
        connectedCallback() {
          const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          renderEmoji(this, reduceMotion);
        }
      },
    );
  }

  const emojis = Array.from(
    document.querySelectorAll("[data-telegram-emoji], tg-emoji[emoji-id]"),
  );
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
