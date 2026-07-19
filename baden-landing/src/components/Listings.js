import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UNITS, minPrice, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

// Four Seasons "featured properties" pattern: one card fully visible and
// centered, neighbors partially visible and dimmed at the edges, with
// prev/next controls and a simple "01 / 05" slide counter — replaces the
// previous static asymmetric grid.
export default function Listings() {
  const { isRu } = useLanguage();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const total = UNITS.length;

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(total - 1, i));
    const card = track.children[clamped];
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (trackRect.left + trackRect.width / 2);
    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // rAF-throttled: the raw scroll event can fire far faster than the browser
  // can paint, and computing getBoundingClientRect() for every card on every
  // tick (a forced layout read) caused visible jank/hangs on this section.
  // Coalescing to at most once per animation frame keeps it smooth.
  const ticking = useRef(false);

  const computeActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive((prev) => (prev === closest ? prev : closest));
  }, []);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      computeActive();
      ticking.current = false;
    });
  }, [computeActive]);

  // Also recompute on mount/resize so the initial active card (and any
  // layout change from a font/image load) stays in sync.
  useEffect(() => {
    computeActive();
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => window.removeEventListener('resize', handleScroll);
  }, [computeActive, handleScroll]);

  return (
    <section id="listings" className="relative bg-baden-cream py-24 md:py-32">
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-panel to-transparent"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
              {isRu ? 'Выбор резиденций' : 'A curated selection'}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-baden-base">
              {isRu ? (
                <>Пять форматов <span className="font-accent italic text-baden-gold-bright">владения</span></>
              ) : (
                <>Five ways to <span className="font-accent italic text-baden-gold-bright">own</span></>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <p className="text-sm tracking-widest text-baden-base/50 font-display tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToIndex(active - 1)}
                disabled={active === 0}
                aria-label={isRu ? 'Предыдущая резиденция' : 'Previous residence'}
                className="text-sm tracking-widest uppercase text-baden-base border-b border-baden-base/30 pb-0.5 hover:border-baden-gold hover:text-baden-gold transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
              >
                {isRu ? 'Назад' : 'Prev'}
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(active + 1)}
                disabled={active === total - 1}
                aria-label={isRu ? 'Следующая резиденция' : 'Next residence'}
                className="text-sm tracking-widest uppercase text-baden-base border-b border-baden-base/30 pb-0.5 hover:border-baden-gold hover:text-baden-gold transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
              >
                {isRu ? 'Далее' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory px-[12vw] sm:px-[16vw] md:px-[20vw] lg:px-[24vw] pb-4"
      >
        {UNITS.map((unit, i) => {
          const isActive = i === active;
          return (
            <Link
              key={unit.id}
              to={`/residence/${unit.id}`}
              className={`group relative shrink-0 w-[76vw] sm:w-[64vw] md:w-[52vw] lg:w-[44vw] snap-center border border-baden-base/10 bg-baden-cream transition-all duration-500 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.94]'
              }`}
            >
              <div className="relative h-[280px] md:h-[360px] overflow-hidden">
                <img
                  src={unit.image}
                  alt={isRu ? unit.name.ru : unit.name.en}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    objectPosition: positionFor(unit.image),
                    filter: 'saturate(0.92) brightness(0.94) sepia(0.08)',
                  }}
                />
                <div className="absolute inset-0 bg-baden-base/10" aria-hidden />
                <p className="absolute top-4 left-4 md:top-6 md:left-6 text-xs tracking-widest2 uppercase text-baden-cream bg-baden-base/70 px-3 py-1.5">
                  {isRu ? unit.location.ru : unit.location.en}
                </p>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="font-display text-2xl md:text-3xl text-baden-base mb-1">
                  {isRu ? unit.name.ru : unit.name.en}
                </h3>
                <p className="text-sm text-baden-base/55 mb-6">
                  {unit.size} &middot; {unit.guests} {isRu ? 'гостей' : 'guests'}
                </p>

                <div className="flex items-end justify-between border-t border-baden-base/10 pt-5">
                  <div>
                    <p className="text-xs text-baden-base/50 mb-1">{isRu ? 'от' : 'from'}</p>
                    <p className="font-display text-2xl md:text-3xl text-baden-gold-bright">
                      {formatEUR(minPrice(unit))}
                      <span className="text-sm text-baden-base/50 font-sans">
                        {isRu ? ' / мес' : ' / mo'}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs tracking-widest2 uppercase text-baden-muted border border-baden-muted/40 px-3 py-1.5">
                    {isRu ? 'Дробное владение' : 'Fractional ownership'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
