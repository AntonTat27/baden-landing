import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UNITS, OWNERSHIP_MODELS, minPrice, formatEUR } from '../data/units';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp } from './motion';
import Tilt3D from './Tilt3D';
import GlassSheen from './GlassSheen';

// Small colored dot + label per ownership model — full / fractional /
// timeshare each get their own accent so the model reads at a glance instead
// of requiring users to open the residence to learn how it's sold.
const OWNERSHIP_DOT = {
  gold: 'bg-baden-gold-bright',
  sea: 'bg-baden-sea',
  teal: 'bg-baden-teal',
};

function OwnershipTags({ ownership, isRu, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {ownership.map((key) => {
        const m = OWNERSHIP_MODELS[key];
        if (!m) return null;
        return (
          <span key={key} className="inline-flex items-center gap-1.5 text-[11px] tracking-wide uppercase text-baden-cream/75">
            <span className={`h-1.5 w-1.5 rounded-full ${OWNERSHIP_DOT[m.accent]}`} aria-hidden />
            {isRu ? m.ru.short : m.en.short}
          </span>
        );
      })}
    </div>
  );
}

// A single card in the horizontally-scrolling rail.
function PropertyCard({ unit, index, isRu }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group shrink-0 snap-start w-[78vw] sm:w-[380px]"
    >
      <Link to={`/residence/${unit.id}`} className="block">
        <Tilt3D max={6} scale={1.015} className="relative h-64 sm:h-72 overflow-hidden rounded-2xl">
          <img
            src={unit.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
            style={{ objectPosition: positionFor(unit.image), transform: 'translateZ(0)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" aria-hidden />
          <GlassSheen />
          <span
            className="absolute top-4 left-4 inline-flex items-center gap-2 text-[11px] tracking-widest2 uppercase text-baden-cream bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
            style={{ transform: 'translateZ(40px)' }}
          >
            {String(index + 1).padStart(2, '0')} · {isRu ? unit.location.ru : unit.location.en}
          </span>
          <span
            className="absolute bottom-4 right-4 text-right drop-shadow"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="block text-[10px] tracking-widest2 uppercase text-baden-cream/60">{isRu ? 'Владеть от' : 'Own from'}</span>
            <span className="font-display text-lg text-baden-cream">{formatEUR(unit.entryFrom)}</span>
          </span>
        </Tilt3D>

        <div className="pt-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="font-display font-normal text-xl md:text-2xl text-baden-cream group-hover:text-baden-gold-bright transition-colors duration-300">
              {isRu ? unit.name.ru : unit.name.en}
            </h3>
          </div>
          <OwnershipTags ownership={unit.ownership} isRu={isRu} className="mb-3" />
          <p className="text-sm text-baden-muted mb-4 line-clamp-2">
            {isRu ? unit.blurb.ru : unit.blurb.en}
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-baden-muted">
              <span>{unit.size}</span>
              <span className="h-3 w-px bg-baden-line" />
              <span>{unit.guests} {isRu ? 'чел.' : 'guests'}</span>
            </div>
            <span className="text-xs text-baden-muted whitespace-nowrap">
              {isRu ? 'от ' : 'from '}{formatEUR(minPrice(unit))}{isRu ? '/мес' : '/mo'}
            </span>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-cream border-b border-baden-cream/25 pb-0.5 group-hover:border-baden-gold-bright group-hover:text-baden-gold-bright transition-colors duration-200">
            {isRu ? 'Смотреть' : 'View'} <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// Circular scroll-nav arrow.
function RailArrow({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      className="h-11 w-11 shrink-0 rounded-full border border-baden-line flex items-center justify-center text-baden-cream hover:border-baden-gold-bright hover:text-baden-gold-bright transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`}>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

export default function Properties() {
  const { isRu } = useLanguage();

  const railRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const amount = (card ? card.getBoundingClientRect().width : 360) + 24;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="properties" className="relative bg-baden-panel py-24 md:py-32 overflow-hidden">
      <div className="absolute -top-32 right-0 h-[20rem] w-[18rem] rounded-full bg-baden-sea/[0.08] blur-[100px] pointer-events-none" aria-hidden />
      <div className="max-w-8xl mx-auto px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
              <span className="h-px w-8 bg-baden-gold" />
              {isRu ? 'Выбор резиденций' : 'A curated selection'}
            </Reveal>
            <h2 className="font-display font-light text-4xl md:text-6xl text-baden-cream leading-[1.02] tracking-[-0.02em]">
              <RevealLines
                lines={isRu ? ['Пять объектов,', <>три способа <span className="italic text-baden-gold-bright">владеть</span></>] : ['Five properties,', <>three ways to <span className="italic text-baden-gold-bright">own</span></>]}
              />
            </h2>
          </div>
          {/* Scroll controls */}
          <div className="hidden md:flex items-center gap-3">
            <RailArrow dir="left" onClick={() => scrollByCard('left')} disabled={!canLeft} />
            <RailArrow dir="right" onClick={() => scrollByCard('right')} disabled={!canRight} />
          </div>
        </div>

        <motion.div
          ref={railRef}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6 md:-mx-10 md:px-10"
        >
          {UNITS.map((unit, i) => (
            <div key={unit.id} data-card>
              <PropertyCard unit={unit} index={i} isRu={isRu} />
            </div>
          ))}
        </motion.div>

        {/* Mobile scroll controls, under the rail */}
        <div className="flex md:hidden items-center gap-3 mt-6">
          <RailArrow dir="left" onClick={() => scrollByCard('left')} disabled={!canLeft} />
          <RailArrow dir="right" onClick={() => scrollByCard('right')} disabled={!canRight} />
        </div>
      </div>
    </section>
  );
}
