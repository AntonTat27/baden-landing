/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        baden: {
          // Core surfaces — pulled toward neutral charcoal (barely warm)
          // instead of sitting on the same brown ramp as the accents. Every
          // token below used to cluster in a 15–40° warm-brown hue band,
          // which is exactly why the page read as near-monochrome — the
          // surfaces now sit outside that band entirely, so the accents
          // have something genuinely different to contrast against.
          base: '#15141A',
          panel: '#1D1B23',
          panel2: '#25222C',
          cream: '#F7F3EC',
          // Primary accent — a clean, confident gold pushed toward true
          // yellow (~42° hue) rather than brown-gold, so it reads as gold
          // rather than another shade of the base.
          gold: '#D6A94C',
          'gold-bright': '#F0C876',
          // Secondary accent — pushed toward red-rust (~14° hue) so it's
          // clearly separated from gold rather than a near-neighbor on the
          // same brown ramp. Terracotta as a real color, not a gold tint.
          sea: '#C24E29',
          'sea-deep': '#832F17',
          // Tertiary — promoted from a barely-there accent to a real third
          // color: a saturated Aegean blue-teal, the cool counterweight
          // that gives the palette actual hue range instead of warm-on-warm.
          teal: '#1F7A8C',
          'teal-deep': '#155A69',
          // Neutrals kept close to true grey rather than tinted brown, so
          // body text doesn't add a ninth swatch to the warm cluster.
          sand: '#D8CFC0',
          muted: '#9B9490',
          line: '#2C2932',
        },
      },
      fontFamily: {
        // Editorial display serif — the premium anchor
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        // Grotesk body / UI
        sans: ['"General Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Golos kept for numerals / eyebrows where a serif is too soft
        grotesk: ['"Golos Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Italic accent serif
        accent: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.38em',
      },
      transitionDuration: {
        1200: '1200ms',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
