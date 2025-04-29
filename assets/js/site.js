if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("posts-container");
  const posts = container
    ? container.querySelectorAll(".post")
    : document.querySelectorAll(".post");
  const totalPosts = posts.length;

  // 1. Apply full-width styling (every 5th + last post)
  posts.forEach((post, index) => {
    if ((index + 1) % 5 === 0 || index === totalPosts - 1) {
      post.classList.add("md:col-span-2");
    }
  });

  // 2. IntersectionObserver with staggered show/hide
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = Array.from(posts).indexOf(entry.target);
      const delay = index * 50; // 100ms stagger per post

      if (entry.isIntersecting) {
        // SHOW: Add delay and animate in
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.remove("opacity-0", "translate-y-5");
        entry.target.classList.add("opacity-100", "translate-y-0");
      } else {
        // RE-HIDE: Reset delay and animate out
        entry.target.style.transitionDelay = "0ms";
        entry.target.classList.add("opacity-0", "translate-y-5");
        entry.target.classList.remove("opacity-100", "translate-y-0");
      }
    });
  }, observerOptions);

  // Observe all posts
  posts.forEach((post) => observer.observe(post));
});
