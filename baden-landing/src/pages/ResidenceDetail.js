import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getUnitById, MONTHS, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import LeadForm from '../components/LeadForm';

export default function ResidenceDetail() {
  const { id } = useParams();
  const { isRu } = useLanguage();
  const unit = getUnitById(id);

  const now = new Date().getMonth();
  const [monthIndex, setMonthIndex] = useState(now);
  const [weeks, setWeeks] = useState(1);

  if (!unit) {
    return <Navigate to="/" replace />;
  }

  const monthlyPrice = unit.prices[monthIndex];
  const pricePerWeek = Math.round(monthlyPrice / 4);
  const illustrativeTotal = pricePerWeek * weeks;

  return (
    <>
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-baden-base">
        <img
          src={unit.image}
          alt={isRu ? unit.name.ru : unit.name.en}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: positionFor(unit.image),
            filter: 'saturate(0.88) brightness(0.85) sepia(0.12)',
          }}
        />
        <div className="absolute inset-0 bg-baden-base/45" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-baden-base via-baden-base/45 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-10 pb-14 max-w-7xl mx-auto">
          <Link
            to="/#listings"
            className="text-xs tracking-widest2 uppercase text-baden-muted hover:text-baden-gold-bright transition-colors duration-200 mb-6 w-fit"
          >
            &larr; {isRu ? 'Все варианты' : 'All options'}
          </Link>
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-3">
            {isRu ? unit.location.ru : unit.location.en} &middot;{' '}
            {isRu ? 'Дробное владение' : 'Fractional ownership'}
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-baden-cream max-w-2xl">
            {isRu ? unit.name.ru : unit.name.en}
          </h1>
          <p className="mt-4 text-baden-cream/60">
            {unit.size} · {unit.guests} {isRu ? 'гостей' : 'guests'}
          </p>
        </div>
      </section>

      <section className="relative bg-baden-panel py-20 md:py-24">
        <div
          className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent"
          aria-hidden
        />
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-display text-xl md:text-2xl text-baden-cream leading-relaxed">
            {isRu ? unit.blurb.ru : unit.blurb.en}
          </p>
        </div>
      </section>

      <section className="relative bg-baden-cream py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'Калькулятор' : 'Calculator'}
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-baden-base mb-3">
            {isRu ? 'Оцените стоимость по месяцу' : 'Estimate the cost by month'}
          </h2>
          <p className="text-sm text-baden-base/55 mb-10 max-w-xl">
            {isRu
              ? 'Иллюстративный расчёт для обсуждения. Точный механизм долей и недель будет определён отдельно.'
              : 'An illustrative calculation for discussion purposes. The exact share/week mechanics will be finalized separately.'}
          </p>

          <div className="mb-10">
            <p className="text-xs tracking-widest2 uppercase text-baden-base/45 mb-4">
              {isRu ? 'Месяц' : 'Month'}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {MONTHS.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMonthIndex(i)}
                  className={`text-xs md:text-sm px-3 py-2 border transition-colors duration-200 ${
                    i === monthIndex
                      ? 'border-baden-gold text-baden-gold'
                      : 'border-baden-base/20 text-baden-base/55 hover:text-baden-base hover:border-baden-base/40'
                  }`}
                >
                  {isRu ? m.short.ru : m.short.en}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <p className="text-xs tracking-widest2 uppercase text-baden-base/45 mb-4">
              {isRu ? 'Недели (иллюстративно)' : 'Weeks (illustrative)'}
            </p>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setWeeks((w) => Math.max(1, w - 1))}
                className="w-9 h-9 border border-baden-base/25 text-baden-base hover:border-baden-gold hover:text-baden-gold transition-colors duration-200"
                aria-label={isRu ? 'Уменьшить' : 'Decrease'}
              >
                &minus;
              </button>
              <span className="font-display text-2xl text-baden-base w-8 text-center">{weeks}</span>
              <button
                type="button"
                onClick={() => setWeeks((w) => Math.min(4, w + 1))}
                className="w-9 h-9 border border-baden-base/25 text-baden-base hover:border-baden-gold hover:text-baden-gold transition-colors duration-200"
                aria-label={isRu ? 'Увеличить' : 'Increase'}
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-baden-base/15 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-baden-base/50 mb-2">
                {isRu ? `${MONTHS[monthIndex].ru} · за месяц` : `${MONTHS[monthIndex].en} · per month`}
              </p>
              <p className="font-display text-2xl text-baden-base">{formatEUR(monthlyPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-baden-base/50 mb-2">
                {isRu ? 'Ориентировочно за неделю' : 'Approx. per week'}
              </p>
              <p className="font-display text-2xl text-baden-base">{formatEUR(pricePerWeek)}</p>
            </div>
            <div>
              <p className="text-xs text-baden-base/50 mb-2">
                {isRu ? `Итого за ${weeks} нед. (иллюстративно)` : `Total for ${weeks} wk(s) (illustrative)`}
              </p>
              <p className="font-display text-2xl text-baden-gold-bright">{formatEUR(illustrativeTotal)}</p>
            </div>
          </div>
        </div>
      </section>

      <LeadForm compact id="lead-form" />
    </>
  );
}
