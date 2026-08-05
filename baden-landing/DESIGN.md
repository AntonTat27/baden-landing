# Design

Recorded from the built page, not from intention. Source of truth for tokens
is `src/index.css` (`.v-baden` block); source of truth for copy is
`src/data/site.js`. Nothing here restates product facts — see PRODUCT.md.

## The idea

A serious, registered property purchase presented with the restraint of a
private-bank prospectus rather than the saturation of a resort brochure.

Three saturated directions were built first (İznik cobalt, Portolan chart
magenta, Lycia pine/ultramarine) and rejected: page-scale colour fields read
as *expressive*, and this buyer is reading legal terms as carefully as they
look at photographs. They survive at `/explorations` as reference only.

The rule that follows from that: **no hue at page scale, anywhere.** Structure
comes from three things instead — rule weight, the size of the empty space,
and two deep-ink bands that break the page.

## Palette

Warm-neutral paper, near-black warm ink, one muted bronze.

| Token | Value | Role | Measured |
| --- | --- | --- | --- |
| `--ground` | `#f1ede6` | the page | — |
| `--ground-2` | `#e7e2d8` | recessed panels | — |
| `--ground-3` | `#f9f7f2` | raised surfaces (the form) | — |
| `--ink` | `#1c1a17` | text, actions, band 1 | 15.9:1 on ground |
| `--ink-2` | `#272420` | footer band | — |
| `--fg-soft` | `#5a534a` | body on paper | 6.50:1 on ground |
| `--fg-faint` | `#675f55` | small caps, coordinates | 5.35:1 ground / 4.84:1 ground-2 |
| `--on-ink` | `#f1ede6` | text on ink | 15.9:1 on ink |
| `--on-ink-soft` | `rgba(241,237,230,.72)` | body on ink | — |
| `--on-ink-faint` | `rgba(241,237,230,.5)` | meta on ink | 4.64:1 composited |
| `--bronze` | `#7d5f34` | hairlines, marks, small caps | 5.03:1 on ground |
| `--bronze-on-ink` | `#c39c5e` | same, on the dark bands | 6.74:1 on ink |

**Bronze never fills a shape.** The moment it becomes a surface it turns into
the gold-luxury cliché this palette exists to avoid. It is a 1px rule, a 5px
dot, or ~10px tracked caps — nothing else.

**Actions are ink, not colour.** There is no coloured button on the page.

Contrast was measured on the rendered page (`scratchpad/qa/qa5.mjs`), not
estimated. Two tokens failed a first audit and were corrected.

## Type

- **Display — Prata** (400, the only weight). Headings, residence names,
  prices, wordmark. Cyrillic-native, high-contrast, editorial.
- **Body/UI — Manrope** (300–700). Prose, labels, navigation, controls.
- Display tracking runs `-0.012em` to `-0.022em`; small caps run `+0.18em` to
  `+0.26em`. Body measure capped 46–68ch per context.
- Loaded per page at runtime by `useFonts` (`src/versions/shared.js`), not
  globally in `index.html`.

Deliberately not used: Fraunces, Playfair, Cormorant, and the rest of the
default-serif cluster the previous build sat in.

## Shape and texture

- **The arch** (`.arch`) — a shallow Ottoman arch. The one shape the brand
  owns. It frames **imagery only**; it never becomes a card or a button.
- Everything else is a hard rectangle with a hairline. No rounded cards, no
  shadows as decoration, no glass.
- `.paper` / `.paper-ink` — a near-invisible laid texture so large empty
  areas read as a surface rather than a flat digital fill.

## Structure

Rhythm: paper → paper → paper → **recessed** → paper → **recessed** → **INK** →
paper → recessed → **INK footer**. The two ink bands (Trust, Footer) plus the
ownership detail panel are the only dark moments and they carry the page's
structure.

Sections, in order: Hero · Coast · Residences · Ownership · Grounds ·
Audiences · Trust · Lead · FAQ.

**The coast drawing** is the page's one piece of non-copyable proof — an SVG
survey of the Turkish shore with the five properties marked at their real
town coordinates. Line only; the land is never filled, because a filled mass
would become a colour field.

**Imagery** is the client's own branded renders and on-location footage
(`src/assets/videos/`), 464×848 portrait. They play as composed portrait
panels inside the arch, never full-bleed — at 464px wide a full-bleed desktop
hero would be visibly soft, and a composed window is the better decision
regardless.

## Conventions

- **No eyebrow or kicker above any heading.** Supporting meta sits beside the
  heading on the same baseline, which is a document device, not a label stack.
- Numbers appear only where sequence is the information (the four transaction
  steps).
- Amenities are a ruled list, not four identical icon cards.
- Icons are drawn SVG at a single 1.5–1.7 stroke weight. No emoji, no unicode
  glyphs standing in.
- `.nums` (tabular figures) on every price, so money never jitters between rows.

## Motion

One authored gesture: `rise` — 18px travel, `cubic-bezier(.16,1,.3,1)`,
900–1100ms, staggered 60–130ms. Nothing else animates on entry.

`Reveal` (`src/versions/primitives.js`) is **visible by default** and only
arms its hidden state after JS confirms an IntersectionObserver attached.
Anything already on screen at mount never animates. A blocked script or an
old browser therefore shows the full page — the inverse of the usual
`opacity-0` + `whileInView` pattern, which blanks the page when its own
machinery fails.

All motion collapses under `prefers-reduced-motion`, including the ambient
video, which falls back to its poster frame.

## Conversion

The page's only job is a phone number, so the ask repeats in the header, hero,
every residence, the ownership panel, a mid-page panel, every audience column,
the trust band, the lead section, the footer, and a persistent mobile bar
past 560px. All CTAs route through one `go()` handler and share one label set
(`CTA` in `site.js`).

The lead form validates forgivingly on phone *format* (international buyers
write numbers a dozen ways; rejecting a real number costs far more than
accepting a malformed one) but requires ≥9 digits.

**There is no backend.** `useLeadForm` simulates the submit state and drops
the lead. Wire it before launch.

## Unconfirmed data

Anything not yet confirmed renders through `<Unconfirmed>` and carries a
visible bronze dot. Prices, contact details, and the legal entity are all
currently marked. The previous build's credibility problem was invented
figures that looked settled sitting beside real legal language — see
TODO-CONTENT.md for the replacement list.
