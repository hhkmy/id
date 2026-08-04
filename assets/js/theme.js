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

  const setRemark42Theme = (theme) => {
    window.REMARK42?.changeTheme(theme === "dark" ? "dark" : "light");
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
    setRemark42Theme(theme);
  };

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
