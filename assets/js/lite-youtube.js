export function initLiteYoutube() {
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
}
