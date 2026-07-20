import React from 'react';
import { groundsImg, conciergeImg, poolImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp, motion } from './motion';

const Icons = {
  passport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 21c.6-1.8 1.7-3 3-3s2.4 1.2 3 3" />
    </svg>
  ),
  growth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <path d="M4 19V5M4 19h16" />
      <path d="M7 15l3.5-4 3 2.5L20 7" />
      <path d="M20 11V7h-4" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  ),
};

const AUDIENCES = [
  {
    key: 'investment',
    icon: 'growth',
    image: conciergeImg,
    ru: {
      tag: 'Инвестиции',
      title: 'Реальный актив, дробная цена',
      copy: 'Диверсификация в средиземноморскую недвижимость без порога входа в целый объект: рост стоимости и ликвидность через долю.',
      point: 'Доход от аренды сезона + рост цены побережья',
    },
    en: {
      tag: 'Investment',
      title: 'A real asset, at a fractional price',
      copy: 'Diversify into Mediterranean real estate without the full-property price tag — capital appreciation and liquidity through your share.',
      point: 'Seasonal rental income + coastal appreciation',
    },
  },
  {
    key: 'relocation',
    icon: 'passport',
    featured: true,
    image: groundsImg,
    accent: 'teal',
    ru: {
      tag: 'Переезд',
      title: 'Вид на жительство в Турции',
      copy: 'Доля в недвижимости — доступный шаг к ВНЖ для вас и семьи, в разы дешевле полноценной покупки объекта.',
      point: 'Путь к резиденции без покупки целой квартиры',
    },
    en: {
      tag: 'Relocation',
      title: 'A path to Turkish residency',
      copy: 'A registered share is an accessible route toward residence permits for you and your family — at a fraction of buying a whole property.',
      point: 'Residency route without buying a whole apartment',
    },
  },
  {
    key: 'tourism',
    icon: 'sun',
    image: poolImg,
    accent: 'sea',
    ru: {
      tag: 'Отдых',
      title: 'Своё место у моря — каждый год',
      copy: 'Стабильная точка возвращения раз в год, без забот о содержании: приезжаете — и всё готово к отдыху.',
      point: 'Гарантированные недели без аренды и хлопот',
    },
    en: {
      tag: 'Leisure',
      title: 'Your place by the sea — every year',
      copy: 'A stable place to return to once a year, with none of the upkeep: you arrive, and everything is ready.',
      point: 'Guaranteed weeks, no renting, no upkeep',
    },
  },
];

// Each card carries its own accent (teal / sea / gold) rather than all three
// sharing the one gold token — three genuinely different hues, one per
// scenario, instead of three tints of the same color.
const ACCENT_BADGE = {
  gold: 'bg-baden-gold-bright text-baden-base',
  teal: 'bg-baden-teal/25 text-baden-teal',
  sea: 'bg-baden-sea/25 text-baden-sea',
};
const ACCENT_TEXT = {
  gold: 'text-baden-gold-bright',
  teal: 'text-baden-teal',
  sea: 'text-baden-sea',
};

function Card({ a, index, isRu }) {
  const accent = a.featured ? 'gold' : a.accent || 'gold';
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className={`group relative overflow-hidden rounded-3xl bg-baden-panel flex flex-col ${
        a.featured
          ? 'lg:-mt-8 border border-baden-gold-bright/40 ring-1 ring-baden-gold-bright/20 shadow-[0_0_60px_-15px_rgba(240,200,118,0.3)]'
          : 'border border-baden-line'
      }`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={a.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          style={{ objectPosition: positionFor(a.image) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-baden-panel via-baden-panel/40 to-transparent" aria-hidden />
        <span className="absolute top-5 left-5 inline-flex items-center gap-2 text-[11px] tracking-widest2 uppercase text-baden-cream bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {isRu ? a.ru.tag : a.en.tag}
        </span>
        <span
          className="pointer-events-none absolute bottom-2 right-4 font-display text-[4.5rem] leading-none tabular-nums text-baden-cream/10 select-none"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="p-7 md:p-8 flex flex-col flex-1">
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full mb-6 ${ACCENT_BADGE[accent]}`}>
          {Icons[a.icon]}
        </span>
        <h3 className="font-display text-2xl text-baden-cream mb-3 leading-snug">
          {isRu ? a.ru.title : a.en.title}
        </h3>
        <p className="text-sm md:text-base text-baden-muted leading-relaxed mb-6 flex-1">
          {isRu ? a.ru.copy : a.en.copy}
        </p>
        <div className="flex items-start gap-3 pt-5 border-t border-baden-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`h-5 w-5 shrink-0 mt-0.5 ${ACCENT_TEXT[accent]}`}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <p className="text-sm text-baden-cream/85">{isRu ? a.ru.point : a.en.point}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Audiences() {
  const { isRu } = useLanguage();
  return (
    <section id="audiences" className="relative bg-baden-base py-24 md:py-32 overflow-hidden">
      {/* Ambient depth so the section doesn't read as a flat panel — a teal
          glow left, a warm gold glow behind the featured middle card. */}
      <div className="absolute top-10 -left-24 h-[26rem] w-[24rem] rounded-full bg-baden-teal/[0.08] blur-[130px] pointer-events-none" aria-hidden />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-baden-gold/[0.06] blur-[140px] pointer-events-none" aria-hidden />
      <div className="absolute inset-0 opacity-[0.05] bg-grain mix-blend-overlay pointer-events-none" aria-hidden />

      <div className="max-w-8xl mx-auto px-6 md:px-10 relative">
        <div className="max-w-3xl mb-14 md:mb-20">
          <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
            <span className="h-px w-8 bg-baden-gold" />
            {isRu ? 'Три сценария' : 'Three scenarios'}
          </Reveal>
          <h2 className="font-display font-light text-4xl md:text-6xl text-baden-cream leading-[1.02] tracking-[-0.02em] mb-6">
            <RevealLines lines={isRu ? ['Одна недвижимость —', <>три <span className="italic text-baden-gold-bright">причины</span></>] : ['One property,', <>three <span className="italic text-baden-gold-bright">reasons</span></>]} />
          </h2>
          <Reveal className="text-sm md:text-base text-baden-muted max-w-xl leading-relaxed">
            {isRu
              ? 'Собственники Baden приходят за разным — и, независимо от формата владения, каждому это даёт свой результат.'
              : 'Baden owners come for different reasons — and whichever ownership model fits, each one delivers a distinct outcome.'}
          </Reveal>
        </div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {AUDIENCES.map((a, i) => (
            <Card key={a.key} a={a} index={i} isRu={isRu} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
