export function initSkillFilter() {
  const filterButtons = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".about-skill-card");

  if (!filterButtons.length || !skillCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      skillCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
}
