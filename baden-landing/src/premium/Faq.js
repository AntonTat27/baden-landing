import React, { useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, EASE, motion, fadeUp } from './motion';
import { REGISTER } from './registers';

const FAQ = [
  {
    ru: { q: 'Даёт ли доля в недвижимости вид на жительство в Турции?', a: 'Зарегистрированная собственность (включая долевой ТАПУ, при соблюдении минимального порога стоимости) может быть основанием для подачи на ВНЖ. Точные условия и пороги устанавливает миграционная служба Турции, и они могут меняться. Это общая информация, а не гарантия и не юридическая консультация: перед покупкой уточняйте актуальные требования у иммиграционного юриста.' },
    en: { q: 'Does a share in the property lead to Turkish residency?', a: 'Registered ownership (including a shared TAPU, above a minimum value threshold) can be grounds for a residence permit application. The exact conditions and thresholds are set by Turkish immigration authorities, and they can change. This is general information, not a guarantee or legal advice: confirm current requirements with an immigration lawyer before you buy.' },
  },
  {
    ru: { q: 'Кто отвечает за содержание и управление объектом?', a: 'На каждый объект назначена управляющая команда на месте: уборка, обслуживание, бронирование недель для долевых и таймшер-владельцев. Управляющий сбор рассчитывается индивидуально по объекту и обсуждается на этапе консультации.' },
    en: { q: 'Who handles upkeep and management?', a: 'Each property has an on-site management team handling cleaning, maintenance, and week-booking for fractional and timeshare owners. The management fee is calculated per property and discussed during your consultation.' },
  },
  {
    ru: { q: 'В какой валюте оформляется сделка и есть ли дополнительные расходы?', a: 'Сделки обычно номинируются в евро или турецких лирах в зависимости от объекта. Помимо цены входа, как правило, есть разовые расходы на оформление (нотариус, регистрация ТАПУ, перевод документов). Точный расчёт предоставляется индивидуально перед сделкой.' },
    en: { q: 'What currency is the deal in, and are there extra costs?', a: 'Deals are typically denominated in euros or Turkish lira depending on the property. Beyond the entry price, there are usually one-time registration costs (notary, TAPU registration, document translation). An exact breakdown is provided individually before you commit.' },
  },
  {
    ru: { q: 'Нужно ли платить налоги на недвижимость в Турции?', a: 'Да, владение недвижимостью в Турции сопряжено с ежегодным налогом на имущество и, при сдаче в аренду, налогом на доход от аренды. Ставки зависят от типа и стоимости объекта. Мы не даём налоговых консультаций: перед покупкой рекомендуем проконсультироваться с турецким налоговым юристом или бухгалтером.' },
    en: { q: 'Are there property taxes in Turkey?', a: 'Yes. Property ownership in Turkey carries an annual property tax and, if you rent it out, tax on rental income; rates depend on the property type and value. We do not provide tax advice, and we recommend consulting a Turkish tax lawyer or accountant before purchasing.' },
  },
];

// A single collapsible question. Closed by default; clicking the question
// row expands its answer in place (height/opacity animated) and rotates the
// plus into a cross — the conventional FAQ accordion pattern. Only one item
// stays open at a time, which keeps a long answer list scannable instead of
// growing indefinitely down the page.
function FaqItem({ q, a, open, onToggle }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={fadeUp} className={`${REGISTER.radius} ${REGISTER.border} bg-baden-dark-2/60 overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 text-left px-6 md:px-7 py-5 md:py-6"
      >
        <h3 className="font-display text-lg text-baden-on-dark">{q}</h3>
        <span
          className="relative h-5 w-5 shrink-0 text-baden-brand-bright"
          aria-hidden
        >
          <span
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-sm text-baden-on-dark/80 leading-relaxed px-6 md:px-7 pb-6 md:pb-7">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const { isRu } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0); // first question open by default

  return (
    <section id="faq" className="relative bg-baden-dark-2 py-24 md:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-10 relative">
        <h2 className="font-display font-light text-3xl md:text-5xl text-baden-on-dark leading-[1.04] tracking-[-0.02em] mb-10 md:mb-14">
          <RevealLines lines={isRu ? ['Частые вопросы'] : ['Frequently asked']} />
        </h2>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
        >
          {FAQ.map((item, i) => {
            const t = isRu ? item.ru : item.en;
            return (
              <FaqItem
                key={i}
                q={t.q}
                a={t.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
              />
            );
          })}
        </motion.div>

        <Reveal className="mt-10 text-xs text-baden-on-dark/70 leading-relaxed max-w-2xl">
          {isRu
            ? 'Это общая информация для ознакомления, а не юридическая, налоговая или финансовая консультация. Условия могут меняться в зависимости от объекта, законодательства и вашей личной ситуации. Перед сделкой рекомендуем проконсультироваться с независимым юристом.'
            : 'This is general informational content, not legal, tax, or financial advice. Terms can vary by property, by law, and by your personal situation. We recommend consulting an independent lawyer before you commit.'}
        </Reveal>
      </div>
    </section>
  );
}
