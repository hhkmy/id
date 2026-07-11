export function initLiteYoutube() {
  document.querySelectorAll(".lite-youtube").forEach((embed) => {
    const trigger = embed.querySelector(".lite-youtube-trigger");
    if (!trigger) return;

    trigger.addEventListener(
      "click",
      () => {
        const src = getYoutubeEmbedUrl(embed.dataset.youtubeId);
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
  if (!value || !/^[\w-]{11}$/.test(value)) return null;

  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${value}?${params}`;
}
