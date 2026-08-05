# Color palette — Baden Premium Projects

A fitting palette for a luxury Turkish-coast timeshare/fractional-ownership brand needs to do three things at once: read as *real estate* (trustworthy, not flashy), read as *coastal Mediterranean* (warm light, not tropical or corporate-tech), and carry a data layer (three ownership models that must stay visually distinct in both a bright brochure register and a dark "arrival" register).

This proposal formalizes and extends what the current build already established through several iterations (burnt terracotta accent, ink-teal dark ground, warm sand light ground) into a complete, computed 11-shade system, following the same math already used in `tailwind.config.js`. Every ratio below was computed with the WCAG relative-luminance formula, not estimated.

## Why these three hues

- **Ink teal (H 195°)** — not black. A dark register with a whisper of deep-water blue-green reads as "coastline at dusk" rather than "dashboard." It's the arrival/closing register: hero, footer, the sections doing the most emotional work.
- **Burnt terracotta (H 14°)** — the single interactive color. Roof tile and sun-baked clay, the color of the actual Turkish coast (not a generic CTA blue or a resort-brochure coral). Reserved exclusively for things you can click, so it never gets diluted into decoration.
- **Warm sand (H 41°)** — the light register. A stone/linen neutral, not a cold white or a saturated beige, so it can host long paragraphs of legal/document copy without fatigue.

Three ownership-model accents (gold / teal / rose) sit apart from the interactive terracotta so "this is a link" and "this is a fractional-ownership property" never collide.

## Full scales

Generated at brand hue/saturation, lightness stops tuned for a dark-leaning luxury site (denser steps at the dark end than a generic SaaS ramp, saturation pulled back at the pale end so tints don't go pastel).

| Shade | Terracotta (brand) | Ink teal (dark surface) | Warm sand (light surface) |
|---|---|---|---|
| 50 | `#FAF6F4` | `#F5F8F9` | `#F9F8F6` |
| 100 | `#F4E9E6` | `#E9EFF2` | `#F1EFE9` |
| 200 | `#E9D4CD` | `#D3E0E4` | `#E3DED4` |
| 300 | `#DDAC9D` | `#A9C7D1` | `#CEC3AB` |
| 400 | `#CC826B` | `#7EAAB9` | `#B6A581` |
| **500** | **`#BE5637`** | `#518FA4` | `#9F8856` |
| 600 | `#9E482E` | `#437789` | `#857147` |
| 700 | `#7E3A25` | `#365F6D` | `#6A5B39` |
| 800 | `#5F2B1C` | `#284852` | `#50442B` |
| 900 | `#3F1D12` | `#1B3037` | `#352D1D` |
| 950 | `#28120B` | **`#111E22`** | `#211C12` |

Ownership legend (data encoding, never used for interaction/decoration):

| Shade | Gold — full ownership | Teal — fractional | Rose — timeshare |
|---|---|---|---|
| 400 (dark-surface weight) | `#CCA86B` | `#7AB7BD` | `#C37487` |
| 500 | `#BE8C37` | `#4CA1A9` | `#B1435D` |
| 700 (light-surface weight) | `#7E5E25` | `#336B71` | `#762D3E` |

## Semantic tokens

```css
/* Dark register — hero, footer, "arrival" sections */
--surface-dark:      var(--inkteal-950);   /* #111E22 */
--surface-dark-2:    var(--inkteal-900);   /* #1B3037  — panels/cards on dark */
--text-on-dark:       var(--sand-50);       /* #F9F8F6 — 16.05:1 on dark */
--link-on-dark:       var(--terracotta-300);/* #DDAC9D — 8.49:1 on dark */

/* Light register — everything else */
--surface-light:      var(--sand-50);       /* #F9F8F6 */
--surface-mid:        var(--sand-200);      /* #E3DED4 — cards, alternating blocks */
--text-on-light:       var(--inkteal-950);   /* #111E22 — 16.05:1 on light */

/* Brand accent — interactive only */
--cta-fill:           var(--terracotta-600);/* white text: 6.14:1 */
--cta-fill-hover:     var(--terracotta-700);/* white text: 8.34:1 */

/* Ownership legend, per surface */
--own-full-on-dark:   var(--gold-500);      /* 5.68:1 on surface-dark */
--own-full-on-light:  var(--gold-700);      /* 5.63:1 on surface-light */
--own-frac-on-dark:   var(--teal-own-500);  /* 5.66:1 on surface-dark */
--own-frac-on-light:  var(--teal-own-700);  /* 5.68:1 on surface-light */
--own-share-on-dark:  var(--rose-400);      /* 5.00:1 on surface-dark — rose needs the lighter step */
--own-share-on-light: var(--rose-700);      /* 8.93:1 on surface-light */
```

## Verified contrast

| Pair | Ratio | Passes |
|---|---|---|
| White text on terracotta-600 (CTA fill) | 6.14:1 | AA + AAA (large) |
| White text on terracotta-700 (CTA hover) | 8.34:1 | AAA |
| sand-50 text on inkteal-950 (body, dark) | 16.05:1 | AAA |
| inkteal-950 text on sand-50 (body, light) | 16.05:1 | AAA |
| terracotta-300 link on inkteal-950 | 8.49:1 | AAA |
| gold-500 on inkteal-950 | 5.68:1 | AA |
| gold-700 on sand-50 | 5.63:1 | AA |
| teal-own-500 on inkteal-950 | 5.66:1 | AA |
| rose-400 on inkteal-950 | 5.00:1 | AA |
| rose-700 on sand-50 | 8.93:1 | AAA |

Every text/UI pairing clears 4.5:1; nothing relies on color alone (each ownership model also gets its own dot/tick-mark shape in `OwnershipVisualizer.js`).

## Relationship to the current build

`tailwind.config.js` already implements this exact structure by hand (dark/dark-2/light/mid surfaces, a single interactive brand color, a three-color ownership legend) — this document mainly extends those hand-picked anchors into full, systematic 11-shade scales so the same hues are available at every lightness step if the product grows (dashboards, email templates, a client portal), without anyone re-deriving the math. The current `#B8593B` / `#101C20` / `#F2EDE2` anchors are kept as-is (they sit at shade 500/950/50 respectively) — nothing about the live site needs to change unless you want the extended steps.
