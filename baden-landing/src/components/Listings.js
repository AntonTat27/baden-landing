import React from 'react';
import { Link } from 'react-router-dom';
import { UNITS, minPrice, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

// At-a-glance seasonal price read: 12 bars scaled to the unit's own min/max.
// Not a duplicate of the ResidenceDetail calculator (which gives an exact
// monthly figure) — this is just "price swings a lot / a little by season".
function SeasonBars({ prices }) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[3px] h-8" aria-hidden>
      {prices.map((p, i) => (
        <span
          key={i}
          className="w-1.5 bg-baden-gold/60 rounded-sm"
          style={{ height: `${8 + ((p - min) / range) * 24}px` }}
        />
      ))}
    </div>
  );
}

// Editorial row list: every unit is fully visible with size, guest count,
// seasonal price shape, and blurb all shown at once (no hover-to-reveal),
// alternating image side left/right. Replaces the previous accordion, which
// hid all of this behind interaction — that pattern now lives in Amenities.
// The final unit (the flagship) breaks the row template entirely: same data,
// a full-bleed feature card instead, so the tier hierarchy reads visually,
// not just in the price column.
export default function Listings() {
  const { isRu } = useLanguage();
  const standardUnits = UNITS.slice(0, -1);
  const flagship = UNITS[UNITS.length - 1];
  const flagshipIndex = UNITS.length - 1;

  return (
    <section id="listings" className="relative bg-baden-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'Выбор резиденций' : 'A curated selection'}
          </p>
          <h2 className="font-display font-medium text-3xl md:text-5xl text-baden-base">
            {isRu ? 'Пять форматов владения' : 'Five ways to own'}
          </h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-baden-base/10 border-t border-b border-baden-base/10">
          {standardUnits.map((unit, i) => (
            <Reveal key={unit.id} delay={Math.min(i * 60, 240)}>
              <Link
                to={`/residence/${unit.id}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center py-10 md:py-14"
              >
                <div
                  className={`md:col-span-5 relative h-56 md:h-80 overflow-hidden ${
                    i % 2 ? 'md:order-2' : ''
                  }`}
                >
                  <img
                    src={unit.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: positionFor(unit.image) }}
                  />
                </div>

                <div className="md:col-span-7">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-sm tabular-nums text-baden-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs tracking-widest2 uppercase text-baden-base/50">
                      {isRu ? unit.location.ru : unit.location.en}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-2xl md:text-4xl text-baden-base mb-3">
                    {isRu ? unit.name.ru : unit.name.en}
                  </h3>

                  <p className="text-sm md:text-base text-baden-base/60 max-w-lg mb-7">
                    {isRu ? unit.blurb.ru : unit.blurb.en}
                  </p>

                  <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
                    <div>
                      <p className="text-xs text-baden-base/45 mb-1.5">{isRu ? 'Площадь' : 'Size'}</p>
                      <p className="text-sm text-baden-base">{unit.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-baden-base/45 mb-1.5">{isRu ? 'Гости' : 'Guests'}</p>
                      <p className="text-sm text-baden-base">
                        {unit.guests} {isRu ? 'чел.' : 'guests'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-baden-base/45 mb-1.5">
                        {isRu ? 'Сезонность цены' : 'Price by season'}
                      </p>
                      <SeasonBars prices={unit.prices} />
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-baden-base/45 mb-1.5">{isRu ? 'от' : 'from'}</p>
                      <p className="font-display text-xl md:text-2xl text-baden-gold-bright">
                        {formatEUR(minPrice(unit))}
                        <span className="text-sm text-baden-base/50 font-sans">
                          {isRu ? ' / мес' : ' / mo'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="mt-7 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-base border-b border-baden-base/30 pb-0.5 group-hover:border-baden-gold group-hover:text-baden-gold transition-colors duration-200">
                    {isRu ? 'Смотреть резиденцию' : 'View residence'} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Flagship feature — same data as the rows above, deliberately
            oversized treatment: full-bleed image, larger type, dark overlay
            instead of the cream card. This is the visual climax of the list,
            not row six. */}
        <Reveal delay={240} className="mt-16 md:mt-24">
          <Link
            to={`/residence/${flagship.id}`}
            className="group relative block h-[62vh] min-h-[440px] max-h-[680px] overflow-hidden"
          >
            <img
              src={flagship.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              style={{ objectPosition: positionFor(flagship.image) }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
              aria-hidden
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-sm tabular-nums text-baden-gold-bright">
                  {String(flagshipIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-xs tracking-widest2 uppercase text-baden-cream/60">
                  {isRu ? flagship.location.ru : flagship.location.en}
                </span>
                <span className="h-px w-6 bg-baden-gold-bright" aria-hidden />
                <span className="text-xs tracking-widest2 uppercase text-baden-gold-bright">
                  {isRu ? 'Флагман' : 'Flagship'}
                </span>
              </div>

              <h3 className="font-display font-medium text-3xl sm:text-4xl md:text-6xl text-baden-cream mb-4 max-w-2xl">
                {isRu ? flagship.name.ru : flagship.name.en}
              </h3>

              <p className="text-sm md:text-lg text-baden-cream/75 max-w-xl mb-8 md:mb-10">
                {isRu ? flagship.blurb.ru : flagship.blurb.en}
              </p>

              <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
                <div>
                  <p className="text-xs text-baden-cream/50 mb-1.5">{isRu ? 'Площадь' : 'Size'}</p>
                  <p className="text-sm text-baden-cream">{flagship.size}</p>
                </div>
                <div>
                  <p className="text-xs text-baden-cream/50 mb-1.5">{isRu ? 'Гости' : 'Guests'}</p>
                  <p className="text-sm text-baden-cream">
                    {flagship.guests} {isRu ? 'чел.' : 'guests'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-baden-cream/50 mb-1.5">
                    {isRu ? 'Сезонность цены' : 'Price by season'}
                  </p>
                  <SeasonBars prices={flagship.prices} />
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-baden-cream/50 mb-1.5">{isRu ? 'от' : 'from'}</p>
                  <p className="font-display text-2xl md:text-3xl text-baden-gold-bright">
                    {formatEUR(minPrice(flagship))}
                    <span className="text-sm text-baden-cream/60 font-sans">
                      {isRu ? ' / мес' : ' / mo'}
                    </span>
                  </p>
                </div>
              </div>

              <span className="mt-8 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-cream border-b border-baden-cream/40 pb-0.5 w-fit group-hover:border-baden-gold-bright group-hover:text-baden-gold-bright transition-colors duration-200">
                {isRu ? 'Смотреть резиденцию' : 'View residence'} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
