document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Mobile menu toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
// Make every 5th post full width in the grid
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('#post-grid .post-card');
  cards.forEach((card, i) => {
    card.classList.remove('sm:col-span-2');
    if ((i + 1) % 5 === 0) {
      card.classList.add('sm:col-span-2');
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
