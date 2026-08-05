import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { poolImg, groundsImg, conciergeImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { EASE } from './motion';

// Real amenities, sourced from Beyzade Resort's own "Sosyal Alanlar" page
// (beyzaderesort.com/sosyal-alanlar) — kept here as representative of what a
// Baden property actually offers, rather than generic stock-photo copy.
const CARDS = [
  {
    key: 'womens-pool',
    image: poolImg,
    ru: { label: 'Приватность', title: 'Раздельные зоны бассейна для мужчин и женщин', copy: 'Отдельные зоны у воды для мужчин и женщин. Приватно и с уважением к традициям гостей.' },
    en: { label: 'Privacy', title: 'Separate pool areas for men and women', copy: 'Distinct water areas for men and women. Private, and considerate of guests’ traditions.' },
  },
  {
    key: 'social',
    image: groundsImg,
    ru: { label: 'Территория', title: 'Ресторан и детский клуб', copy: 'Игровые площадки, мини-клуб и ресторан. Отдых продуман для всей семьи.' },
    en: { label: 'Grounds', title: 'Restaurant & kids’ club', copy: 'Play areas, a mini club, and an on-site restaurant, built around the whole family.' },
  },
  {
    key: 'hamam',
    image: conciergeImg,
    ru: { label: 'Спа', title: 'Хамам и массаж', copy: 'Турецкая баня, комната отдыха и массажный кабинет. Забота о теле включена.' },
    en: { label: 'Spa', title: 'Hamam & massage', copy: 'A Turkish bath, a relaxation room, and a massage suite. Wellness is built in.' },
  },
];

const AUTO_MS = 4500;

// Crossfade duration between slides. This replaces an earlier SVG
// feTurbulence/feDisplacementMap "melt" effect — technically interesting
// (it dissolved the outgoing photo through an organic noise field rather
// than a flat fade) but busier than the section needs: on a full-bleed
// background that changes every 4.5s on its own timer, the transition
// itself should be close to invisible, not a second thing competing for
// attention next to the text. A plain opacity crossfade does that.
const FADE_MS = 700;

// ---------------------------------------------------------------------------
// THE RAIL
// ---------------------------------------------------------------------------
// Three amenities as a vertical picker down the right of the frame.
//
// SELECTION MODEL — the list does NOT rotate. Order is fixed (Приватность,
// Территория, Спа) and the whole column slides so the ACTIVE item lands on
// the centre line. So selecting the first item pushes the other two down;
// selecting the last pulls them both up; selecting the middle sits them
// symmetrically. An earlier pass rotated cards through fixed slots instead,
// which kept the centre always occupied but reshuffled the reading order on
// every advance — wrong for a list whose order is part of its meaning.
//
// Offset `d` is simply (i - activeIndex), so it spans a 3-wide window of
// {-2..2}: at index 0 the others sit at +1/+2, at index 2 at -1/-2.
//
// MOTION — plain CSS transitions, not framer `animate`. Framer propagates a
// parent's variant LABEL to every descendant motion component, so a
// `motion.*` element in here has its own `animate={{ y }}` silently
// overwritten by an ancestor's variant (this section previously sat inside a
// <Reveal> whose `show` variant declares `y: 0`, and the rail rendered with
// `transform: none`). CSS transitions cannot be reached into from above.
const RAIL_EASE = `cubic-bezier(${EASE.join(',')})`;
const SPACING = 138;
const RING_R = 62;
const RING_C = 2 * Math.PI * RING_R;

// Sizes are bounded by the section's 640px min-height: the furthest item sits
// at 2 * 138 + half of 60 = 306 from the centre line, i.e. 612 total.
function slotFor(d) {
  const ad = Math.abs(d);
  return {
    size: ad === 0 ? 132 : ad === 1 ? 76 : 60,
    x: -36 * ad,
    y: d * SPACING,
    opacity: ad === 0 ? 1 : ad === 1 ? 0.72 : 0.45,
  };
}

// THE CONNECTING LINE — a single curve threading through all five possible
// circle positions (d = -2..2), so the picker reads as beads on a string
// rather than three unrelated floating circles. Computed from the same
// slotFor the buttons themselves use (circle-centre x = its slot's x minus
// half its own size, since the circle is the last, edge-flush element in
// each row — see the button markup below), so the line can never drift out
// of alignment with the actual circles even if the sizing/spacing constants
// above change. Built once at module scope: the geometry doesn't depend on
// which card is active, only on the fixed d-window.
const RAIL_CURVE_POINTS = [-2, -1, 0, 1, 2].map((d) => {
  const s = slotFor(d);
  return { x: s.x - s.size / 2, y: s.y };
});
const RAIL_CURVE_PATH = (() => {
  const [p0, p1, p2, p3, p4] = RAIL_CURVE_POINTS;
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const m1 = mid(p1, p2);
  const m2 = mid(p2, p3);
  return `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${m1.x} ${m1.y} Q ${p2.x} ${p2.y} ${m2.x} ${m2.y} Q ${p3.x} ${p3.y} ${p4.x} ${p4.y}`;
})();

function AmenityRail({ cards, index, progress, isRu, onSelect, reduce }) {
  return (
    <div
      className="relative hidden h-full w-[21rem] shrink-0 lg:block"
      role="tablist"
      aria-label={isRu ? 'Разделы удобств' : 'Amenity sections'}
    >
      {/* The string the circles sit on — drawn once, behind everything,
          spanning the full d=-2..2 window so it reads as a track the
          circles slide along rather than stopping short of the ones
          currently off-window. */}
      <svg
        className="pointer-events-none absolute right-0 top-1/2"
        style={{ width: 140, height: 612, marginTop: -306, overflow: 'visible' }}
        viewBox="-140 -306 140 612"
        aria-hidden
      >
        <path d={RAIL_CURVE_PATH} fill="none" stroke="rgba(245,243,238,0.22)" strokeWidth="1" />
      </svg>
      {/* Fixed selection-point tick — the one spot on the string that never
          moves; whichever circle is active always sits here. Positioned at
          the same d=0 point the curve itself passes through. */}
      <span
        className="pointer-events-none absolute top-1/2 h-px w-4 -mt-px bg-baden-on-dark/35"
        style={{ right: -RAIL_CURVE_POINTS[2].x - 8 }}
        aria-hidden
      />

      {cards.map((c, i) => {
        const d = i - index;
        const s = slotFor(d);
        const active = d === 0;
        return (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(i)}
            // Fixed row height (the largest circle) with a matching negative
            // top margin keeps the row's vertical centre pinned to top-1/2
            // while the circle inside it resizes, so the translate only ever
            // carries the slot offset.
            className="group absolute right-0 top-1/2 -mt-[66px] flex h-[132px] items-center justify-end gap-4 text-right"
            style={{
              transform: `translate(${s.x}px, ${s.y}px)`,
              transition: reduce ? 'none' : `transform 700ms ${RAIL_EASE}`,
            }}
          >
            {/* Index, name, THEN circle — the circle sits flush against the
                frame's own edge (matching the reference screenshots, where
                the photo circles anchor the edge and the caption sits
                inward of them), which is also what makes the connecting
                curve above mathematically exact: circle-centre x is simply
                this slot's x minus half the circle's size. */}
            <span
              className="w-6 shrink-0 text-left font-sans text-[10px] tabular-nums tracking-widest2"
              style={{
                opacity: active ? 1 : 0.5,
                transition: reduce ? 'none' : `opacity 500ms ${RAIL_EASE}`,
              }}
            >
              <span className={active ? 'text-baden-on-dark' : 'text-baden-on-dark/50'}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </span>

            <span
              className="whitespace-nowrap font-sans uppercase text-baden-on-dark drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              style={{
                opacity: s.opacity,
                fontSize: active ? '0.875rem' : '0.6875rem',
                letterSpacing: active ? '0.18em' : '0.25em',
                fontWeight: active ? 500 : 400,
                transition: reduce ? 'none' : `all 500ms ${RAIL_EASE}`,
              }}
            >
              {isRu ? c.ru.label : c.en.label}
            </span>

            <span
              className="relative shrink-0 overflow-hidden rounded-full shadow-[0_12px_34px_-8px_rgba(0,0,0,0.75)]"
              style={{
                width: s.size,
                height: s.size,
                opacity: active ? 1 : 0.78,
                transition: reduce ? 'none' : `width 700ms ${RAIL_EASE}, height 700ms ${RAIL_EASE}, opacity 500ms ${RAIL_EASE}`,
              }}
            >
              <img
                src={c.image}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: positionFor(c.image) }}
              />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-baden-line" aria-hidden />
              {/* Auto-advance clock, drawn as a ring around the active
                  thumbnail — the same rAF `progress` the old Stories-style
                  progress bars used, so that affordance survives the
                  redesign rather than being dropped with them. */}
              {active && !reduce && (
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128" aria-hidden>
                  <circle cx="64" cy="64" r={RING_R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                  <circle
                    cx="64"
                    cy="64"
                    r={RING_R}
                    fill="none"
                    stroke="currentColor"
                    className="text-baden-on-dark"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - progress)}
                  />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Below lg the panel is narrower than the arc needs, so the same three
// thumbnails sit in a plain row instead — active simply grows and names
// itself. Lives inside the solid side panel now (not floating on the
// photo), same as everything else in it.
function AmenityRailMobile({ cards, index, isRu, onSelect }) {
  return (
    <div
      className="mt-8 flex items-center gap-3 lg:hidden"
      role="tablist"
      aria-label={isRu ? 'Разделы удобств' : 'Amenity sections'}
    >
      {cards.map((c, i) => {
        const active = i === index;
        return (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(i)}
            className="flex items-center gap-2"
          >
            <span
              className={`block overflow-hidden rounded-full transition-all duration-500 ${
                active ? 'h-14 w-14 ring-2 ring-baden-on-dark/80' : 'h-10 w-10 opacity-70 ring-1 ring-baden-line'
              }`}
            >
              <img
                src={c.image}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: positionFor(c.image) }}
              />
            </span>
            {active && (
              <span className="font-sans text-[11px] uppercase tracking-widest2 text-baden-on-dark">
                {isRu ? c.ru.label : c.en.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function AmenityShowcase({ isRu }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  // Crossfade state. The outgoing photo (prevCard) stays mounted underneath,
  // static, at full opacity; the incoming one mounts on top of it already
  // running the `amenity-fade-in` keyframe animation (0% opacity -> 100%),
  // so there is no JS-timed "start invisible, then flip visible" step for
  // React's render/effect scheduling to race. prevCard just needs to unmount
  // once the fade has had time to finish covering it.
  const [prevCard, setPrevCard] = useState(null);
  const prevIndexRef = useRef(index);
  const fadeTimeoutRef = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;
    if (prevIndexRef.current === index) return undefined;
    const fromCard = CARDS[prevIndexRef.current];
    prevIndexRef.current = index;
    setPrevCard(fromCard);
    fadeTimeoutRef.current = setTimeout(() => setPrevCard(null), FADE_MS);
    return () => clearTimeout(fadeTimeoutRef.current);
  }, [index, reduce]);

  const goTo = useCallback((i) => {
    setIndex(i);
    setProgress(0);
  }, []);

  // A single rAF loop drives progress 0→1 over AUTO_MS; reaching 1 is what
  // advances the slide, so the ring and the switch are the same clock and
  // cannot drift apart. Paused on hover/focus, disabled under reduced motion.
  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return undefined;
    }
    if (paused) return undefined;
    startRef.current = performance.now() - progress * AUTO_MS;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / AUTO_MS);
      setProgress(p);
      if (p >= 1) {
        setIndex((i) => (i + 1) % CARDS.length);
        setProgress(0);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, reduce]);

  const card = CARDS[index];

  const goToProperties = (e) => {
    e.preventDefault();
    document.getElementById('properties')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* BACKGROUND IMAGE FILLING FULL SECTION */}
      <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
        {prevCard && (
          <img
            key={`prev-${prevCard.key}`}
            src={prevCard.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: positionFor(prevCard.image) }}
          />
        )}
        <img
          key={`cur-${card.key}`}
          src={card.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: positionFor(card.image),
            animation: reduce ? 'none' : `amenity-fade-in ${FADE_MS}ms ease-out, kenburns-slide 8s ease-out forwards`,
            willChange: reduce ? 'auto' : 'opacity, transform',
          }}
        />
        {/* Tint overlay for readability — directional, not a flat wash: the
            same photo reads darker under the text panel (left) and lighter
            toward the right edge, so the section carries two visibly
            different tones of its own background rather than one uniform
            black/45 over the whole frame. A faint warm wash on the right
            keeps that lighter half from just reading as "less tint". */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/35 to-black/10" aria-hidden />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-black/20" aria-hidden />
        <div className="absolute inset-0 z-[1] bg-gradient-to-l from-baden-brand/[0.08] via-transparent to-transparent" aria-hidden />
      </div>

      {/* FOREGROUND LAYOUT */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20 xl:px-28">
        {/* TINT + GLASS PANEL — a soft gradient sheen across the top edge
            (21st.dev-style glass highlight) instead of a flat hairline
            border, so the panel itself reads as glass catching light rather
            than a bordered box. */}
        <div className="relative w-full max-w-lg shrink-0 overflow-hidden rounded-panel border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-2xl sm:p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 30%)' }}
            aria-hidden
          />
          <div className="relative z-10">
            {/* Section index */}
            <div className="mb-4 flex items-center gap-3 text-baden-on-dark/45">
              <span className="font-sans text-[11px] tabular-nums tracking-widest2">02</span>
              <span className="h-px w-8 bg-baden-line" aria-hidden />
              <span className="text-[10px] uppercase tracking-widest2">{isRu ? 'На территории' : 'On the grounds'}</span>
            </div>

            <h2 className="max-w-md font-display text-lg font-light leading-snug text-baden-on-dark/85 md:text-xl">
              {isRu ? 'Резиденция, устроенная вокруг жизни' : 'A residence built around living'}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-baden-on-dark/60">
              {isRu
                ? 'Три составляющих ежедневной жизни на территории — от приватности до велнеса.'
                : 'Three parts of daily life on the grounds — from privacy to wellness.'}
            </p>

            {/* Changing block */}
            <div className="mt-8 border-l border-baden-on-dark/30 pl-5 md:pl-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <h3 className="font-display text-3xl leading-[1.1] text-baden-on-dark md:text-4xl">
                    {isRu ? card.ru.title : card.en.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm text-baden-on-dark/70 leading-relaxed md:text-base">
                    {isRu ? card.ru.copy : card.en.copy}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <a
              href="#properties"
              onClick={goToProperties}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-xs tracking-widest2 uppercase text-baden-on-dark transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              {isRu ? 'Смотреть резиденции' : 'View the residences'}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
            </a>
            <p className="mt-4 text-[11px] tracking-wide text-baden-on-dark/40">
              {isRu ? 'На примере Beyzade Resort, объекта портфеля Baden' : 'Shown at Beyzade Resort, a Baden portfolio property'}
            </p>

            <AmenityRailMobile cards={CARDS} index={index} isRu={isRu} onSelect={goTo} />
          </div>
        </div>

        {/* Floating index tag */}
        <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-sm border border-baden-line bg-black/45 px-3 py-1.5 backdrop-blur-sm md:left-8 md:top-8">
          <span className="font-sans text-[11px] tabular-nums tracking-widest2 text-baden-on-dark">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-3 w-px bg-baden-line" aria-hidden />
          <span className="font-sans text-[10px] uppercase tracking-widest2 text-baden-on-dark/70">
            {isRu ? card.ru.label : card.en.label}
          </span>
        </div>

        {/* Selector on the right */}
        <AmenityRail cards={CARDS} index={index} progress={progress} isRu={isRu} onSelect={goTo} reduce={reduce} />
      </div>
    </div>
  );
}

export default function Amenities() {
  const { isRu } = useLanguage();

  // Full-height: the section IS the showcase. svh rather than vh so a
  // mobile address bar showing/hiding doesn't reflow the frame mid-scroll —
  // same reasoning as the hero.
  return (
    <section id="amenities" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      <AmenityShowcase isRu={isRu} />
    </section>
  );
}
