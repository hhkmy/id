document.addEventListener("DOMContentLoaded", async () => {
  const workerUrl = "https://hhkmyid.heinhtetkyaw.workers.dev";

  // Function to update counter display
  const updateCounter = (element, count) => {
    const countElement = element.querySelector(".count") || element;
    countElement.textContent = count.toLocaleString();
    countElement.style.opacity = 1; // Make fully visible
  };

  // Handle single post view counter
  const singlePostCounter = document.querySelector(".view-counter");
  if (singlePostCounter) {
    const path = singlePostCounter.dataset.path;

    try {
      // 1. First get current view count
      const getResponse = await fetch(
        `${workerUrl}?path=${encodeURIComponent(path)}`,
      );

      if (!getResponse.ok) {
        throw new Error(`GET request failed with status ${getResponse.status}`);
      }

      const result = await getResponse.json();
      updateCounter(singlePostCounter, result.views || 0);

      // 2. Increment count (fire and forget)
      fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `path=${encodeURIComponent(path)}`,
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Increment failed with status:", response.status);
          }
          return response.json();
        })
        .then((data) => {})
        .catch((error) => {
          console.error("Increment error:", error);
        });
    } catch (error) {
      console.error("View counter error:", error);
      updateCounter(singlePostCounter, 0);
      singlePostCounter.querySelector(".count").style.color = "#999";
    }
  }

  // Handle post lists view counters
  const postListCounters = document.querySelectorAll(".post-view-count");
  if (postListCounters.length > 0) {
    try {
      const response = await fetch(`${workerUrl}?path=ALL_VIEWS`);

      if (!response.ok) {
        throw new Error(`Failed to fetch all views: HTTP ${response.status}`);
      }

      const allViews = await response.json();

      postListCounters.forEach((counter) => {
        const path = counter.dataset.path.replace(/\/+$/, "") || "/";
        const views = allViews[path] || 0;
        updateCounter(counter, views);
      });
    } catch (error) {
      console.error("Failed to load post list views:", error);
      postListCounters.forEach((counter) => {
        counter.querySelector(".count").textContent = "-";
        counter.querySelector(".count").style.color = "#999";
      });
    }
  }
});
