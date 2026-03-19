/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090F',
        surface: '#12121A',
        border: '#1E1E2E',
        accent: '#3A86FF',
        gold: '#C9A84C',
        muted: '#6B6B7B',
        cream: '#F0EEE8',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      }
    }
  },
  plugins: []
}