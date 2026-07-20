import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { heroImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { EASE, stagger, lineReveal } from './motion';

// Slow, warm light drifting across the backdrop — a few soft blurred glows
// in amber/terracotta, not geometric shapes. Reads as sun and atmosphere
// rather than a tech/WebGL effect. Skipped under prefers-reduced-motion.
function AmbientLight({ reduce }) {
  if (reduce) return null;
  const glows = [
    { size: 420, top: '8%', left: '68%', color: 'rgba(232,192,119,0.22)', duration: 22 },
    { size: 340, top: '55%', left: '12%', color: 'rgba(194,78,41,0.16)', duration: 28 },
    { size: 300, top: '30%', left: '40%', color: 'rgba(31,122,140,0.10)', duration: 34 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {glows.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[90px]"
          style={{ width: g.size, height: g.size, top: g.top, left: g.left, background: g.color }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: g.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const { isRu } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // Scroll-linked parallax: the backdrop drifts slower than the page and dims
  // as the hero leaves, so the next section feels like it slides up over it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, reduce ? 1.05 : 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-14%']);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.7]);

  // Short, upright headline — no italics, no inline price. The accent word
  // is set apart by color and weight only.
  const titleLines = isRu
    ? [<>Недвижимость</>, <span className="text-baden-gold-bright font-medium">на побережье</span>]
    : [<>Real estate</>, <span className="text-baden-gold-bright font-medium">on the coast</span>];

  // PLACEHOLDER — the term/entry figures are illustrative for the client
  // call, not confirmed. Swap in the real minimums once they're agreed.
  // (Properties count + models count are accurate as of this build.)
  const stats = [
    { label: isRu ? 'Минимальный срок' : 'Minimum term', value: isRu ? '1 неделя' : '1 week' },
    { label: isRu ? 'Вход от' : 'Entry from', value: '€5,000' },
  ];

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-baden-base">
      {/* Parallax backdrop with a slow ambient Ken Burns drift */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <img
          src={heroImg}
          alt="Baden Premium Projects — курортная резиденция на побережье Турции"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: positionFor(heroImg), animation: reduce ? 'none' : 'kenburns 26s ease-in-out infinite alternate' }}
        />
      </motion.div>

      {/* Grading + legibility washes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" aria-hidden />
      <div className="absolute inset-0 bg-baden-sea-deep/20 mix-blend-multiply" aria-hidden />

      <AmbientLight reduce={reduce} />

      <motion.div className="absolute inset-0 bg-black" style={{ opacity: dim }} aria-hidden />
      <div className="absolute inset-0 opacity-[0.10] bg-grain mix-blend-overlay pointer-events-none" aria-hidden />

      {/* Foreground content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex h-full flex-col justify-end max-w-8xl mx-auto px-6 md:px-10 pb-16 md:pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="flex items-center gap-3 text-xs md:text-sm tracking-widest2 uppercase text-baden-cream/70 mb-6"
        >
          <span className="h-px w-8 bg-baden-gold-bright" />
          {isRu ? 'Турецкая Ривьера' : 'Turkish Riviera'}
        </motion.p>

        <motion.h1
          variants={stagger(0.14, 0.45)}
          initial="hidden"
          animate="show"
          className="font-display font-light text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.5rem] text-baden-cream max-w-5xl tracking-[-0.02em]"
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineReveal} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
          className="mt-6 max-w-md text-base md:text-lg text-baden-cream/75 leading-relaxed"
        >
          {isRu ? 'Купить целиком, долю или таймшер.' : 'Buy it outright, own a share, or take it a week at a time.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
          className="mt-8 grid grid-cols-2 sm:inline-flex sm:items-stretch gap-x-6 gap-y-4 rounded-2xl border border-baden-cream/15 bg-black/25 backdrop-blur-sm px-6 py-4 w-fit"
        >
          {stats.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="hidden sm:block w-px bg-baden-cream/15" aria-hidden />}
              <div>
                <p className="text-[10px] tracking-widest2 uppercase text-baden-cream/50 mb-1">{s.label}</p>
                <p className="font-display text-xl md:text-2xl text-baden-cream">{s.value}</p>
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.15 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#properties"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('properties')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }}
            className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-baden-base bg-baden-gold-bright px-7 py-4 rounded-full hover:bg-baden-cream transition-colors duration-300"
          >
            {isRu ? 'Смотреть резиденции' : 'View the residences'}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-baden-cream/90"
          >
            <span className="relative pb-1">
              {isRu ? 'Как устроено владение' : 'How ownership works'}
              <span className="absolute left-0 bottom-0 h-px w-full bg-baden-cream/30" />
              <span className="absolute left-0 bottom-0 h-px w-full bg-baden-cream origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] tracking-widest3 text-baden-cream/50">{isRu ? 'ВНИЗ' : 'SCROLL'}</span>
        <span className="relative h-10 w-px overflow-hidden bg-baden-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-baden-gold-bright animate-[scrollcue_1.8s_ease-in-out_infinite]" />
        </span>
      </motion.div>
    </section>
  );
}
