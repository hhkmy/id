/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./assets/js/**/*.js",
    "./hugo_stats.json",
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1100px",
        xl: "1440px",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
};
