import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { stagger, fadeUp, motion } from './motion';
import CountUp from './CountUp';

const STATS = [
  { to: 5, suffix: '', ru: 'форматов резиденций', en: 'residence formats' },
  { to: 100, suffix: '%', ru: 'официальный ТАПУ', en: 'official title deed' },
  { to: 52, suffix: ' нед.', enSuffix: ' wks', ru: 'год под вашим контролем', en: 'a year, allocated to owners' },
  { to: 12, prefix: '€', suffix: 'k', ru: 'от / за неделю сезона', en: 'from / per peak week' },
];

export default function TrustBar() {
  const { isRu } = useLanguage();
  return (
    <section className="relative bg-baden-base border-b border-baden-line">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-8xl mx-auto px-6 md:px-10 py-12 md:py-16 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6"
      >
        {STATS.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="flex flex-col">
            <span className="font-display text-4xl md:text-5xl text-baden-cream tracking-tight">
              <CountUp
                to={s.to}
                prefix={s.prefix || ''}
                suffix={isRu ? s.suffix : s.enSuffix || s.suffix}
              />
            </span>
            <span className="mt-3 text-xs md:text-sm text-baden-muted max-w-[16ch] leading-snug">
              {isRu ? s.ru : s.en}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
