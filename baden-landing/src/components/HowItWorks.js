import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// PLACEHOLDER SECTION — client has not finalized the fractional-ownership
// format/mechanics yet. Kept deliberately minimal so it's cheap to redesign
// once share size, week allocation, and resale terms are decided.
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

  return (
    <section id="how-it-works" className="relative bg-baden-panel py-24 md:py-28">
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="font-display text-2xl md:text-4xl text-baden-cream mb-14 md:mb-16 max-w-xl">
          {isRu ? 'Как устроено дробное владение' : 'How fractional ownership works'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="border-t border-baden-muted/30 pt-5">
              <p className="font-accent italic text-3xl text-baden-gold-bright mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display text-lg text-baden-cream mb-2">
                {isRu ? step.ru.title : step.en.title}
              </h3>
              <p className="text-sm text-baden-muted">{isRu ? step.ru.body : step.en.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
