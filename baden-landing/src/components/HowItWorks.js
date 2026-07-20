import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useInView from '../hooks/useInView';
import Reveal from './Reveal';

// PLACEHOLDER CONTENT — client has not finalized the fractional-ownership
// format/mechanics yet; copy stays minimal until share size, week allocation,
// and resale terms are decided. Layout: interactive step list — hovering or
// tapping a step expands its detail and swaps the oversized ghost number.
const STEPS = [
  {
    ru: { title: 'Выберите резиденцию', body: 'Определитесь с форматом и сезоном.' },
    en: { title: 'Choose your residence', body: 'Pick the unit type and season that fit.' },
  },
  {
    ru: { title: 'Приобретите долю', body: 'Юридически оформленная доля в недвижимости.' },
    en: { title: 'Buy a legal share', body: 'A legally registered fractional share of the property.' },
  },
  {
    ru: { title: 'Пользуйтесь неделями', body: 'Ваше время у моря — каждый год.' },
    en: { title: 'Use your weeks', body: 'Your time by the sea, every year.' },
  },
  {
    ru: { title: 'Продайте или передайте', body: 'Как и любая доля в недвижимости.' },
    en: { title: 'Resell or inherit', body: 'Like any other share of real estate.' },
  },
];

export default function HowItWorks() {
  const { isRu } = useLanguage();
  const [active, setActive] = useState(0);
  const [listRef, listInView] = useInView(0.2);

  return (
    <section id="how-it-works" className="relative bg-baden-panel py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
              {isRu ? 'Механика' : 'The mechanics'}
            </p>
            <h2 className="font-display font-medium text-2xl md:text-4xl text-baden-cream max-w-md">
              {isRu ? 'Как устроено дробное владение' : 'How fractional ownership works'}
            </h2>
          </Reveal>

          {/* Oversized ghost number of the active step */}
          <p
            key={active}
            aria-hidden
            className="hidden md:block font-display font-semibold text-[11rem] leading-none text-baden-cream/[0.07] mt-10 select-none animate-[fadein_500ms_ease_both] tabular-nums"
          >
            {String(active + 1).padStart(2, '0')}
          </p>
        </div>

        <div className="md:col-span-7" ref={listRef}>
          {STEPS.map((step, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={isActive}
                className={`block w-full text-left border-t border-baden-cream/10 last:border-b py-6 md:py-7 group ${
                  listInView ? '' : 'opacity-0'
                }`}
                style={{
                  animation: listInView
                    ? `rise 600ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms both`
                    : 'none',
                }}
              >
                <div className="flex items-baseline gap-5">
                  <span
                    className={`font-display text-sm tabular-nums transition-colors duration-300 ${
                      isActive ? 'text-baden-gold-bright' : 'text-baden-muted'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={`font-display text-xl md:text-2xl transition-colors duration-300 ${
                      isActive ? 'text-baden-cream' : 'text-baden-cream/45 group-hover:text-baden-cream/70'
                    }`}
                  >
                    {isRu ? step.ru.title : step.en.title}
                  </h3>
                </div>
                {/* Expanding detail row */}
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pl-[calc(1.25rem+2ch)] pt-3 text-sm md:text-base text-baden-muted max-w-md">
                      {isRu ? step.ru.body : step.en.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
