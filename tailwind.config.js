/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['content/**/*.md', 'themes/ksv/layouts/**/*.html'],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1100px',
        xl: '1440px',
      },
    },
  },
  plugins: [],
};
