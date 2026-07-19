/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        baden: {
          base: '#0B0B0B',
          panel: '#141414',
          cream: '#F5F4F1',
          gold: '#C97B2D',
          'gold-bright': '#E89A4B',
          muted: '#8F8B85',
        },
      },
      fontFamily: {
        display: ['"Golos Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"General Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      transitionDuration: {
        1200: '1200ms',
      },
    },
  },
  plugins: [],
};
