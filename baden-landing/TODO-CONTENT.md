# TODO — content & assets

> **Updated after the redesign.** Two structural problems this file described
> are now fixed, and the line numbers below refer to the OLD components:
>
> - **Contact details are no longer duplicated.** Every phone number, handle,
>   and the legal entity now live once, in `src/data/site.js` (`CONTACT`,
>   `LEGAL_ENTITY`). Fix them there and the whole site updates. §1's warning
>   about drift across two files no longer applies.
> - **Nothing provisional looks settled any more.** Every unconfirmed figure
>   renders through `<Unconfirmed>` and carries a visible bronze dot on the
>   page. The premise of this document — "provisional but does not look
>   provisional" — has been addressed in the UI; the items themselves are
>   still unconfirmed and still block go-live.
> - **The hero photograph problem (§4) is resolved.** The tropical Unsplash
>   shot is gone. The hero now plays the client's own branded Beyzade render
>   (`src/assets/videos/candidate_B_dusk_pass.mp4`). §4's sourcing brief is
>   retained below only in case real photography is commissioned later.
>
> Still fully open: §2 legal entity, §3 commercial figures, §5 licensing and
> the residence photography for the four non-Beyzade properties. Also new:
> **the lead form has no backend** — `useLeadForm` in `src/versions/shared.js`
> simulates the submit and drops the lead.

Everything on this page that is **provisional but does not look provisional**.

The values below are deliberately still in the UI: a visibly broken page is
harder to review than a plausible one, and the client call needs something that
reads as finished. But nothing here has been confirmed, and every item is a
blocker for go-live. Line numbers are accurate as of the current build; the
searchable string is given for each so they stay findable if the file shifts.

---

## 1. Contact details — invented

`+90 000 000 00 00` is not a real number. It appears three times, and it is
formatted convincingly enough that it has already been read as real once.

| File | Line | Current value | Needed |
| --- | --- | --- | --- |
| `src/premium/LeadSection.js` | 87 | `{ l: 'WhatsApp', v: '+90 000 000 00 00' }` | Real WhatsApp business number |
| `src/premium/LeadSection.js` | 89 | `{ l: isRu ? 'Телефон' : 'Phone', v: '+90 000 000 00 00' }` | Real sales line |
| `src/premium/Footer.js` | 44 | `WhatsApp: +90 000 000 00 00` | Same number as LeadSection:87 |
| `src/premium/Footer.js` | 46 | `{isRu ? 'Телефон' : 'Phone'}: +90 000 000 00 00` | Same number as LeadSection:89 |

Also unverified, and easy to miss because it *looks* real:

- `@baden_premium` (Telegram) — `LeadSection.js:88`, `Footer.js:45`. Confirm the
  handle exists and is monitored before launch.

**Note:** the numbers are duplicated across two files rather than sourced from
one constant. Whoever fills these in should lift them into a shared contact
module, or two of the four will drift.

---

## 2. Legal entity — explicitly labelled a placeholder, in the UI

`src/premium/Footer.js:77`

```
ООО «Baden Premium Projects» (плейсхолдер юр. лица)
"Baden Premium Projects" LLC (placeholder legal entity)
```

The word "плейсхолдер" is currently rendered to the visitor. Needed: the real
registered entity name, its jurisdiction, and its registration/tax number.
Note that the trust section names a *German* developer
(`PP Projektentwicklung GmbH`), so the selling entity's relationship to it
should be stated correctly rather than guessed at.

---

## 3. Commercial figures — illustrative, not confirmed

Flagged in-code already, repeated here so the whole inventory is in one place.

| File | Line | Current value | Needed |
| --- | --- | --- | --- |
| `src/premium/Hero.js` | 91 | `Минимальный срок` = `1 неделя` / `1 week` | Confirmed minimum term |
| `src/premium/Hero.js` | 92 | `Вход от` = `€5,000` | Confirmed entry price |
| `src/data/units.js` | ~30 | `entryFrom` for all five residences | Confirmed per-property buy-in |
| `src/data/units.js` | — | `prices` (seasonal usage costs) | Confirmed seasonal rates |

The hero's `€5,000` is derived from the Beyzade timeshare `entryFrom`, so the
two have to be corrected **together** — fixing one and not the other produces a
hero stat that contradicts the residence card directly beneath it.

These are the highest-risk items in this document. They are price claims for a
regulated purchase, sitting next to real legal language about TAPU registration.

---

## 4. The hero photograph is not Turkey

**Rendered image:** `heroImg` in `src/assets/imagePositions.js:9` —
Unsplash `photo-1540541338287-41700207dee6`.

