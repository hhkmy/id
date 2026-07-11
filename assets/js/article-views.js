const VIEW_ENDPOINT = "/api/views";

const isStaticHugoServer = () => {
  const { hostname, port } = window.location;
  return (
    port === "1313" && (hostname === "localhost" || hostname === "127.0.0.1")
  );
};

const formatViews = (views) => {
  const count = Number.isFinite(views) ? views : 0;
  return new Intl.NumberFormat(
    document.documentElement.lang || undefined,
  ).format(count);
};

const setCounterValue = (counter, views) => {
  const countElement = counter.querySelector(".count");
  if (!countElement) {
    return;
  }

  countElement.textContent = formatViews(views);
  counter.dataset.loaded = "true";
};

const loadAllViewCounters = async (counters) => {
  if (!counters.length) {
    return;
  }

  const response = await fetch(`${VIEW_ENDPOINT}?path=ALL_VIEWS`);
  if (!response.ok) {
    throw new Error(`Failed to load article views: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    return;
  }

  counters.forEach((counter) => {
    const path = normalizeCounterPath(counter.dataset.path || "");
    setCounterValue(counter, data.views[path] || 0);
  });
};

const normalizeCounterPath = (path) => path.replace(/\/+$/, "") || "/";

const incrementCurrentArticle = async (counter) => {
  const path = counter.dataset.path;
  if (!path) {
    return;
  }

  const response = await fetch(VIEW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update article views: ${response.status}`);
  }

  const data = await response.json();
  if (data.success) {
    setCounterValue(counter, data.views);
  }
};

export const initArticleViews = () => {
  if (isStaticHugoServer()) {
    return;
  }

  const singleCounter = document.querySelector(".view-counter");
  const listCounters = [...document.querySelectorAll(".post-view-count")];

  loadAllViewCounters(listCounters).catch((error) => {
    console.error(error);
  });

  if (singleCounter) {
    incrementCurrentArticle(singleCounter).catch((error) => {
      console.error(error);
    });
  }
};
