document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher for Tailwind dark mode
  const darkBtn = document.getElementById('theme-toggle-dark');
  const lightBtn = document.getElementById('theme-toggle-light');
  const root = document.documentElement;
  const qrImg = document.getElementById('qr-image');

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
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    theme = 'dark';
    if (darkBtn) darkBtn.style.display = 'none';
    if (lightBtn) lightBtn.style.display = '';
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    theme = 'light';
    if (darkBtn) darkBtn.style.display = '';
    if (lightBtn) lightBtn.style.display = 'none';
  }
  setQrImageByTheme(theme);

  if (darkBtn && lightBtn) {
    darkBtn.addEventListener('click', () => {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (darkBtn) darkBtn.style.display = 'none';
      if (lightBtn) lightBtn.style.display = '';
      setQrImageByTheme('dark');
    });
    lightBtn.addEventListener('click', () => {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (darkBtn) darkBtn.style.display = '';
      if (lightBtn) lightBtn.style.display = 'none';
      setQrImageByTheme('light');
    });
  }

  // Listen for system theme changes and update Tailwind dark class
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const systemTheme = e.matches ? 'dark' : 'light';
    if (!localStorage.getItem('theme')) {
      if (systemTheme === 'dark') {
        root.classList.add('dark');
        setQrImageByTheme('dark');
      } else {
        root.classList.remove('dark');
        setQrImageByTheme('light');
      }
    } else {
      setQrImageByTheme(localStorage.getItem('theme'));
    }
  });
});