> A local `src/assets/images/hero.jpg` also exists but is **not imported
> anywhere**. Replacing that file will not change the page. The live hero is
> the hotlinked Unsplash URL above. Same trap applies to
> `src/assets/images/showcase-concierge.jpg` and `showcase-pool.jpg`, which are
> also unused; only `showcase-grounds.jpg` is actually imported
> (`src/premium/LegalTrust.js:4`, as a background texture in the trust section).

### Why the current shot fails

It shows a clifftop infinity pool ringed with tall palms over flat, bright
turquoise water — the visual vocabulary of Bali or the Maldives. It sits
directly beneath the eyebrow **«Турецкая Ривьера» / "Turkish Riviera"**. A
buyer who knows the Turkish coast will read the mismatch immediately, and the
page's whole argument is that this is a real, specific, legally-registered
place. The image undercuts that before any copy is read.

### Sourcing brief

- **Subject:** Turkish Mediterranean coastline — Antalya / Fethiye / Bodrum
  character. Pine-covered limestone slopes running down into deep blue water;
  rocky or pebble shoreline; dense low scrub. **No tall tropical palms**, no
  overwater structures, no flat white sand.
- **Time of day:** late afternoon / golden hour. The dark register and the gold
  accent were both tuned against a warm low-light frame; a cool blue-hour or
  midday shot will fight the palette.
- **Aspect ratio:** must survive `object-cover` at full-bleed `100svh`, from
  ~9:16 (portrait phone) to ~21:9 (desktop). Shoot 3:2 or wider with generous
  headroom. Deliver ≥ 2400px on the long edge.
- **Focal area / text safety:** copy is bottom-left-anchored and occupies
  roughly the **left 55% of the frame, from 30% height down to the bottom**
  (eyebrow, two headline lines, subhead, stats card, two CTAs). That region
  must be visually quiet — water, shadowed slope or sky, no high-frequency
  detail and no bright highlights. The **right third** is where the subject
  should sit; it is left deliberately un-washed so the photograph stays
  readable (see the masked legibility gradient, `src/premium/Hero.js:136-145`).
- **Licensing:** must be owned or properly licensed for commercial use.

---

## 5. Photography: licensing and reuse

### 5a. Hotlinked from a third party

`src/assets/imagePositions.js:15-19` hotlinks four images directly from
`beyzaderesort.com`:

| Constant | Subject |
| --- | --- |
| `poolImg` | Women-only pool |
| `groundsImg` | Restaurant |
| `conciergeImg` | Hamam / spa |
| `HOTEL_IMG` | Resort exterior |

Two problems, both blockers:

1. **Licensing** — these are Beyzade's own files, used without written
   permission. Needs sign-off, or licensed/owned replacements.
2. **Hotlinking** — served from their origin. They can change or 404 at any
   time, and it leaks referrer traffic. Host our own copies regardless of how
   the licensing question resolves.

The remaining images (`VILLA_IMG`, `LAGOON_IMG`, `RESIDENCES_IMG`,
`WATER_VILLAS_IMG`, `heroImg`) are Unsplash — free to use, but generic stock
standing in for five specific properties that are being sold by name.

### 5b. Not enough images for the number of slots

The caption/image contradictions in `Audiences.js` are fixed (the "one step
closer to a life by the sea" pull-quote is no longer set over an indoor
restaurant render). But the asset pool is genuinely exhausted:

- **`poolImg` is still used twice** — the Amenities pool card and the Audiences
  "leisure" scenario. This one is defensible (an outdoor pool illustrates both
  honestly) and is the least-bad option available, but it is still a repeat on
  a single page.
- Every other remote image is already committed to a specific residence in
  `src/data/units.js`, so there is nothing left to reassign.

**Needed:** distinct photography for the three Audiences scenarios, which are
concepts rather than places and so should not be borrowing residence photos at
all:

| Scenario | Currently | Should show |
| --- | --- | --- |
| Investment | Resort exterior (`HOTEL_IMG`) | The building as an asset — exterior, occupied, in use |
| Relocation | Open coastline (`LAGOON_IMG`) | Everyday coastal life: a town, a street, people living there |
| Leisure | Outdoor pool (`poolImg`) | Family/leisure use of the property itself |

Plus, per property in `src/data/units.js`: a real exterior, one interior, and
one location/context shot.

---

## Priority

1. **§3 commercial figures** and **§2 legal entity** — factual claims about a
   regulated purchase. Cannot ship wrong.
2. **§5a licensing** — third-party images used without permission.
3. **§1 contact details** — the page has working CTAs pointing at a fake number.
4. **§4 hero photograph** — credibility, and the most visible single asset.
5. **§5b additional photography** — quality; the page is coherent without it.
