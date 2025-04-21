/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1100px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
