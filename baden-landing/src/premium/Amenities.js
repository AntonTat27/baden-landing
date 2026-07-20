import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { poolImg, groundsImg, conciergeImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp } from './motion';
import Tilt3D from './Tilt3D';
import GlassSheen from './GlassSheen';

// Real amenities, sourced from Beyzade Resort's own "Sosyal Alanlar" page
// (beyzaderesort.com/sosyal-alanlar) — kept here as representative of what a
// Baden property actually offers, rather than generic stock-photo copy.
const CARDS = [
  {
    key: 'womens-pool',
    image: poolImg,
    span: 'lg:col-span-7 lg:row-span-2',
    h: 'h-[52vh] lg:h-auto',
    ru: { label: 'Приватность', title: 'Бассейн только для женщин', copy: 'Отдельная зона у воды — приватная, спокойная, только для хозяек отдыха.' },
    en: { label: 'Privacy', title: 'A women-only pool', copy: 'A separate, private stretch of water — calm, secluded, reserved for women only.' },
  },
  {
    key: 'social',
    image: groundsImg,
    span: 'lg:col-span-5',
    h: 'h-[40vh] lg:h-auto',
    ru: { label: 'Территория', title: 'Ресторан и детский клуб', copy: 'Игровые площадки, мини-клуб и ресторан — отдых продуман для всей семьи.' },
    en: { label: 'Grounds', title: 'Restaurant & kids’ club', copy: 'Play areas, a mini club, and an on-site restaurant — built around the whole family.' },
  },
  {
    key: 'hamam',
    image: conciergeImg,
    span: 'lg:col-span-5',
    h: 'h-[40vh] lg:h-auto',
    ru: { label: 'Спа', title: 'Хамам и массаж', copy: 'Турецкая баня, комната отдыха и массажный кабинет — забота о теле включена.' },
    en: { label: 'Spa', title: 'Hamam & massage', copy: 'A Turkish bath, a relaxation room, and a massage suite — wellness built in.' },
  },
];

function AmenityCard({ card, isRu }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-2xl ${card.span} ${card.h}`}
    >
      <Tilt3D max={5} scale={1.01} className="absolute inset-0">
        <motion.img
          src={card.image}
          alt=""
          style={{ y, objectPosition: positionFor(card.image), scale: 1.15 }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
        <GlassSheen />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end" style={{ transform: 'translateZ(30px)' }}>
          <span className="text-[11px] tracking-widest2 uppercase text-baden-gold-bright mb-2">
            {isRu ? card.ru.label : card.en.label}
          </span>
          <h3 className="font-display text-2xl md:text-3xl text-baden-cream mb-1.5">
            {isRu ? card.ru.title : card.en.title}
          </h3>
          <p className="text-sm text-baden-cream/70 max-w-sm">
            {isRu ? card.ru.copy : card.en.copy}
          </p>
        </div>
      </Tilt3D>
    </motion.div>
  );
}

export default function Amenities() {
  const { isRu } = useLanguage();

  return (
    <section id="amenities" className="relative bg-baden-base py-24 md:py-32 overflow-hidden">

      <div className="max-w-8xl mx-auto px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
              <span className="h-px w-8 bg-baden-gold" />
              {isRu ? 'На территории' : 'On the property'}
            </Reveal>
            <h2 className="font-display font-light text-4xl md:text-6xl text-baden-cream leading-[1.02] tracking-[-0.02em]">
              <RevealLines
                lines={
                  isRu
                    ? ['Резиденция, устроенная', <>вокруг <span className="italic text-baden-sea">жизни</span></>]
                    : ['A residence built', <>around <span className="italic text-baden-sea">living</span></>]
                }
              />
            </h2>
          </div>
          <Reveal className="max-w-sm text-sm md:text-base text-baden-muted leading-relaxed">
            {isRu
              ? 'Архитектура, вписанная в склон над Средиземным морем — и сервис, который делает владение долей таким же беззаботным, как отель.'
              : 'Architecture folded into the hillside above the Mediterranean — with service that makes owning a share as effortless as a hotel stay.'}
          </Reveal>
        </div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 lg:auto-rows-fr lg:h-[80vh] lg:max-h-[760px]"
        >
          {CARDS.map((c) => (
            <AmenityCard key={c.key} card={c} isRu={isRu} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
