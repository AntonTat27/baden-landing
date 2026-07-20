import React, { useEffect, useRef, useState } from 'react';
import heroImg from '../assets/images/hero.jpg';
import poolImg from '../assets/images/showcase-pool.jpg';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

const ROTATE_MS = 7000;

// Hero doubles as the residence showcase: the backdrop slowly rotates through
// the property themes while the brand headline stays fixed. The former
// standalone Showcase section is gone — this removes the awkward full-image →
// full-image scroll and shortens the page.
const SLIDES = [
  {
    key: 'overview',
    image: heroImg,
    ru: { label: 'Резиденция', line: null },
    en: { label: 'The residence', line: null },
  },
  {
    key: 'pool',
    image: poolImg,
    ru: { label: 'Пляж и бассейн', line: 'Тень парусных навесов и вода — в двух шагах от двери.' },
    en: { label: 'Beach & pool', line: 'Sail-shaped shade and water, two steps from your door.' },
  },
  {
    key: 'grounds',
    image: groundsImg,
    ru: { label: 'Территория', line: 'Пальмы, тихие дорожки и пространство между домами.' },
    en: { label: 'Grounds', line: 'Palms, quiet paths, and room to breathe between residences.' },
  },
  {
    key: 'concierge',
    image: conciergeImg,
    ru: { label: 'Сервис', line: 'От трансфера до уборки — резиденция заботится о деталях.' },
    en: { label: 'Service', line: 'From transfers to housekeeping, the residence handles the details.' },
  },
];

// Corner frame mark — a thin editorial bracket, no fill, no color.
function CornerMark({ className }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      className={`absolute h-6 w-6 md:h-8 md:w-8 text-baden-cream/40 ${className}`}
    >
      <path d="M1 12V1H12" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function Hero() {
  const { isRu } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[active];

  // Scroll-linked exit + parallax refs — mutated directly inside rAF so the
  // component never re-renders on scroll.
  const bgRef = useRef(null);
  const dimRef = useRef(null);
  const fgRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % SLIDES.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  // Cinematic "leaving the establishing shot": as the hero scrolls out, the
  // backdrop lags behind (parallax) and dims while the headline block scales
  // down slightly and fades. Transform/opacity only; rAF-throttled; layout is
  // read once per frame (window.scrollY / innerHeight, no gBCR).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let vh = window.innerHeight || 1;
    const onResize = () => {
      vh = window.innerHeight || 1;
    };
    const update = () => {
      raf = 0;
      // Past one viewport the hero is fully offscreen — clamp so styles settle.
      const y = Math.min(window.scrollY, vh * 1.1);
      const p = Math.min(y / (vh * 0.9), 1);
      if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)`;
      if (dimRef.current) dimRef.current.style.opacity = (p * 0.7).toFixed(3);
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(0, ${(y * -0.06).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(4)})`;
        fgRef.current.style.opacity = Math.max(1 - p * 1.25, 0).toFixed(3);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-baden-base">
      {/* Parallax layer: bleeds above the section top so the slower-moving
          backdrop never reveals a gap while the top edge is on screen */}
      <div
        ref={bgRef}
        className="absolute inset-x-0"
        style={{ top: '-12%', height: '112%' }}
      >
        {/* Crossfading backdrops, each with a slow Ken Burns drift —
            direction alternates per slide, phases offset via negative delay */}
        {SLIDES.map((s, i) => (
          <img
            key={s.key}
            src={s.image}
            alt={i === 0 ? 'Baden Premium Projects — exterior view' : ''}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
            style={{
              objectPosition: positionFor(s.image),
              opacity: i === active ? 1 : 0,
              animation: `kenburns ${24 + i * 3}s ease-in-out ${-i * 7}s infinite ${
                i % 2 ? 'alternate-reverse' : 'alternate'
              }`,
            }}
            aria-hidden={i !== active}
          />
        ))}
      </div>

      {/* Flat neutral dark tint — no color grading, just legibility contrast */}
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25"
        aria-hidden
      />
      {/* Scroll-linked dim — opacity driven from the rAF handler */}
      <div ref={dimRef} className="absolute inset-0 bg-black opacity-0" aria-hidden />

      {/* Corner marks — purely structural framing, no copy */}
      <CornerMark className="top-6 left-6 md:top-8 md:left-8" />
      <CornerMark className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
      <CornerMark className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />
      <CornerMark className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />

      <div
        ref={fgRef}
        className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-28 md:pb-36 text-center"
      >
        <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-baden-cream max-w-3xl">
          {isRu ? 'Жизнь, которую стоит разделить' : 'A life worth sharing'}
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-baden-cream/70">
          {isRu
            ? 'Курортная резиденция в Турции — владейте моментом, а не только метрами.'
            : 'A resort residence in Turkey — own the moment, not just the square meters.'}
        </p>

        <a
          href="#listings"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group mt-10 inline-flex items-center gap-2 text-sm tracking-wide text-baden-cream w-fit"
        >
          <span className="relative pb-0.5">
            {isRu ? 'Смотреть варианты' : 'View the residences'}
            {/* Static baseline + hover draw-in on top */}
            <span className="absolute left-0 bottom-0 h-px w-full bg-baden-cream/40" aria-hidden />
            <span
              className="absolute left-0 bottom-0 h-px w-full bg-baden-cream origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
              aria-hidden
            />
          </span>
        </a>
      </div>

      {/* Slide index — bottom-right on desktop; theme caption fades in above it */}
      <div
        className="absolute z-10 bottom-24 right-8 md:right-10 hidden md:flex flex-col items-end gap-5 max-w-xs text-right"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slide[isRu ? 'ru' : 'en'].line && (
          <p key={slide.key} className="text-sm text-baden-cream/65 animate-[fadein_600ms_ease_both]">
            {slide[isRu ? 'ru' : 'en'].line}
          </p>
        )}
        <nav className="flex flex-col items-end gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              className={`group flex items-center gap-3 text-xs tracking-widest uppercase transition-colors duration-300 ${
                i === active ? 'text-baden-cream' : 'text-baden-cream/40 hover:text-baden-cream/70'
              }`}
            >
              <span>{isRu ? s.ru.label : s.en.label}</span>
              <span
                className={`h-px transition-all duration-300 ${
                  i === active ? 'w-8 bg-baden-gold-bright' : 'w-4 bg-baden-cream/30 group-hover:bg-baden-cream/60'
                }`}
                aria-hidden
              />
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile slide dots */}
      <div className="absolute z-10 bottom-8 right-6 flex gap-2 md:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(i)}
            aria-label={isRu ? s.ru.label : s.en.label}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-baden-gold-bright' : 'w-1.5 bg-baden-cream/40'
            }`}
          />
        ))}
      </div>

      {/* Scroll cue — minimal, structural, no brand copy */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-widest2 text-baden-cream/50">
          {isRu ? 'ВНИЗ' : 'SCROLL'}
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-baden-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-baden-cream/70 animate-[scrollcue_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
