import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { EASE } from './motion';

const LINKS = [
  { id: 'amenities', ru: 'Резиденция', en: 'The residence' },
  { id: 'how-it-works', ru: 'Форматы', en: 'Formats' },
  { id: 'audiences', ru: 'Кому подходит', en: 'Who it suits' },
  { id: 'trust', ru: 'Документы', en: 'Docs' },
  { id: 'contact', ru: 'Контакты', en: 'Contact' },
];

export default function NavBar() {
  const { lang, toggle, isRu } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  // Past the hero, SectionRail (fixed, left edge) becomes the page's
  // wayfinding element — this bar drops its center link row rather than
  // stacking a second nav next to the rail. See SectionRail.js.
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // SCROLL SOURCE: framer-motion's useScroll, not a raw window scroll
  // listener. A bare addEventListener('scroll') fires on every scroll frame
  // with no batching and drives a React state update from it, which
  // re-renders on each frame; useScroll reads from a motion value outside
  // the render cycle and useMotionValueEvent only calls back when the value
  // actually changes.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
    setPastHero(y > (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 640));
  });

  const goTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ y: reduce ? 0 : -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-baden-dark/50 backdrop-blur-xl border-b border-baden-line'
          : 'bg-gradient-to-b from-black/40 to-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-8xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-[4.75rem]">
        <a href="#top" onClick={goTo('top')} className="flex items-baseline gap-2 group">
          <span className="font-display text-xl md:text-2xl tracking-tight text-baden-on-dark">Baden</span>
          <span className="hidden sm:block text-[10px] tracking-widest3 uppercase pb-0.5 text-baden-brand-bright">
            Premium Projects
          </span>
        </a>

        <div
          className={`hidden md:flex items-center gap-9 transition-opacity duration-300 ${
            pastHero ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={pastHero}
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={goTo(l.id)}
              tabIndex={pastHero ? -1 : 0}
              className="group relative text-sm text-baden-on-dark/80 hover:text-baden-on-dark transition-colors duration-200"
            >
              {isRu ? l.ru : l.en}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-baden-brand-bright group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="text-xs tracking-widest px-3 py-1.5 rounded-full border border-baden-on-dark/25 text-baden-on-dark/85 hover:border-baden-brand hover:text-baden-brand transition-colors duration-200"
          >
            {lang === 'ru' ? 'RU · EN' : 'EN · RU'}
          </button>
          <a
            href="#contact"
            onClick={goTo('contact')}
            className="hidden md:inline-flex items-center text-xs tracking-widest2 uppercase text-baden-brand-bright border border-baden-brand/50 px-5 py-2.5 rounded-full hover:bg-baden-brand/10 hover:border-baden-brand transition-colors duration-300"
          >
            {isRu ? 'Консультация' : 'Book a call'}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 w-6 items-end"
            aria-label="Menu"
          >
            <span className={`h-px bg-baden-on-dark transition-all duration-300 ${open ? 'w-6 translate-y-2 rotate-45' : 'w-6'}`} />
            <span className={`h-px bg-baden-on-dark transition-all duration-300 ${open ? 'opacity-0' : 'w-4'}`} />
            <span className={`h-px bg-baden-on-dark transition-all duration-300 ${open ? 'w-6 -translate-y-2 -rotate-45' : 'w-5'}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="md:hidden overflow-hidden bg-baden-dark/95 backdrop-blur-xl border-b border-baden-line"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={goTo(l.id)}
                  className="font-display text-2xl text-baden-on-dark/80 hover:text-baden-on-dark"
                >
                  {isRu ? l.ru : l.en}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
