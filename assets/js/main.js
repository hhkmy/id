document.addEventListener("DOMContentLoaded", function () {
  // Theme switcher
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

  function setTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (darkBtn) darkBtn.style.display = 'none';
      if (lightBtn) lightBtn.style.display = '';
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (darkBtn) darkBtn.style.display = '';
      if (lightBtn) lightBtn.style.display = 'none';
    }
    setQrImageByTheme(mode);
  }

  // Initial theme
  let theme = localStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(theme);

  if (darkBtn && lightBtn) {
    darkBtn.addEventListener('click', () => setTheme('dark'));
    lightBtn.addEventListener('click', () => setTheme('light'));
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setQrImageByTheme(e.matches ? 'dark' : 'light');
  });

  // Set QR image on load
  setQrImageByTheme(theme);
});
// Make every 5th post full width in the grid
document.addEventListener('DOMContentLoaded', function () {

  const cards = document.querySelectorAll('#post-grid .post-card');
  cards.forEach((card, i) => {
    card.classList.remove('sm:col-span-2', 'col-span-2');
    if ((i + 1) % 5 === 0) {
      card.classList.add('col-span-2');
    }
    // Add initial state for scroll observer effect
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
  });

  // Infinite scroll observer effect
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.6s cubic-bezier(.36,.07,.19,.97), transform 0.6s cubic-bezier(.36,.07,.19,.97)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        } else {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(card => observer.observe(card));
  }
});
