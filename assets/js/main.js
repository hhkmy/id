import ClipboardJS from 'clipboard';

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
    setGiscusTheme(theme);
  }

  function setQrImageByTheme(theme) {
    if (!qrImg) return;
    if (theme === 'dark') {
      qrImg.src = qrImg.getAttribute('data-dark');
    } else {
      qrImg.src = qrImg.getAttribute('data-light');
    }
  }

  function getActiveTheme() {
    return root.classList.contains('dark') ? 'dark' : 'light';
  }

  function setGiscusTheme(theme) {
    const giscusTheme = theme === 'dark' ? 'dark' : 'light';
    const giscusScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (giscusScript) {
      giscusScript.setAttribute('data-theme', giscusTheme);
    }

    const giscusFrame = document.querySelector('iframe.giscus-frame[src^="https://giscus.app"]');
    if (!giscusFrame?.contentWindow) return;

    if (giscusFrame.dataset.loaded !== 'true') {
      giscusFrame.addEventListener('load', () => {
        giscusFrame.dataset.loaded = 'true';
        setGiscusTheme(getActiveTheme());
      }, { once: true });
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
        'https://giscus.app',
      );
    } catch {
      giscusFrame.addEventListener('load', () => setGiscusTheme(getActiveTheme()), { once: true });
    }
  }

  const giscusObserver = new MutationObserver(() => {
    if (!document.querySelector('iframe.giscus-frame[src^="https://giscus.app"]')) return;

    setGiscusTheme(getActiveTheme());
    giscusObserver.disconnect();
  });

  giscusObserver.observe(document.body, { childList: true, subtree: true });

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

  document.querySelectorAll('.lite-youtube').forEach(embed => {
    const trigger = embed.querySelector('.lite-youtube-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = embed.getAttribute('data-youtube-src');
      iframe.title = embed.getAttribute('data-youtube-title') || 'YouTube video';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      iframe.allowFullscreen = true;
      embed.replaceChildren(iframe);
    }, { once: true });
  });

  const codeClipboard = new ClipboardJS('.code-copy-button', {
    text(trigger) {
      return trigger.closest('.code-window')?.querySelector('code')?.textContent || '';
    },
  });

  codeClipboard.on('success', event => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = 'Copied';
    button.classList.add('border-emerald-500', 'text-emerald-300');
    event.clearSelection();

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('border-emerald-500', 'text-emerald-300');
    }, 1600);
  });

  codeClipboard.on('error', event => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = 'Failed';
    button.classList.add('border-red-500', 'text-red-300');

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('border-red-500', 'text-red-300');
    }, 1600);
  });

  document.querySelectorAll('.article-content ul').forEach(list => {
    list.setAttribute('role', 'list');

    list.querySelectorAll(':scope > li').forEach(item => {
      if (item.querySelector(':scope > svg')) return;

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'article-list-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('width', '24');
      icon.setAttribute('height', '24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.innerHTML = '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>';

      item.prepend(icon);
    });
  });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealSelectors = [
    '.home-hero',
    '.article-hero',
    '.home-hero-panel',
    '.article-meta',
    '.panel',
    '.article-card',
    '.focus-card',
    '.about-card',
    '.about-contact-card',
    '.about-timeline-item',
    '.about-skill-card',
    '.archive-year-card',
    '.archive-item',
    '.book-card',
    '.article-content',
    '.article-footer',
  ];

  const revealItems = document.querySelectorAll(revealSelectors.join(','));
  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    revealItems.forEach(item => item.classList.add('scroll-reveal'));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12,
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  document.addEventListener('keydown', event => {
    if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'k') {
      return;
    }

    const searchModal = document.querySelector('pagefind-modal');
    if (!searchModal) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (searchModal.isOpen || searchModal.querySelector('dialog[open]')) {
      if (typeof searchModal.close === 'function') {
        searchModal.close();
      }
      return;
    }

    if (typeof searchModal.open === 'function') {
      searchModal.open();
      return;
    }

    document.querySelector('pagefind-modal-trigger button')?.click();
  }, true);

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
