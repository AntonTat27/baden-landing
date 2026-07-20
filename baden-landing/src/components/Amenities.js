import React, { useEffect, useRef, useState } from 'react';
import poolImg from '../assets/images/showcase-pool.jpg';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import estateVideo from '../assets/videos/candidate_B_dusk_pass.mp4';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

const ROTATE_MS = 6000;

// First item is the property fly-over itself (the video that drives the intro);
// the rest are the on-site amenities, shown as stills inside the same window.
const AMENITIES = [
  {
    key: 'overview',
    image: null,
    ru: {
      label: 'Резиденция',
      title: 'Курортная резиденция',
      copy: 'Вся территория с высоты — архитектура, вписанная в склон над морем.',
    },
    en: {
      label: 'The residence',
      title: 'A resort residence',
      copy: 'The whole estate from above — architecture folded into the hillside above the sea.',
    },
  },
  {
    key: 'pool',
    image: poolImg,
    ru: { label: 'Пляж и бассейн', title: 'Пляж и бассейн', copy: 'Тень парусных навесов и вода — в двух шагах от двери.' },
    en: { label: 'Beach & pool', title: 'Beach & pool', copy: 'Sail-shaped shade and water, two steps from your door.' },
  },
  {
    key: 'grounds',
    image: groundsImg,
    ru: { label: 'Территория', title: 'Территория', copy: 'Пальмы, тихие дорожки и пространство между домами.' },
    en: { label: 'Grounds', title: 'Grounds', copy: 'Palms, quiet paths, and room to breathe between residences.' },
  },
  {
    key: 'interiors',
    image: null,
    ru: { label: 'Интерьеры', title: 'Интерьеры', copy: 'Светлые, спокойные пространства — детали доступны при знакомстве с резиденцией.' },
    en: { label: 'Interiors', title: 'Interiors', copy: 'Bright, calm interiors — details shared once you get to know the residence.' },
  },
  {
    key: 'concierge',
    image: conciergeImg,
    ru: { label: 'Консьерж', title: 'Консьерж и сервис', copy: 'От трансфера до уборки — резиденция заботится о деталях.' },
    en: { label: 'Concierge', title: 'Concierge & service', copy: 'From transfers to housekeeping, the residence handles the details.' },
  },
];

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export default function Amenities() {
  const { isRu } = useLanguage();
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [active, setActive] = useState(0);
  const [assembled, setAssembled] = useState(reduced);
  const [paused, setPaused] = useState(false);

  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const bgRef = useRef(null);
  const winRef = useRef(null);
  const frozenRef = useRef(false);
  const assembledRef = useRef(reduced);

  const current = AMENITIES[active];

  // Auto-advance through the amenities once the window is assembled, exactly
  // like the hero — the underline/counter follow the active item. Paused on
  // hover/focus and while the section is mid-choreography.
  useEffect(() => {
    if (reduced || !assembled || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % AMENITIES.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [reduced, assembled, paused, active]);

  // Scroll choreography. A single rAF loop writes progress-derived CSS custom
  // properties onto the sticky stage; children map those vars to opacity /
  // transform via calc(), so nothing re-renders on scroll (mirrors Hero).
  //   --par  0→1  intro parallax + heading settle
  //   --mono 0→1  backdrop desaturates & dims, colour survives in the window
  //   --rev  0→1  amenity copy + selector reveal
  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let raf = 0;
    const set = (n, v) => stage.style.setProperty(n, v);

    const freeze = () => {
      const b = bgRef.current;
      const w = winRef.current;
      if (!b || !w) return;
      try {
        b.pause();
        w.currentTime = b.currentTime; // lock the colour still to the frozen plate
        w.pause();
      } catch (e) {
        /* seeking before metadata — ignored, next frame retries */
      }
    };
    const thaw = () => {
      const b = bgRef.current;
      if (b) b.play().catch(() => {});
    };

    const update = () => {
      raf = 0;
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp(-wrap.getBoundingClientRect().top / total, 0, 1) : 0;

      set('--par', clamp(p / 0.42, 0, 1).toFixed(4));
      set('--mono', clamp((p - 0.42) / 0.18, 0, 1).toFixed(4));
      set('--rev', clamp((p - 0.6) / 0.22, 0, 1).toFixed(4));

      // Freeze both videos on their shared frame the instant colour starts to
      // drain from the backdrop, so the window keeps that exact "nice picture".
      const shouldFreeze = p > 0.42;
      if (shouldFreeze && !frozenRef.current) {
        frozenRef.current = true;
        freeze();
      } else if (!shouldFreeze && frozenRef.current) {
        frozenRef.current = false;
        thaw();
      }

      const asm = p >= 0.8;
      if (asm !== assembledRef.current) {
        assembledRef.current = asm;
        setAssembled(asm);
        // Scrubbing back out of the assembled state resets to the overview so
        // the intro shows an empty outline over the video, never a still image.
        if (!asm) setActive(0);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const eyebrow = isRu ? 'На территории' : 'On the property';

  // Shared inner content — the video/still window, the amenity copy, and the
  // selectable list. Rendered inside a sticky stage (motion) or a plain
  // full-height stage (reduced motion); the CSS vars differ, the markup doesn't.
  const stageVars = reduced ? { '--par': 1, '--mono': 1, '--rev': 1 } : { '--par': 0, '--mono': 0, '--rev': 0 };

  return (
    <section id="amenities" ref={wrapRef} className="relative bg-baden-base" style={reduced ? undefined : { height: '320vh' }}>
      <div
        ref={stageRef}
        className="sticky top-0 h-screen min-h-[600px] w-full overflow-hidden"
        style={stageVars}
      >
        {/* Full-bleed backdrop fly-over — parallax drift during the intro, then
            desaturates and dims as colour retreats into the window. */}
        <div
          className="absolute inset-0"
          style={{
            transform: 'translate3d(0, calc((var(--par) - 0.5) * 9vh), 0) scale(1.12)',
          }}
        >
          <video
            ref={bgRef}
            src={estateVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{
              filter: 'grayscale(var(--mono)) brightness(calc(1 - var(--mono) * 0.55)) contrast(calc(1 + var(--mono) * 0.05))',
            }}
          />
        </div>

        {/* Legibility wash — deepens as the copy and selector arrive. */}
        <div
          className="absolute inset-0 bg-black"
          aria-hidden
          style={{ opacity: 'calc(var(--mono) * 0.35 + var(--rev) * 0.4)' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
          aria-hidden
          style={{ opacity: 'var(--rev)' }}
        />

        {/* Section heading — settles in with the intro, holds through. */}
        <div
          className="absolute top-8 left-6 md:top-12 md:left-12 z-20 max-w-md"
          style={{
            opacity: 'clamp(0, calc(var(--par) * 2), 1)',
            transform: 'translate3d(0, calc((1 - var(--par)) * 16px), 0)',
          }}
        >
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-3">{eyebrow}</p>
          <h2 className="font-display font-medium text-2xl md:text-4xl text-baden-cream leading-tight">
            {isRu ? (
              <>
                Резиденция, устроенная вокруг{' '}
                <span className="font-accent italic text-baden-gold-bright">жизни</span>
              </>
            ) : (
              <>
                A residence built around <span className="font-accent italic text-baden-gold-bright">living</span>
              </>
            )}
          </h2>
        </div>

        {/* Centered row: copy · window · selector. */}
        <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14 px-6 md:px-16 pt-28 pb-10 md:py-0">
          {/* Amenity copy — reveals after the collapse, swaps per selection. */}
          <div
            className="order-2 md:order-1 w-full md:w-72 text-center md:text-right"
            style={{
              opacity: 'var(--rev)',
              transform: 'translate3d(0, calc((1 - var(--rev)) * 24px), 0)',
            }}
          >
            <p className="text-xs tracking-widest2 uppercase text-baden-cream/50 mb-3">
              {isRu ? 'Удобства' : 'Amenities'}
            </p>
            <h3
              key={`t-${current.key}`}
              className="font-display font-medium text-2xl md:text-3xl text-baden-cream mb-4 animate-[fadein_0.4s_ease]"
            >
              {isRu ? current.ru.title : current.en.title}
            </h3>
            <p
              key={`c-${current.key}`}
              className="text-sm md:text-base text-baden-cream/70 leading-relaxed md:ml-auto max-w-xs mx-auto md:mx-0 animate-[fadein_0.5s_ease]"
            >
              {isRu ? current.ru.copy : current.en.copy}
            </p>
          </div>

          {/* The window: portrait rounded rectangle. Outline is visible from the
              first frame (the "empty" rectangle); the colour video/still fades
              in as the backdrop goes monochrome; amenity images crossfade on top. */}
          <div className="order-1 md:order-2 relative shrink-0 h-[52vh] w-[28.4vh] md:h-[66vh] md:w-[36vh] max-h-[560px]">
            <div
              className="absolute inset-0 rounded-[1.75rem] border border-baden-cream/40 z-20 pointer-events-none"
              aria-hidden
              style={{ boxShadow: '0 30px 80px -30px rgba(0,0,0,0.7)' }}
            />
            <div className="absolute inset-0 rounded-[1.75rem] overflow-hidden">
              {/* Colour survivor: same footage as the backdrop, frozen on the
                  identical frame at collapse so there is no seam. */}
              <video
                ref={winRef}
                src={estateVideo}
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: 'var(--mono)' }}
              />
              {AMENITIES.map((a, i) =>
                a.image ? (
                  <img
                    key={a.key}
                    src={a.image}
                    alt={isRu ? a.ru.label : a.en.label}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                    style={{ objectPosition: positionFor(a.image), opacity: assembled && i === active ? 1 : 0 }}
                    aria-hidden={i !== active}
                  />
                ) : i === 0 ? null : (
                  <div
                    key={a.key}
                    className="absolute inset-0 bg-baden-panel flex items-center justify-center transition-opacity duration-700 ease-out"
                    style={{ opacity: assembled && i === active ? 1 : 0 }}
                    aria-hidden={i !== active}
                  >
                    <p className="font-display text-2xl font-semibold text-baden-cream/10 select-none px-4 text-center leading-tight">
                      {isRu ? a.ru.title : a.en.title}
                    </p>
                  </div>
                )
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
              <p className="absolute bottom-4 right-5 font-display text-xs text-baden-cream/70 tabular-nums z-10">
                {String(active + 1).padStart(2, '0')} / {String(AMENITIES.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Selector — the hero's right-side list. */}
          <nav
            className="order-3 w-full md:w-52 flex flex-row md:flex-col flex-wrap justify-center md:items-start gap-x-5 gap-y-3"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              opacity: 'clamp(0, calc((var(--rev) - 0.15) * 1.6), 1)',
              transform: 'translate3d(0, calc((1 - var(--rev)) * 24px), 0)',
              pointerEvents: assembled ? 'auto' : 'none',
            }}
          >
            {AMENITIES.map((a, i) => (
              <button
                key={a.key}
                type="button"
                onClick={() => setActive(i)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                className={`group flex items-center gap-3 text-xs tracking-widest uppercase transition-colors duration-300 ${
                  i === active ? 'text-baden-cream' : 'text-baden-cream/40 hover:text-baden-cream/70'
                }`}
              >
                <span className="tabular-nums text-[10px] text-baden-cream/40">{String(i + 1).padStart(2, '0')}</span>
                <span>{isRu ? a.ru.label : a.en.label}</span>
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

        {/* Intro scroll cue — fades out as the parallax gives way to the collapse. */}
        {!reduced && (
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
            style={{ opacity: 'clamp(0, calc(1 - var(--par) * 1.4), 1)' }}
          >
            <span className="text-[10px] tracking-widest2 text-baden-cream/50">{isRu ? 'ВНИЗ' : 'SCROLL'}</span>
            <span className="relative h-10 w-px overflow-hidden bg-baden-cream/20">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-baden-cream/70 animate-[scrollcue_1.8s_ease-in-out_infinite]" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
