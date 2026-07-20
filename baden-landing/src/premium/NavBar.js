import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { EASE } from './motion';

const LINKS = [
  { id: 'amenities', ru: 'Резиденция', en: 'The residence' },
  { id: 'properties', ru: 'Форматы', en: 'Formats' },
  { id: 'how-it-works', ru: 'Как это работает', en: 'How it works' },
  { id: 'audiences', ru: 'Кому подходит', en: 'Who it suits' },
  { id: 'contact', ru: 'Контакты', en: 'Contact' },
];

export default function NavBar() {
  const { lang, toggle, isRu } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          ? 'bg-baden-base/80 backdrop-blur-xl border-b border-baden-line/70'
          : 'bg-gradient-to-b from-black/40 to-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-8xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
        <a
          href="#top"
          onClick={goTo('top')}
          className="flex items-baseline gap-2 group"
        >
          <span className="font-display text-xl md:text-2xl tracking-tight text-baden-cream">Baden</span>
          <span className="hidden sm:block text-[10px] tracking-widest3 uppercase text-baden-gold-bright/80 pb-0.5">
            Premium Projects
          </span>
        </a>

        <div className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={goTo(l.id)}
              className="group relative text-sm text-baden-cream/70 hover:text-baden-cream transition-colors duration-200"
            >
              {isRu ? l.ru : l.en}
              <span className="absolute -bottom-1.5 left-0 h-px w-full bg-baden-gold-bright origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="text-xs tracking-widest text-baden-cream/90 border border-baden-cream/25 px-3 py-1.5 rounded-full hover:border-baden-gold-bright hover:text-baden-gold-bright transition-colors duration-200"
          >
            {lang === 'ru' ? 'RU · EN' : 'EN · RU'}
          </button>
          <a
            href="#contact"
            onClick={goTo('contact')}
            className="hidden md:inline-flex items-center text-xs tracking-widest uppercase text-baden-base bg-baden-gold-bright px-5 py-2.5 rounded-full hover:bg-baden-cream transition-colors duration-300"
          >
            {isRu ? 'Консультация' : 'Book a call'}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 w-6 items-end"
            aria-label="Menu"
          >
            <span className={`h-px bg-baden-cream transition-all duration-300 ${open ? 'w-6 translate-y-2 rotate-45' : 'w-6'}`} />
            <span className={`h-px bg-baden-cream transition-all duration-300 ${open ? 'opacity-0' : 'w-4'}`} />
            <span className={`h-px bg-baden-cream transition-all duration-300 ${open ? 'w-6 -translate-y-2 -rotate-45' : 'w-5'}`} />
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
            className="md:hidden overflow-hidden bg-baden-base/95 backdrop-blur-xl border-b border-baden-line"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={goTo(l.id)}
                  className="font-display text-2xl text-baden-cream/80 hover:text-baden-cream"
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
