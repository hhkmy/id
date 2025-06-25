/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/js/**/*.js',
    './hugo_stats.json'
  ],
  theme: {
    extend: {
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1100px',
        'xl': '1440px',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
