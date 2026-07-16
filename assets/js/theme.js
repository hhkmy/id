const getStoredTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
};

export function initTheme() {
  const darkBtn = document.getElementById("theme-toggle-dark");
  const lightBtn = document.getElementById("theme-toggle-light");
  const root = document.documentElement;

  const getActiveTheme = () => (root.classList.contains("dark") ? "dark" : "light");

  const setGiscusTheme = (theme) => {
    const giscusTheme = theme === "dark" ? "dark" : "light";
    const giscusScript = document.querySelector(
      'script[src="https://giscus.app/client.js"]',
    );
    if (giscusScript) {
      giscusScript.setAttribute("data-theme", giscusTheme);
    }

    const giscusFrame = document.querySelector(
      'iframe.giscus-frame[src^="https://giscus.app"]',
    );
    if (!giscusFrame?.contentWindow) return;

    if (giscusFrame.dataset.loaded !== "true") {
      giscusFrame.addEventListener(
        "load",
        () => {
          giscusFrame.dataset.loaded = "true";
          setGiscusTheme(getActiveTheme());
        },
        { once: true },
      );
      return;
    }

    try {
      giscusFrame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: giscusTheme,
            },
          },
        },
        "https://giscus.app",
      );
    } catch {
      giscusFrame.addEventListener(
        "load",
        () => setGiscusTheme(getActiveTheme()),
        { once: true },
      );
    }
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    root.toggleAttribute("data-pf-theme", isDark);
    if (isDark) {
      root.setAttribute("data-pf-theme", "dark");
    }
    if (darkBtn) darkBtn.style.display = isDark ? "none" : "";
    if (lightBtn) lightBtn.style.display = isDark ? "" : "none";
    const qrImage = document.getElementById("qr-image");
    if (qrImage) qrImage.dataset.theme = theme;
    setGiscusTheme(theme);
  };

  const giscusObserver = new MutationObserver(() => {
    if (
      !document.querySelector('iframe.giscus-frame[src^="https://giscus.app"]')
    ) {
      return;
    }

    setGiscusTheme(getActiveTheme());
    giscusObserver.disconnect();
  });

  if (document.body) {
    giscusObserver.observe(document.body, { childList: true, subtree: true });
  }

  const storedTheme = getStoredTheme();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = storedTheme === "dark" || (!storedTheme && systemDark) ? "dark" : "light";
  setStoredTheme(theme);
  applyTheme(theme);

  darkBtn?.addEventListener("click", () => {
    setStoredTheme("dark");
    applyTheme("dark");
  });
  lightBtn?.addEventListener("click", () => {
    setStoredTheme("light");
    applyTheme("light");
  });

  return {
    watchSystemTheme() {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          const storedTheme = getStoredTheme();
          applyTheme(storedTheme || (event.matches ? "dark" : "light"));
        });
    },
  };
}
