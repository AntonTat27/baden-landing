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
    ru: { title: 'Оформите — ТАПУ под ваш формат владения', body: 'Полный ТАПУ при полном владении, долевой ТАПУ при дробном, или контракт на недели при таймшере.' },
    en: { title: 'Register it — a TAPU that matches the model', body: 'A full TAPU for full ownership, a shared TAPU for a fractional stake, or a timeshare contract for set weeks.' },
  },
  {
    ru: { title: 'Пользуйтесь', body: 'Свой дом — в любое время. Доля или таймшер — свои недели каждый год. Управление и сервис на месте.' },
    en: { title: 'Use it', body: 'Full owners come and go as they please; shares and timeshares come with set weeks each year. On-site management either way.' },
  },
  {
    ru: { title: 'Продайте или передайте', body: 'ТАПУ или таймшер-контракт — каждый формат передаётся и наследуется, как любая недвижимость.' },
    en: { title: 'Resell or pass it on', body: 'A TAPU or a timeshare contract — either transfers and is inheritable, the same as any real estate.' },
  },
];

const MODEL_ACCENT = {
  gold: { bar: 'bg-baden-gold-bright', text: 'text-baden-gold-bright', glow: 'bg-baden-gold-bright/[0.07]' },
  sea: { bar: 'bg-baden-sea', text: 'text-baden-sea', glow: 'bg-baden-sea/[0.07]' },
  teal: { bar: 'bg-baden-teal', text: 'text-baden-teal', glow: 'bg-baden-teal/[0.07]' },
};

// The three-model explainer — folded into this section rather than broken
// out on its own. Each model is a card with its own accent edge, so the three
// ways to own read as distinct choices rather than three lines of small text.
function OwnershipModels({ isRu }) {
  return (
    <div className="space-y-4">
      {Object.entries(OWNERSHIP_MODELS).map(([key, m]) => {
        const a = MODEL_ACCENT[m.accent] || MODEL_ACCENT.gold;
        return (
          <div
            key={key}
            className="group relative overflow-hidden rounded-2xl border border-baden-line bg-baden-panel/60 pl-5 pr-5 py-4 transition-colors duration-300 hover:border-baden-cream/20"
          >
            <span className={`absolute left-0 top-0 bottom-0 w-1 ${a.bar}`} aria-hidden />
            <span className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${a.glow}`} aria-hidden />
            <p className={`text-xs font-medium tracking-widest2 uppercase mb-1.5 ${a.text}`}>
              {isRu ? m.ru.label : m.en.label}
            </p>
            <p className="text-sm text-baden-muted leading-relaxed">{isRu ? m.ru.def : m.en.def}</p>
          </div>
        );
      })}
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
    <section id="how-it-works" className="relative bg-baden-panel2 py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 h-[26rem] w-[22rem] rounded-full bg-baden-gold/[0.06] blur-[110px] pointer-events-none" aria-hidden />

      {/* Heading sits centered above both columns, so it's always the first
          thing in view — previously it lived inside the sticky left rail,
          which meant the step list could enter the viewport before it did. */}
      <div className="max-w-8xl mx-auto px-6 md:px-10 text-center mb-14 md:mb-20">
        <Reveal as="p" className="flex items-center justify-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
          <span className="h-px w-8 bg-baden-gold" />
          {isRu ? 'Механика' : 'The mechanics'}
          <span className="h-px w-8 bg-baden-gold" />
        </Reveal>
        <h2 className="font-display font-light text-3xl md:text-5xl text-baden-cream leading-[1.04] tracking-[-0.02em] mb-6">
          <RevealLines
            className="items-center"
            lines={isRu ? ['Три способа', <>владеть <span className="italic text-baden-teal">недвижимостью</span></>] : ['Three ways', <>to own <span className="italic text-baden-teal">real estate</span></>]}
          />
        </h2>
        <Reveal className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md mx-auto">
          {isRu
            ? 'Baden работает с тремя разными форматами. У каждого объекта — свой набор вариантов; ниже — как это работает для всех трёх.'
            : 'Baden works across three different models. Each property offers its own subset — below is how each one actually works.'}
        </Reveal>
      </div>

      <div className="max-w-8xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
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
                className="group relative border-t border-baden-cream/10 last:border-b py-8 md:py-11 md:pl-8"
              >
                <span className="hidden md:block absolute -left-[5px] top-11 h-2.5 w-2.5 rounded-full bg-baden-gold-bright ring-4 ring-baden-panel2" aria-hidden />
                {/* Oversized ghost numeral for depth — sits behind the copy,
                    warms to gold on hover. */}
                <span
                  className="pointer-events-none absolute right-0 -top-2 font-display text-[5.5rem] md:text-[7rem] leading-none tabular-nums text-baden-cream/[0.05] group-hover:text-baden-gold-bright/[0.10] transition-colors duration-500 select-none"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative flex items-baseline gap-5">
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
