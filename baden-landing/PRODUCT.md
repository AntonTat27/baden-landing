# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three primary buyer segments, all served by the same portfolio and landing page (site is bilingual RU/EN):

- **Investment buyers** — evaluating Turkish coastal property as a financial asset / rental-income play.
- **Relocation buyers** — considering moving to live on the Turkish coast; want evidence of real everyday life there, not just resort marketing.
- **Leisure/holiday buyers** — want a family vacation property or timeshare weeks, not full-time living; most price-sensitive, most likely entry point is timeshare.

## Product Purpose

Baden Premium Projects is a curated portfolio of five independent Turkish coastal properties (Bodrum, Alanya, Fethiye, Çeşme, Antalya), each individually characterized, sold through one of three distinct ownership models. The site's job is to get a qualified lead into contact (WhatsApp/phone/Telegram) with enough legal and financial clarity that the buyer understands what they'd actually be purchasing before they inquire.

## Positioning

**Flexible ownership ladder.** Baden is not one development sold one way — it's one curated portfolio accessible through three legally distinct entry points that a buyer chooses deliberately, and can move up over time:

- **Timeshare** — right to use specific weeks/year. Lowest entry, holiday use. (Beyzade Resort only.)
- **Fractional** — legally registered share, TAPU title in the buyer's name, own weeks, resellable/inheritable. (Cape Lagoon, Marea, Water Villas.)
- **Full ownership** — the whole property outright, no shared calendar, no co-owners. (Villa Aurelia; also available on Marea.)

A competitor selling a single building under a single ownership structure cannot truthfully offer this range of entry points against one coherent portfolio.

## Operating Context

- Bilingual site (Russian / English) via `LanguageContext` — Russian appears to be the primary sales language given the audience/marketing tone.
- Lead flow is direct-contact based (WhatsApp, phone, Telegram) rather than an online checkout — this is a regulated, high-consideration real-estate purchase, not e-commerce.
- Legal language references TAPU (Turkish title deed) registration for fractional/full ownership.
- Trust/legal section names a named developer partner, `PP Projektentwicklung GmbH` (German), separate from the Baden selling entity — the site must state this relationship accurately, not blur it.
- Deployed as a static site to GitHub Pages (`gh-pages`, `homepage` in package.json points to `antontat27.github.io/baden-landing`).

## Capabilities and Constraints

- Stack: React 19 + React Router + Tailwind CSS + Framer Motion + Three.js, built with `react-scripts` (CRA).
- Five listings live in `src/data/units.js`, each with: location, size, guest capacity, ownership model(s), entry price, seasonal usage pricing, bilingual blurb, and imagery.
- Property detail pages exist at `/residence/:id` (`ResidenceDetail.js`); portfolio browsing happens on the home page (`PremiumHome.js`).
- **Known unresolved facts — tracked in [TODO-CONTENT.md](TODO-CONTENT.md), must not be treated as confirmed or shipped as-is:**
  - Contact details (WhatsApp/phone number, Telegram handle) are placeholder/invented, duplicated across two files with no shared source of truth.
  - The legal selling entity name is an explicit placeholder, currently rendered visibly to visitors.
  - Commercial figures — entry prices (`entryFrom`) and seasonal usage prices in `units.js`, and the hero's headline stats — are illustrative, not confirmed. The hero's `€5,000` figure is derived from and must stay consistent with the Beyzade `entryFrom` value.
  - Several images are hotlinked from a competitor's domain (`beyzaderesort.com`) without confirmed permission, and the hero photograph depicts a tropical (Bali/Maldives-style) location inconsistent with the "Turkish Riviera" claim.
  - Photography is short of what the page's slots need — see TODO-CONTENT.md §5b for the specific gaps per section and property.

## Brand Commitments

- Name: **Baden** / **Baden Premium Projects**.
- Tagline device used in footer marquee: "Baden Premium Projects — Antalya, Türkiye —".
- Named developer partner: **PP Projektentwicklung GmbH** (Germany) — relationship to the Baden selling entity must be represented accurately once the real legal entity is confirmed.
- Design tokens already in use: `baden-ivory`, `baden-graphite`, `baden-cream` and a gold/teal/rust three-color accent system mapped consistently to the three ownership models (full/fractional/timeshare) across residence cards, the HowItWorks switcher, and an ownership donut chart.

## Evidence on Hand

- Five real, named properties with real locations, sizes, guest capacities, and bilingual descriptive copy (`src/data/units.js`) — this content is usable, unlike the commercial figures attached to it.
- No confirmed pricing, no confirmed contact channel, no confirmed legal entity, and no licensed/owned photography yet for the hero or for several residences — see Capabilities and Constraints above. Future work must not fabricate testimonials, press mentions, or additional evidence beyond what TODO-CONTENT.md and this file record.

## Product Principles

1. Legal and financial clarity is not decoration — every ownership-model claim, price, and entity name is a claim about a regulated purchase and must read as accurate, not just persuasive.
2. The three ownership models are peers, not a hidden upsell funnel — timeshare buyers should feel as respected as full-ownership buyers.
3. Each of the five properties is a distinct place with its own character; the portfolio's strength is curation, not a single repeated product.
4. Photography and claims must be geographically and legally honest (real Turkish coast, real licensed images, real entity) — credibility is the product's actual asset with a high-consideration buyer.
5. Bilingual parity: RU and EN content must stay in sync in meaning, not just present in both languages.
