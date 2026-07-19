import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNITS, minPrice, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

// Expanding-panels accordion: all five residences share one frame; hovering
// (desktop) or tapping (touch) a panel expands it and reveals its details,
// clicking the expanded panel opens the residence page. Replaces the previous
// center-snap carousel.
export default function Listings() {
  const { isRu } = useLanguage();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const handleClick = (i, unit) => {
    // touch flow: first tap expands, second tap navigates
    if (i === active) navigate(`/residence/${unit.id}`);
    else setActive(i);
  };

  return (
    <section id="listings" className="relative bg-baden-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
              {isRu ? 'Выбор резиденций' : 'A curated selection'}
            </p>
            <h2 className="font-display font-medium text-3xl md:text-5xl text-baden-base">
              {isRu ? 'Пять форматов владения' : 'Five ways to own'}
            </h2>
          </div>
          <p className="text-sm text-baden-base/50 max-w-xs md:text-right">
            {isRu
              ? 'Наведите на панель, чтобы раскрыть — нажмите, чтобы посмотреть резиденцию.'
              : 'Hover a panel to expand it — click through to view the residence.'}
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-2 h-[140vw] max-h-[720px] md:h-[70vh] md:max-h-[640px]">
          {UNITS.map((unit, i) => {
            const isActive = i === active;
            return (
              <div
                key={unit.id}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => handleClick(i, unit)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(i, unit);
                  }
                }}
                aria-label={isRu ? unit.name.ru : unit.name.en}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isActive ? 'flex-[4] md:flex-[3.2]' : 'flex-1'
                }`}
              >
                <img
                  src={unit.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  style={{ objectPosition: positionFor(unit.image) }}
                />
                {/* Neutral tint: heavier on collapsed panels so the active one reads lit */}
                <div
                  className={`absolute inset-0 transition-colors duration-700 ${
                    isActive ? 'bg-black/15' : 'bg-black/55'
                  }`}
                  aria-hidden
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden
                />

                {/* Collapsed label — horizontal on mobile, vertical on desktop */}
                <div
                  className={`absolute inset-0 flex items-center px-5 md:px-0 md:justify-center transition-opacity duration-500 ${
                    isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <p className="font-display text-sm tracking-widest uppercase text-baden-cream/85 md:[writing-mode:vertical-rl] md:rotate-180 flex items-center gap-3">
                    <span className="tabular-nums text-baden-cream/50">{String(i + 1).padStart(2, '0')}</span>
                    {isRu ? unit.name.ru : unit.name.en}
                  </p>
                </div>

                {/* Expanded details */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-6 md:p-8 transition-all duration-500 delay-200 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <p className="text-xs tracking-widest2 uppercase text-baden-cream/60 mb-2">
                    {isRu ? unit.location.ru : unit.location.en}
                  </p>
                  <h3 className="font-display font-medium text-2xl md:text-4xl text-baden-cream mb-2 whitespace-nowrap">
                    {isRu ? unit.name.ru : unit.name.en}
                  </h3>
                  <p className="text-sm text-baden-cream/65 mb-5">
                    {unit.size} &middot; {unit.guests} {isRu ? 'гостей' : 'guests'}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <p className="font-display text-xl md:text-2xl text-baden-gold-bright whitespace-nowrap">
                      {isRu ? 'от ' : 'from '}
                      {formatEUR(minPrice(unit))}
                      <span className="text-sm text-baden-cream/55 font-sans">{isRu ? ' / мес' : ' / mo'}</span>
                    </p>
                    <span className="hidden sm:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-cream border-b border-baden-cream/40 pb-0.5 group-hover:border-baden-cream transition-colors whitespace-nowrap">
                      {isRu ? 'Смотреть' : 'View'} <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
