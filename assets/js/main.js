// Make every 5th post full width in the grid
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('#post-grid .post-card');
  cards.forEach((card, i) => {
    card.classList.remove('sm:col-span-2');
    if ((i + 1) % 5 === 0) {
      card.classList.add('sm:col-span-2');
    }
  });
});
