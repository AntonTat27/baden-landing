import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { poolImg, groundsImg, conciergeImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines } from './motion';
import GlassSheen from './GlassSheen';

// Real amenities, sourced from Beyzade Resort's own "Sosyal Alanlar" page
// (beyzaderesort.com/sosyal-alanlar) — kept here as representative of what a
// Baden property actually offers, rather than generic stock-photo copy.
const CARDS = [
  {
    key: 'womens-pool',
    image: poolImg,
    accent: 'sea',
    ru: { label: 'Приватность', title: 'Раздельные зоны бассейна для мужчин и женщин', copy: 'Отдельные зоны у воды для мужчин и женщин — приватно и с уважением к традициям гостей.' },
    en: { label: 'Privacy', title: 'Separate pool areas for men and women', copy: 'Distinct water areas for men and women — private and considerate of guests’ traditions.' },
  },
  {
    key: 'social',
    image: groundsImg,
    accent: 'gold',
    ru: { label: 'Территория', title: 'Ресторан и детский клуб', copy: 'Игровые площадки, мини-клуб и ресторан — отдых продуман для всей семьи.' },
    en: { label: 'Grounds', title: 'Restaurant & kids’ club', copy: 'Play areas, a mini club, and an on-site restaurant — built around the whole family.' },
  },
  {
    key: 'hamam',
    image: conciergeImg,
    accent: 'teal',
    ru: { label: 'Спа', title: 'Хамам и массаж', copy: 'Турецкая баня, комната отдыха и массажный кабинет — забота о теле включена.' },
    en: { label: 'Spa', title: 'Hamam & massage', copy: 'A Turkish bath, a relaxation room, and a massage suite — wellness built in.' },
  },
];

const ACCENT_TEXT = { gold: 'text-baden-gold-bright', sea: 'text-baden-sea', teal: 'text-baden-teal' };

const AUTO_MS = 5000;

// One large showcase panel that cycles through the amenities, rather than
// three static cards — the image, copy, and accent color all crossfade
// together, with a per-slide progress bar (Stories-style) and click-through
// tabs so it's eye-grabbing without being purely passive.
function AmenityShowcase({ isRu }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % CARDS.length);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (reduce) return;
    timerRef.current = setInterval(advance, AUTO_MS);
    return () => clearInterval(timerRef.current);
  }, [advance, reduce, tick]);

  const card = CARDS[index];

  return (
    <div className="relative overflow-hidden rounded-[2rem] h-[70vh] min-h-[480px] max-h-[820px]">
      <AnimatePresence mode="sync">
        <motion.img
          key={card.key}
          src={card.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ objectPosition: positionFor(card.image) }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      {/* Darker, more even tint so the caption and selector stay legible
          regardless of which photo is showing. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/35" aria-hidden />
      <GlassSheen />

      {/* Vertical selector, echoing the hero's right-hand nav list — one
          label per amenity, active item bold + underlined. Dash color is
          uniform (gold) rather than per-amenity accent, so the list reads as
          one control rather than three different colors. */}
      <div className="absolute right-7 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-10">
        {CARDS.map((c, i) => {
          const active = i === index;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setIndex(i);
                setTick((t) => t + 1);
              }}
              className="group flex items-center gap-3"
            >
              <span
                className={`text-[11px] md:text-xs tracking-widest2 uppercase transition-colors duration-300 ${
                  active ? 'text-baden-cream font-medium underline underline-offset-4' : 'text-baden-cream/50 group-hover:text-baden-cream/80'
                }`}
              >
                {isRu ? c.ru.label : c.en.label}
              </span>
              <span
                className={`h-px w-6 transition-colors duration-300 ${active ? 'bg-baden-gold-bright' : 'bg-baden-cream/25'}`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={`text-[11px] tracking-widest2 uppercase mb-2 block ${ACCENT_TEXT[card.accent]}`}>
              {isRu ? card.ru.label : card.en.label}
            </span>
            <h3 className="font-display text-2xl md:text-4xl text-baden-cream mb-2 max-w-lg">
              {isRu ? card.ru.title : card.en.title}
            </h3>
            <p className="text-sm md:text-base text-baden-cream/70 max-w-md">
              {isRu ? card.ru.copy : card.en.copy}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Amenities() {
  const { isRu } = useLanguage();

  return (
    <section id="amenities" className="relative bg-baden-base py-24 md:py-32 overflow-hidden">
      {/* Background gets its own texture rather than sitting flat — a warm
          terracotta glow top-left, a cool teal glow bottom-right (echoing the
          hero's ambient light), plus a faint diagonal seam and grain so the
          section reads as considered rather than a plain dark panel. */}
      <div className="absolute -top-24 -left-24 h-[30rem] w-[30rem] rounded-full bg-baden-sea/[0.10] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute -bottom-32 -right-16 h-[26rem] w-[26rem] rounded-full bg-baden-teal/[0.12] blur-[130px] pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none"
        style={{ background: 'linear-gradient(115deg, transparent 40%, rgba(214,169,76,0.05) 52%, transparent 64%)' }}
        aria-hidden
      />
      <div className="absolute inset-0 opacity-[0.06] bg-grain mix-blend-overlay pointer-events-none" aria-hidden />

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

        <Reveal amount={0.15}>
          <AmenityShowcase isRu={isRu} />
        </Reveal>
      </div>
    </section>
  );
}
