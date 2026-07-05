document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher for Tailwind dark mode
  const darkBtn = document.getElementById('theme-toggle-dark');
  const lightBtn = document.getElementById('theme-toggle-light');
  const root = document.documentElement;
  const qrImg = document.getElementById('qr-image');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    root.toggleAttribute('data-pf-theme', isDark);
    if (isDark) {
      root.setAttribute('data-pf-theme', 'dark');
    }
    if (darkBtn) darkBtn.style.display = isDark ? 'none' : '';
    if (lightBtn) lightBtn.style.display = isDark ? '' : 'none';
    setQrImageByTheme(theme);
  }

  function setQrImageByTheme(theme) {
    if (!qrImg) return;
    if (theme === 'dark') {
      qrImg.src = qrImg.getAttribute('data-dark');
    } else {
      qrImg.src = qrImg.getAttribute('data-light');
    }
  }

  // User-requested theme logic
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme;
  if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
    localStorage.setItem('theme', 'dark');
    theme = 'dark';
  } else {
    localStorage.setItem('theme', 'light');
    theme = 'light';
  }
  applyTheme(theme);

  if (darkBtn && lightBtn) {
    darkBtn.addEventListener('click', () => {
      localStorage.setItem('theme', 'dark');
      applyTheme('dark');
    });
    lightBtn.addEventListener('click', () => {
      localStorage.setItem('theme', 'light');
      applyTheme('light');
    });
  }

  // Listen for system theme changes and update Tailwind dark class
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const systemTheme = e.matches ? 'dark' : 'light';
    if (!localStorage.getItem('theme')) {
      applyTheme(systemTheme);
    } else {
      applyTheme(localStorage.getItem('theme'));
    }
  });
});
