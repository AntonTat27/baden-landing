import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UNITS, OWNERSHIP_MODELS, minPrice, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { plural } from '../data/site';
import { Reveal, RevealLines, fadeUp } from './motion';

// THE LISTINGS SECTION, BACK TO CARDS
// ===========================================================================
// The bento grid this replaces showed all five residences without a click,
// which is right for desktop, but on a phone five bento cells collapse into
// one long single-file column: the two-column cells lose their comparison
// value, and it reads as an unusually tall, undifferentiated scroll. A
// swipeable rail of individually-sized cards is the better shape for that
// viewport, one residence in full at a time, an explicit swipe gesture
// instead of a long scroll.
//
// Card visual language (white panel, corner status badge, a distinct price
// block, an outline-to-fill CTA) was supplied as a reference by the client.
// The structure and interaction physics are kept; the literal colors/fonts
// are not, since the reference used a gold/cypress palette and two typefaces
// (JetBrains Mono, Cormorant Garamond) that don't exist anywhere else on this
// page. Reusing the site's own cobalt brand, the own-* ownership legend, and
// the two-family Unbounded/Onest system keeps this card the same product,
// consistent with the rest of the page rather than a one-off skin.

// Card is a dark green panel now (see PropertyCard's CARD_GREEN), so the
// legend uses the dark-surface weights, same as Audiences/HowItWorks-on-dark
// elsewhere — the badge chip this used to also color is gone; the dot below
// the title is the only ownership marker on the card now.
const OWNERSHIP_DOT = {
  full: 'bg-baden-own-full',
  fractional: 'bg-baden-own-frac',
  timeshare: 'bg-baden-own-share',
};
const OWNERSHIP_TEXT = {
  full: 'text-baden-own-full',
  fractional: 'text-baden-own-frac',
  timeshare: 'text-baden-own-share',
};

