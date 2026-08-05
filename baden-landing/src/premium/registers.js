// ONE-REGISTER SYSTEM (Coastal Night)
// ---------------------------------------------------------------------------
// Petrol & Gold ran a HARD/SOFT split partly to justify its light/dark
// surface alternation — a catalog page needed a border to read as a
// separate mode from a borderless photo page. Coastal Night has no light
// surface to alternate against, so that justification is gone. What
// survives from the split, kept as a single set of tokens rather than two,
// is corner radius and border: hairline rectangles everywhere, one radius
// scale, one border color. Motion is likewise ONE authored gesture (`rise`
// in motion.js) at one duration — no separate "crisp catalog" vs "slow
// curtain" timing. See DESIGN.md "Motion": one gesture, not scattered ones.

export const REGISTER = {
  radius: 'rounded-sm',
  radiusLg: 'rounded-md',
  border: 'border border-baden-line',
};
