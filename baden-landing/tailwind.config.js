/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        baden: {
          base: '#241C14',
          panel: '#2E2418',
          cream: '#E8DCC3',
          gold: '#CB9A44',
          'gold-bright': '#DFAE55',
          muted: '#8A7458',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
