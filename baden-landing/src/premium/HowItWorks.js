import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { OWNERSHIP_MODELS } from '../data/units';
import { Reveal, RevealLines, fadeUp } from './motion';

// Model-agnostic — the same four steps apply whether a given property is
// sold as a full purchase, a fractional share, or a timeshare. Step 2 names
// all three instruments rather than assuming a share/TAPU for everyone.
const STEPS = [
  {
    ru: { title: 'Выберите объект и способ владения', body: 'Не у каждого объекта есть все три варианта — сначала смотрим, что доступно именно там.' },
    en: { title: 'Choose a property and a model', body: 'Not every property offers all three — we start with what is actually available there.' },
  },
  {
    ru: { title: 'Оформите — по документам, подходящим формату', body: 'Купчая на полное владение, ТАПУ на долю, или контракт на недели таймшера.' },
    en: { title: 'Register it — full deed, share, or contract', body: 'A sale deed for full ownership, a notarized TAPU share for fractional, or a timeshare contract for set weeks.' },
  },
  {
    ru: { title: 'Пользуйтесь', body: 'Свой дом — в любое время. Доля или таймшер — свои недели каждый год. Управление и сервис на месте.' },
    en: { title: 'Use it', body: 'Full owners come and go as they please; shares and timeshares come with set weeks each year. On-site management either way.' },
  },
  {
    ru: { title: 'Продайте или передайте', body: 'Купчая, доля или таймшер — каждый формат передаётся и наследуется, как любая недвижимость.' },
    en: { title: 'Resell or pass it on', body: 'Deed, share, or timeshare — each transfers and is inheritable, the same as any real estate.' },
  },
];

const MODEL_DOT = { gold: 'bg-baden-gold-bright', sea: 'bg-baden-sea', teal: 'bg-baden-teal' };

// The three-model explainer — folded into this section rather than broken
// out on its own, since it's context for the steps below it, not a separate
// topic.
function OwnershipModels({ isRu }) {
  return (
    <div className="mt-10 space-y-5">
      {Object.entries(OWNERSHIP_MODELS).map(([key, m]) => (
        <div key={key} className="flex gap-3">
          <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${MODEL_DOT[m.accent]}`} aria-hidden />
          <div>
            <p className="text-sm font-medium text-baden-cream mb-0.5">{isRu ? m.ru.label : m.en.label}</p>
            <p className="text-sm text-baden-muted leading-relaxed">{isRu ? m.ru.def : m.en.def}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Vertical progress rail that fills as the steps scroll past.
function Rail() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="absolute left-0 top-0 bottom-0 w-px bg-baden-cream/10 hidden md:block">
      <motion.div style={{ scaleY, transformOrigin: 'top' }} className="absolute inset-0 bg-baden-gold-bright" />
    </div>
  );
}

export default function HowItWorks() {
  const { isRu } = useLanguage();

  return (
    <section id="how-it-works" className="relative bg-baden-panel py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 h-[26rem] w-[22rem] rounded-full bg-baden-gold/[0.06] blur-[110px] pointer-events-none" aria-hidden />
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
            <span className="h-px w-8 bg-baden-gold" />
            {isRu ? 'Механика' : 'The mechanics'}
          </Reveal>
          <h2 className="font-display font-light text-3xl md:text-5xl text-baden-cream leading-[1.04] tracking-[-0.02em] mb-6">
            <RevealLines lines={isRu ? ['Три способа', <>владеть <span className="italic text-baden-teal">недвижимостью</span></>] : ['Three ways', <>to own <span className="italic text-baden-teal">real estate</span></>]} />
          </h2>
          <Reveal className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md">
            {isRu
              ? 'Baden работает с тремя разными форматами. У каждого объекта — свой набор вариантов; ниже — как это работает для всех трёх.'
              : 'Baden works across three different models. Each property offers its own subset — below is how each one actually works.'}
          </Reveal>
          <OwnershipModels isRu={isRu} />
        </div>

        <div className="md:col-span-7 relative md:pl-10">
          <Rail />
          <motion.ol
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col"
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="relative border-t border-baden-cream/10 last:border-b py-8 md:py-10 md:pl-8"
              >
                <span className="hidden md:block absolute -left-[5px] top-10 h-2.5 w-2.5 rounded-full bg-baden-gold-bright ring-4 ring-baden-panel" aria-hidden />
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-2xl tabular-nums text-baden-gold-bright/80">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-baden-cream mb-2">
                      {isRu ? step.ru.title : step.en.title}
                    </h3>
                    <p className="text-sm md:text-base text-baden-muted max-w-md leading-relaxed">
                      {isRu ? step.ru.body : step.en.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