function OwnershipTags({ ownership, isRu, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {ownership.map((key) => {
        const m = OWNERSHIP_MODELS[key];
        if (!m) return null;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 text-[11px] tracking-wide uppercase font-medium ${OWNERSHIP_TEXT[m.accent]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${OWNERSHIP_DOT[m.accent]}`} aria-hidden />
            {isRu ? m.ru.short : m.en.short}
          </span>
        );
      })}
    </div>
  );
}

// FOUR-DOT ELLIPSIS
// ---------------------------------------------------------------------------
// Villa Aurelia rendered as "...полностью личного дома...." (four dots). The
// cause was not the source string's trailing full stop: `line-clamp-2` cut
// this particular blurb immediately after an INTERNAL sentence-ending period
// and then appended its own ellipsis behind it. CSS gives no control over
// where that cut lands, so the truncation lives in JS, where the cut point is
// knowable: trim to roughly the target length, back up to a word boundary,
// strip whatever punctuation is now dangling, add exactly one ellipsis.
//
// The source strings in src/data/units.js are deliberately untouched: they
// are correct prose and are rendered in full on the residence detail page.
function clampBlurb(text, chars) {
  if (text.length <= chars) return text;
  const cut = text.slice(0, chars);
  const lastSpace = cut.lastIndexOf(' ');
  const atWordBoundary = lastSpace > chars * 0.5 ? cut.slice(0, lastSpace) : cut;
  return `${atWordBoundary.replace(/[\s.,;:!?-]+$/u, '')}…`;
}

// One card in the rail — a floating glass card, not a boxed panel: the
// photo runs the full card edge to edge and stays roughly 80% visible at
// rest, with only a bottom gradient (no solid fill) carrying the minimal
// footer (tag, name, price). Everything else — the ownership tags, the
// blurb, the CTA — is hidden until hover, so the resting grid stays quiet
// and image-led rather than every card showing its full copy block at once.
// Taller 3:4 card, a thin true-white hairline border (not the page's warm
// baden-line) and 8px corners, per the reference this pass was built from.
function PropertyCard({ unit, isRu }) {
  const primaryModel = unit.ownership[0] || 'full';
  const accentColor = primaryModel === 'full' ? '#D4AF37' : primaryModel === 'fractional' ? '#3FB6C2' : '#DB7F94';
  const accentGlow = primaryModel === 'full' ? 'rgba(212,175,55,0.25)' : primaryModel === 'fractional' ? 'rgba(63,182,194,0.25)' : 'rgba(219,127,148,0.25)';
  const textColorClass = primaryModel === 'full' ? 'text-baden-brand' : primaryModel === 'fractional' ? 'text-baden-own-frac' : 'text-baden-own-share';

  return (
    <motion.div
      variants={fadeUp}
      className="group relative shrink-0 snap-start w-[88vw] sm:w-[385px] aspect-[3/4] rounded-panel overflow-hidden border border-white/10 hover:border-[var(--accent-color)] transition-all duration-500 ease-out hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_30px_var(--accent-glow)]"
      style={{
        '--accent-color': accentColor,
        '--accent-glow': accentGlow,
      }}
    >
      <Link to={`/residence/${unit.id}`} className="absolute inset-0 block">
        {/* Floating Badges */}
        <div className="absolute left-4 top-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3 py-1.5 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/90">
              {isRu ? unit.type.ru : unit.type.en}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-[10px] text-white/70 font-sans">
              {unit.bedrooms} {isRu ? 'спальни' : 'BR'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3 py-1.5 border border-white/10">
            <span className={`h-1.5 w-1.5 rounded-full ${OWNERSHIP_DOT[primaryModel]}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${textColorClass}`}>
              {isRu ? OWNERSHIP_MODELS[primaryModel].ru.short : OWNERSHIP_MODELS[primaryModel].en.short}
            </span>
          </div>
        </div>

        <img
          src={unit.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          style={{ objectPosition: positionFor(unit.image) }}
        />
        {/* Bottom gradient only — no solid panel — so the photo itself
            still reads as the card at rest. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-widest2 uppercase text-baden-on-dark/60">
            {isRu ? unit.location.ru : unit.location.en}
          </p>
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display font-light text-xl sm:text-2xl text-baden-on-dark leading-tight">
              {isRu ? unit.name.ru : unit.name.en}
            </h3>
            <span className={`shrink-0 font-display font-medium text-xl sm:text-2xl tabular-nums ${textColorClass}`}>
              {formatEUR(unit.entryFrom)}
            </span>
          </div>

          {/* Hover reveal — collapsed to zero height at rest via max-height */}
          <div className="grid max-h-0 grid-rows-[0fr] opacity-0 transition-[max-height,opacity] duration-300 ease-out group-hover:max-h-48 group-hover:opacity-100 group-focus-within:max-h-48 group-focus-within:opacity-100">
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2.5 pt-3">
                <OwnershipTags ownership={unit.ownership} isRu={isRu} />
                <p className="text-sm text-baden-on-dark/60 leading-relaxed line-clamp-2">
                  {clampBlurb(isRu ? unit.blurb.ru : unit.blurb.en, 100)}
                </p>
                <div className="mt-1">
                  <span className={`group/cta inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold tracking-widest2 uppercase text-baden-on-dark transition-all duration-300 hover:border-[var(--accent-color)] hover:bg-white/10`}>
                    {isRu ? 'Смотреть' : 'Watch'}
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Circular scroll-nav arrow, light-surface weight to match the section it
// sits in.
function RailArrow({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      className="h-11 w-11 shrink-0 rounded-full border border-baden-ink-line flex items-center justify-center text-baden-ink hover:border-baden-brand-deep hover:text-baden-brand-deep transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`}>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

// FORMAT FILTER — the section's functional upgrade beyond title+carousel: a
// row of the same three ownership chips used everywhere else on the page
// (OWNERSHIP_MODELS), but here they actually do something — clicking one
// narrows the rail to residences sold that way. "All" is the default so the
// section still opens showing the full portfolio.
function FormatFilter({ value, onChange, isRu }) {
  const options = ['all', ...Object.keys(OWNERSHIP_MODELS)];
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={isRu ? 'Фильтр по формату' : 'Filter by format'}>
      {options.map((key) => {
        const active = value === key;
        const m = key === 'all' ? null : OWNERSHIP_MODELS[key];
        const dotClass = m ? OWNERSHIP_DOT[m.accent] : null;
        const label = m ? (isRu ? m.ru.short : m.en.short) : isRu ? 'Все форматы' : 'All formats';
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-widest2 uppercase transition-colors duration-200 ${
              active
                ? 'border-baden-ink bg-baden-ink text-baden-ivory'
                : 'border-baden-ink-line text-baden-ink/65 hover:border-baden-ink/40 hover:text-baden-ink'
            }`}
          >
            {dotClass && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Properties() {
  const { isRu } = useLanguage();
  const [filter, setFilter] = useState('all');

  const railRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const filtered = filter === 'all' ? UNITS : UNITS.filter((u) => u.ownership.includes(filter));

  // Real figures, not invented ones: entry price range and residence count
  // both come straight from data/units.js, the same source the cards and
  // the Hero's own stat strip read from.
  const entryPrices = UNITS.map((u) => u.entryFrom);
  const minEntry = Math.min(...entryPrices);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  // Changing the filter changes the rail's content and scroll width from
  // under the visitor — snap back to the start rather than leaving the rail
  // scrolled to a position that may no longer contain a card.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: 'auto' });
    updateArrows();
  }, [filter, updateArrows]);

  const scrollByCard = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const amount = (card ? card.getBoundingClientRect().width : 360) + 24;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    // RHYTHM: the second half of the "Formats" block, directly under
    // HowItWorks (dark) with no hairline between them. The lightest, whitest
    // surface on the page — this is the shopfront, and the brief specifically
    // asked for it to read as light/whitish rather than one more dark panel.
    <section id="properties" className="relative bg-baden-ivory py-20 md:py-28 overflow-hidden">
      {/* Ambient depth. A single disc at blur-[60px]: past roughly 60px the
          result is visually indistinguishable from a smaller radius on a
          larger, fainter disc, while costing strictly more to composite on
          every scroll frame. */}
      <div
        className="absolute bottom-0 -left-24 h-[24rem] w-[22rem] rounded-full bg-baden-brand/[0.10] blur-[70px] pointer-events-none"
        aria-hidden
      />

      <div className="max-w-8xl mx-auto px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8 md:mb-10">
          <div className="max-w-2xl">
            <h2 className="font-display font-light text-4xl md:text-6xl text-baden-ink leading-[1.04] tracking-[-0.02em]">
              <RevealLines lines={isRu ? ['Какая из них ваша?'] : ['Which one is yours?']} />
            </h2>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-5 text-sm md:text-base text-baden-ink/65 leading-relaxed max-w-md"
            >
              {isRu
                ? 'Пять объектов на разных участках побережья. Цвет метки показывает формат владения.'
                : 'Five properties along different stretches of coast. The marker colour shows the ownership format.'}
            </Reveal>
          </div>
          {/* Scroll controls, desktop only — mobile relies on the swipe
              gesture itself plus the arrows repeated below the rail. */}
          <div className="hidden md:flex items-center gap-3">
            <RailArrow dir="left" onClick={() => scrollByCard('left')} disabled={!canLeft} />
            <RailArrow dir="right" onClick={() => scrollByCard('right')} disabled={!canRight} />
          </div>
        </div>

        {/* Format filter + live count/price fact — the section's upgrade
            beyond a bare title-and-carousel: an actual control, and a real
            figure rather than decoration. */}
        <Reveal
          delay={0.15}
          className="flex flex-col gap-4 border-y border-baden-ink-line py-4 mb-10 md:mb-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <FormatFilter value={filter} onChange={setFilter} isRu={isRu} />
          <div className="flex items-baseline gap-2 text-baden-ink/55">
            <span className="font-display text-lg text-baden-ink tabular-nums">{filtered.length}</span>
            <span className="text-[11px] tracking-widest2 uppercase">
              {plural(filtered.length, { ru: ['объект', 'объекта', 'объектов'], en: ['residence', 'residences'] }, isRu).replace(/^\d+ /, '')}
            </span>
            <span className="text-baden-ink/25">·</span>
            <span className="text-[11px] tracking-widest2 uppercase">
              {isRu ? 'от' : 'from'} <span className="font-display text-baden-ink">{formatEUR(minEntry)}</span>
            </span>
          </div>
        </Reveal>

        <motion.div
          key={filter}
          ref={railRef}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6 md:-mx-10 md:px-10"
        >
          {filtered.map((unit) => (
            <div key={unit.id} data-card>
              <PropertyCard unit={unit} isRu={isRu} />
            </div>
          ))}
        </motion.div>

        {/* Mobile scroll controls, under the rail — the primary interaction
            on a phone is the swipe itself, these are a secondary affordance
            for anyone who taps instead. */}
        <div className="flex md:hidden items-center gap-3 mt-6">
          <RailArrow dir="left" onClick={() => scrollByCard('left')} disabled={!canLeft} />
          <RailArrow dir="right" onClick={() => scrollByCard('right')} disabled={!canRight} />
        </div>
      </div>
    </section>
  );
}
