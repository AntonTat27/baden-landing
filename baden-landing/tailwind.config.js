/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // COASTAL NIGHT (v3 — charcoal-navy, sharpened)
        // ===================================================================
        // v2's blue-teal ground, stacked with grain texture, blurred ambient
        // glows, and low-opacity text everywhere, read as murky/cloudy rather
        // than rich — a "dark mode done poorly" problem, not a hue problem.
        // v3: a cleaner, less-tinted charcoal-navy ground (still dark, not
        // neutral grey), a genuinely metallic gold instead of a soft muted
        // amber, crisper off-white text at higher default opacity, and the
        // grain/blur atmosphere effects removed at the source (Hero.js,
        // registers, per-section ambient discs) rather than papered over
        // here. Primary CTAs are now solid gold fill + dark ink text — a
        // filled focal point, not another outline lost in the dark.
        //
        // Every ratio below is computed (scratchpad/contrast3.js), not
        // estimated.
        baden: {
          // ---- SURFACES ------------------------------------------------
          dark: '#0B1220', // deep charcoal-navy, the page's default ground
          'dark-2': '#111B2E', // raised panels/cards, one step lighter
          // dark-3/dark-4 used to be lightened straight off the navy ground,
          // which pulls hue toward cyan-blue as it lightens — the "light
          // blue panel" complaint. Re-anchored to a warm charcoal ramp
          // instead (same target luminance as before, hue moved off navy
          // entirely) so LeadSection and anything else built on these two
          // steps goes neutral-warm rather than blue, with zero changes
          // needed at the call sites.
          'dark-3': '#2E2822', // warm charcoal, one step lighter than dark-2
          'dark-4': '#443C33', // warm charcoal, lighter still

          // ---- TEXT ----------------------------------------------------
          'on-dark': '#F5F3EE', // crisp off-white, 16.9:1 on dark
          muted: '#A7B4C2', // secondary text, cool-bright rather than dark-grey, 8.87:1 on dark

          // ---- BRAND ACCENT (interactive + hairlines) -------------------
          // A real metallic gold, not a muted amber — the previous value
          // read dull against the darker ground and made the whole "dark +
          // gold" move look like a cheap template instead of deliberate.
          brand: '#D4AF37', // gold, 8.90:1 on dark
          'brand-deep': '#B8912A', // hover/active weight
          'brand-bright': '#E8C766', // lighter weight for small text, 11.41:1 on dark
          'brand-ink': '#0B1220', // dark text set ON a solid gold CTA fill, 8.90:1

          // ---- OWNERSHIP LEGEND (data encoding only) --------------------
          // full / fractional / timeshare — three distinct hues: this marks
          // three different things, not three shades of one accent. Never
          // used for interaction, decoration, or hairlines — those stay
          // brand-only.
          'own-full': '#E0B24A', // gold, 9.48:1 on dark
          'own-frac': '#3FB6C2', // teal, 7.74:1 on dark
          'own-share': '#DB7F94', // rust/rose, 6.66:1 on dark

          // ---- STATE ---------------------------------------------------
          // Form errors get their own hue rather than the brand accent,
          // which would read as "this is a link" instead of "this is wrong".
          danger: '#E08A7D', // warm coral-red

          // ---- HAIRLINES -----------------------------------------------
          line: 'rgba(245, 243, 238, 0.16)', // the only neutral hairline color, page-wide

          // ---- LIGHT REGISTER --------------------------------------------
          // A second surface family, deliberately warm-paper rather than
          // stark white (a pure #FFF next to the gold/navy palette would
          // read as a UI-kit default, not a considered second tone). Used
          // sparingly — Statement and LegalTrust only — as the one genuine
          // tonal break in a page that otherwise cycles through navy shades.
          ivory: '#F3EEE3',
          'ivory-2': '#E7DFCC', // one step deeper, for panel-on-panel variation inside a light section
          ink: '#171310', // near-black warm ink, set on ivory (baden-dark reads faintly blue here)
          'ink-muted': 'rgba(23, 19, 16, 0.6)',
          'ink-line': 'rgba(23, 19, 16, 0.14)',
        },
      },
      fontFamily: {
        // TWO FAMILIES, BOTH WITH REAL CYRILLIC
        // -----------------------------------------------------------------
        // Display moves from Playfair Display to Spectral: still a serif
        // with real editorial weight, but its high-weight cuts (600/700)
        // sit heavier and more contemporary against a dark ground than
        // Playfair's ornamental contrast — reads as a considered document,
        // not a resort-brochure script. Confirmed against the live Google
        // Fonts CSS2 API (not assumed) that both families ship the base
        // cyrillic block (U+0400-045F), after an earlier stack silently
        // fell back to Georgia/system-ui on the Russian page, the primary
        // sales language. Bodoni Moda, Bricolage Grotesque, Marcellus, and
        // Frank Ruhl Libre were checked and rejected on this basis — no
        // Cyrillic in the served subset.
        display: ['"Spectral"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Onest"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.38em',
      },
      borderRadius: {
        // ONE RADIUS SYSTEM, one documented rule:
        //   interactive (buttons, pills, chips) -> rounded-full
        //   surfaces (cards, panels, media)     -> rounded-panel (14px)
        //   inputs                              -> rounded-field (8px)
        // Anything else is a mistake. The old system mixed rounded-2xl,
        // rounded-3xl, rounded-full and square hairline boxes with no rule.
        panel: '14px',
        field: '8px',
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
