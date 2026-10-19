import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
// PLACEHOLDER — client-supplied reference photo (Cinque Terre sunset), not
// on-brand for the Turkish Riviera coast. Swap for the real property/coast
// photography before go-live.
import heroPoster from '../assets/posters/hero-placeholder.jpg';
import { useLanguage } from '../context/LanguageContext';
import { UNITS, formatEUR } from '../data/units';
import { EASE, stagger } from './motion';

// Slow, warm light drifting across the backdrop — soft blurred glows in
// amber/terracotta, not geometric shapes. Reads as sun and atmosphere rather
// than a tech/WebGL effect. Skipped under prefers-reduced-motion.
//
// PERF: this used to be three 300-420px discs at blur-[90px], each on its own
// infinite 22-34s transform loop. Three permanently-animating large blurred
// layers over a full-viewport photo is the most expensive thing on the page —
// each one forces a re-composite of a surface grown by the blur radius on
// every side, forever, whether or not the hero is even on screen. Cut to two
// discs at blur-[56px]: blur radius past roughly 60px is visually
// indistinguishable here (the disc is already a formless wash at that point)
// but costs strictly more, and the third glow sat behind the headline where
// the legibility wash swallowed it anyway.
//
// will-change:transform is set explicitly *only* on these two, because they
// genuinely animate transform forever and so genuinely benefit from their own
// layer. It is deliberately NOT applied to the blurred discs in other
// sections, which are static — there, promoting a layer costs memory and
// buys nothing.
function AmbientLight({ reduce }) {
  if (reduce) return null;
  const glows = [
    // Warm amber only — reads as sunlight on the actual photograph.
    { size: 420, top: '10%', left: '66%', color: 'rgba(224,179,104,0.14)', duration: 24 },
    { size: 380, top: '52%', left: '10%', color: 'rgba(224,179,104,0.10)', duration: 30 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {glows.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[56px]"
          style={{ width: g.size, height: g.size, top: g.top, left: g.left, background: g.color, willChange: 'transform' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: g.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ENTRANCE TIMING
// ---------------------------------------------------------------------------
// The entrance used to run eyebrow 0.3s → headline 0.45s + 0.14 stagger →
// subhead 0.9s → stats 1.0s → CTAs 1.15s → scroll cue 1.4s. For roughly the
// first second and a half the largest element on screen — the LCP element —
// was a photograph with no message on it at all, which is exactly the window
// in which a visitor decides whether this page is about anything.
//
// The whole chain now completes inside ~0.6s. The staggered feel is kept (the
// order and the relative gaps are unchanged, just compressed), and individual
// durations come down with the delays so nothing is still visibly sliding
// after the last item has started.
const STEP = {
  eyebrow: 0.05,
  headline: 0.1,
  subhead: 0.28,
  facts: 0.36,
  ctas: 0.48,
};

// Split per-property: opacity tweens on a duration (springs on opacity
// over/undershoot past 0/1 and visibly flicker), position rises on a real
// spring — mass, stiffness, damping instead of a cubic-bezier — so every
// block settles with a faint, physical overshoot rather than easing to a
// dead stop.
const RISE_SPRING = { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 };
const enter = (delay) => ({ delay, opacity: { duration: 0.4, ease: EASE }, y: RISE_SPRING });

// Local copy of the shared `lineReveal` at hero speed, now spring-driven
// (position only, so no opacity-overshoot risk) for the one line that has to
// land immediately and needs to feel weighted rather than merely eased.
const heroLine = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { type: 'spring', stiffness: 220, damping: 24, mass: 0.9 } },
};

export default function Hero({ parallaxRef }) {
  const { isRu } = useLanguage();
  const reduce = useReducedMotion();

  // SCROLL-TIED PARALLAX
  // ---------------------------------------------------------------------------
  // The photo drifts and slowly zooms at a different rate than the copy as a
  // visitor scrolls — real depth separation, not just a fade. Driven by
  // framer-motion's scroll progress (JS-timed, not CSS
  // `animation-timeline: scroll()`) specifically because that CSS feature has
  // no Firefox support today; this reads identically everywhere and degrades
  // to a static frame under reduced motion.
  //
  // The tracked TARGET is `parallaxRef` — a ref PremiumHome.js puts on a
  // wrapper around Hero+Statement together, not Hero's own <section> — so
  // progress reaches 1 only once that wrapper's bottom (= Statement's bottom
  // = Amenities' top) hits the viewport top, i.e. exactly when Amenities
  // begins fully occupying the screen. useTransform clamps its output at the
  // range ends by default, so the drift/zoom simply holds still from that
  // point on rather than continuing underneath Amenities where it could
  // never be seen anyway.
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Short, upright headline. The accent word is set apart by weight in the
  // same family, not by a second colour: the brand accent now means "this is
  // interactive", and a headline is not. Weight alone carries it.
  const titleLines = isRu
    ? [<>Недвижимость</>, <span className="font-medium">на побережье</span>]
    : [<>Real estate</>, <span className="font-medium">on the coast</span>];

  // One combined strip instead of several small bits: the two figures a
  // visitor checks the headline's promise against, plus the portfolio size,
  // read as a single line rather than boxed into separate cards.
  const facts = [
    { label: isRu ? 'Вход от' : 'Entry from', value: formatEUR(Math.min(...UNITS.map((u) => u.entryFrom))) },
    { label: isRu ? 'Минимальный срок' : 'Minimum term', value: isRu ? '1 неделя' : '1 week' },
    { label: isRu ? 'Резиденций' : 'Residences', value: String(UNITS.length) },
  ];

  return (
    // min-h rather than a fixed height so the hero can never clip its own copy
    // on a short viewport, and `flex flex-col` on the section so the content
    // wrapper below can use flex-1 to claim the remaining space. The wrapper
    // previously used h-full, which resolves against a fixed height and
    // collapses to zero against a min-height, dropping the copy to the top of
    // the frame and under the fixed nav.
    // svh, not dvh, deliberately: dvh changes as the mobile address bar shows
    // and hides, reflowing the whole hero mid-scroll. svh is the stable one.
    <section id="top" className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-baden-dark">
      {/* PLACEHOLDER photo — see import comment above. Framing/filter here
          is tuned for this specific image and will need revisiting once
          the real photo is in. The scroll-parallax transform lives on this
          wrapper, not the img itself, so it can't collide with the img's own
          `kenburns` CSS animation — both would otherwise fight over the same
          `transform` property on one element. */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imgY, scale: imgScale, willChange: 'transform' }}
      >
        <img
          src={heroPoster}
          alt=""
          className="h-full w-full object-cover"
          style={{
            objectPosition: 'center 40%',
            animation: reduce ? 'none' : 'kenburns 34s ease-in-out infinite alternate',
            filter: 'saturate(1.05) contrast(1.03) brightness(0.98)',
          }}
          aria-hidden
        />
      </motion.div>

      {/* Grading + legibility wash. A firm top-to-bottom tint keyed to the
          page's own ground colour. Darkened a step further at both ends
          from the first pass — the top now carries real weight instead of
          fading to near-nothing, which is what makes the frame read as
          graded rather than a photo with a sticker of text on it. Still
          lightest through the mid-sky band, which stays open as negative
          space. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #0B1220 0%, rgba(11,18,32,0.9) 14%, rgba(11,18,32,0.55) 30%, rgba(11,18,32,0.34) 48%, rgba(11,18,32,0.62) 100%)',
        }}
        aria-hidden
      />
      {/* LOCAL legibility wash for the text column — a strong, masked dark
          band behind the copy itself for contrast right where the headline
          sits, with a long, gradual horizontal falloff (rather than the
          previous hard cutoff) so the right half of the frame still gets a
          soft grade instead of sitting flat and untouched. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[72%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(11,18,32,0.97) 0%, rgba(11,18,32,0.9) 26%, rgba(11,18,32,0.66) 52%, rgba(11,18,32,0.3) 78%, rgba(11,18,32,0) 100%)',
          maskImage:
            'linear-gradient(to right, #000 0%, #000 34%, rgba(0,0,0,0.62) 54%, rgba(0,0,0,0.32) 72%, rgba(0,0,0,0.12) 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, #000 0%, #000 34%, rgba(0,0,0,0.62) 54%, rgba(0,0,0,0.32) 72%, rgba(0,0,0,0.12) 88%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* Subtle full-frame vignette — corners a touch darker than the
          centre, the difference between a photo and a graded shot. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(120% 100% at 50% 32%, transparent 52%, rgba(5,10,14,0.4) 100%)',
        }}
        aria-hidden
      />

      {/* Soft, wide fade at the very bottom edge — the seam into the next
          section. Taller and gentler than a hard cut so the transition
          feels like one surface dissolving rather than a panel ending. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 md:h-56 pointer-events-none bg-gradient-to-t from-baden-dark to-transparent"
        aria-hidden
      />

      <AmbientLight reduce={reduce} />


      {/* Foreground content — rides its own, faster/opposite scroll-tied
          transform (contentY/contentOpacity) so it separates from the photo
          layer behind it as the visitor scrolls, instead of the two moving
          as one flat plane. */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-1 flex-col justify-end w-full max-w-8xl mx-auto px-6 md:px-10 pt-28 pb-8 md:pb-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(STEP.eyebrow)}
          className="text-xs md:text-sm tracking-widest3 uppercase text-baden-brand-bright mb-5"
        >
          {isRu ? 'Турецкая Ривьера' : 'Turkish Riviera'}
        </motion.p>

        <motion.h1
          variants={stagger(0.08, STEP.headline)}
          initial="hidden"
          animate="show"
          // Back up near the original scale: a headline this size is what
          // reads as a statement rather than a caption against a full-bleed
          // frame that now has real brightness and open sky behind it.
          className="font-display font-light text-[11vw] leading-[0.98] sm:text-6xl md:text-7xl lg:text-8xl text-baden-on-dark max-w-3xl tracking-[-0.02em]"
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={heroLine} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(STEP.subhead)}
          className="mt-6 max-w-sm text-base md:text-lg text-baden-on-dark/80 leading-relaxed"
        >
          {isRu
            ? 'Гибкие форматы владения — для жизни, отдыха и инвестиций.'
            : 'Flexible ownership formats — for living, leisure, and investment.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(STEP.ctas)}
          className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          {/* One accent, never a fill: a bronze-outlined ghost button. The
              tint on hover is a wash, not a solid — bronze marks
              interaction, it never becomes a coloured shape. The secondary
              stays a plain text link, so there is still exactly one clear
              primary in the pair. */}
          <a
            href="#properties"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('properties')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }}
            className="group inline-flex items-center gap-3 text-xs md:text-sm tracking-widest2 uppercase text-baden-brand-bright border border-baden-brand/50 px-8 py-4 rounded-full hover:bg-baden-brand/10 hover:border-baden-brand transition-colors duration-300"
          >
            {isRu ? 'Смотреть резиденции' : 'View the residences'}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-baden-on-dark/90"
          >
            <span className="relative pb-1">
              {isRu ? 'Как устроено владение' : 'How ownership works'}
              <span className="absolute left-0 bottom-0 h-px w-full bg-baden-on-dark/30" />
              <span className="absolute left-0 bottom-0 h-px w-full bg-baden-on-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </span>
          </a>
        </motion.div>

        {/* One trust strip, not several small bits — a single hairline-
            topped row the two reference figures share, read left to right
            like a single sentence rather than boxed into separate cards. */}
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(STEP.facts)}
          className="mt-12 md:mt-16 pt-6 border-t border-baden-line flex flex-wrap items-baseline gap-x-10 gap-y-3 max-w-2xl"
        >
          {facts.map((f) => (
            <div key={f.label} className="flex items-baseline gap-2.5">
              <dd className="font-display font-light text-xl md:text-2xl text-baden-on-dark tabular-nums leading-none">
                {f.value}
              </dd>
              <dt className="text-[11px] tracking-widest2 uppercase text-baden-on-dark/55">{f.label}</dt>
            </div>
          ))}
        </motion.dl>
      </motion.div>

    </section>
  );
}
