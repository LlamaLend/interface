const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans]
      },
      colors: {
        primary: '#1E1E1E'
      },
      spacing: {
        '1.5': '6px',
      },
      maxWidth: {
        '8xl': '96rem'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
