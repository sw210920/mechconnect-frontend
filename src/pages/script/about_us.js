// Simple fade animation when cards come into view

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".stat-card, .value-card, .team-card")
  .forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
  });
