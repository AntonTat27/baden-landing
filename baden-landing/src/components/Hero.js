import React, { useState } from 'react';
import heroImg from '../assets/images/hero.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

// SIGNATURE INTERACTION — Day/Dusk grade toggle.
// PLACEHOLDER APPROXIMATION: the client has not yet supplied a real dusk-lit
// render of the property. Until that exists, the "dusk" state is approximated
// with CSS filters (brightness/saturate/sepia) and a warm-dark overlay wash
// rather than a second photograph. Swap in a true dusk render when available
// and this component only needs its `duskAmount` mapping adjusted, not rebuilt.
//
// Both the filter grade AND the overlay are tuned to stay in the warm
// "golden hour" range across the whole 0–100 slider, not just at the dusk
// end — the source photo's blue sky gets pulled warm at every point.
export default function Hero() {
  const { isRu } = useLanguage();
  // 0 = day grade, 100 = dusk grade. Defaults to dusk to match the dark palette.
  const [dusk, setDusk] = useState(100);
  const t = dusk / 100;

  const imgFilter = {
    objectPosition: positionFor(heroImg),
    filter: `brightness(${1.08 - t * 0.48}) saturate(${0.92 - t * 0.22}) sepia(0.14) contrast(${1.02 + t * 0.08})`,
    transition: 'filter 700ms ease',
  };
  // Full-frame wash: present at meaningful opacity everywhere in the frame
  // (not bottom-weighted only), so sky/cool tones get color-corrected warm
  // across the whole image, at both ends of the day/dusk slider.
  const washOpacity = { opacity: 0.52 + t * 0.2, transition: 'opacity 700ms ease' };
  const bottomOpacity = { opacity: 0.55 + t * 0.25, transition: 'opacity 700ms ease' };

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-baden-base">
      <img
        src={heroImg}
        alt="Baden Premium Projects — exterior view"
        className="absolute inset-0 h-full w-full object-cover"
        style={imgFilter}
      />

      {/* Uniform warm wash covering the ENTIRE frame, top to bottom — this is
          the fix for the old bug where the wash faded to ~10% near the top
          and let raw blue sky show through where the crop bug exposed sky. */}
      <div className="absolute inset-0 bg-baden-base" style={washOpacity} aria-hidden />
      {/* Gold undertone across the whole frame for the golden-hour cast */}
      <div className="absolute inset-0 bg-baden-gold/10 mix-blend-multiply" aria-hidden />
      {/* Extra bottom-weighted darkening for text legibility, layered on top
          of (not instead of) the full-frame wash above */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-baden-base via-baden-base/35 to-transparent"
        style={bottomOpacity}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-10 pb-16 md:pb-24 max-w-7xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-baden-cream max-w-3xl">
          {isRu ? (
            <>
              Жизнь, которую стоит{' '}
              <span className="font-accent italic text-baden-gold-bright">разделить</span>
            </>
          ) : (
            <>
              A life worth <span className="font-accent italic text-baden-gold-bright">sharing</span>
            </>
          )}
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-baden-cream/70">
          {isRu
            ? 'Курортная резиденция в Турции — владейте моментом, а не только метрами.'
            : 'A resort residence in Turkey — own the moment, not just the square meters.'}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-8">
          <a
            href="#showcase"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-baden-cream w-fit"
          >
            <span className="border-b border-baden-gold pb-0.5 group-hover:text-baden-gold-bright group-hover:border-baden-gold-bright transition-colors duration-200">
              {isRu ? 'Смотреть резиденцию' : 'View the residence'}
            </span>
            <span aria-hidden className="text-baden-gold group-hover:text-baden-gold-bright transition-colors duration-200">
              ↓
            </span>
          </a>

          {/* Day / Dusk toggle */}
          <div className="flex items-center gap-3 w-full max-w-[220px] sm:max-w-[200px]">
            <span
              className={`text-xs tracking-widest transition-colors duration-300 ${
                t < 0.5 ? 'text-baden-gold-bright' : 'text-baden-muted'
              }`}
            >
              {isRu ? 'ДЕНЬ' : 'DAY'}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={dusk}
              onChange={(e) => setDusk(Number(e.target.value))}
              className="dusk-slider flex-1"
              aria-label={isRu ? 'Переключатель день/сумерки' : 'Day/dusk toggle'}
            />
            <span
              className={`text-xs tracking-widest transition-colors duration-300 ${
                t >= 0.5 ? 'text-baden-gold-bright' : 'text-baden-muted'
              }`}
            >
              {isRu ? 'СУМЕРКИ' : 'DUSK'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
