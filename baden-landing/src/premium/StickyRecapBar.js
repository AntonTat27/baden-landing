import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { UNITS, formatEUR } from '../data/units';
import { EASE } from './motion';

// Mobile-only sticky recap bar (guide §10): a mobile visitor loses the
// hero's best hook the moment they scroll, more than a desktop visitor does.
// This pins a compact "from €X · СМОТРЕТЬ →" bar to the bottom of the
// viewport once they've scrolled past the hero, giving them the entry price
// and a one-tap route to the contact form at all times. Hidden on md+ (the
// desktop navbar already keeps a persistent CTA visible).

// Cheapest entry across the whole portfolio — the honest "from" hook.
const FROM = Math.min(...UNITS.map((u) => u.entryFrom));

export default function StickyRecapBar() {
  const { isRu } = useLanguage();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // Show once the user has scrolled roughly past the hero. 1.4 viewport
  // heights is generous enough that the bar does not flash during the hero
  // reveal itself.
  // SCROLL SOURCE: framer-motion's useScroll, not a raw window scroll
  // listener. A bare addEventListener('scroll') fires on every scroll frame
  // with no batching and drives a React state update from it, which
  // re-renders on each frame; useScroll reads from a motion value outside
  // the render cycle and useMotionValueEvent only calls back when the value
  // actually changes.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > window.innerHeight * 1.4));

  const goToContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: '120%', opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '120%', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="md:hidden fixed bottom-0 inset-x-0 z-40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-full border border-baden-line bg-baden-dark/95 px-5 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
            <div className="leading-tight">
              <span className="block text-[10px] tracking-widest2 uppercase text-baden-on-dark/55">
                {isRu ? 'Владеть от' : 'Own from'}
              </span>
              <span className="font-display text-lg text-baden-on-dark">{formatEUR(FROM)}</span>
            </div>
            <a
              href="#contact"
              onClick={goToContact}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-brand-bright border border-baden-brand/50 px-5 py-2.5 rounded-full hover:bg-baden-brand/10 active:scale-[0.97] transition-all duration-150"
            >
              {isRu ? 'Консультация' : 'Book a call'} <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
