export function initLiteYoutube() {
  document.querySelectorAll(".lite-youtube").forEach((embed) => {
    const trigger = embed.querySelector(".lite-youtube-trigger");
    if (!trigger) return;

    trigger.addEventListener(
      "click",
      () => {
        const src = getYoutubeEmbedUrl(embed.getAttribute("data-youtube-src"));
        if (!src) return;

        const iframe = document.createElement("iframe");
        iframe.src = src;
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
}

function getYoutubeEmbedUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.href);
    const isYoutubeEmbed =
      url.protocol === "https:" &&
      url.hostname === "www.youtube-nocookie.com" &&
      url.pathname.startsWith("/embed/");

    return isYoutubeEmbed ? url.href : null;
  } catch {
    return null;
  }
}
