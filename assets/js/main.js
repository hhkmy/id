// Make every third post full width in the grid
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('#post-grid .post-card');
  cards.forEach((card) => {
    card.classList.remove('sm:col-span-2');
  });
  if (cards.length === 1) {
    // Only one post: make it full width
    cards[0].classList.add('sm:col-span-2');
  } else if (cards.length % 2 === 1) {
    // Odd number of posts: make the last one full width
    cards[cards.length - 1].classList.add('sm:col-span-2');
  }
});
