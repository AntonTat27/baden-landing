import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { EASE } from './motion';

// LEFT PROGRESS RAIL
// ---------------------------------------------------------------------------
// Replaces NavBar's section links once the visitor has scrolled past the
// hero, rather than stacking a second nav next to the first: NavBar keeps
// only brand / language / the consultation CTA past that point (see
// NavBar.js), and this rail becomes the page's one wayfinding element. A
// numbered list is normally refused (see craft-floor "Refuse" — section
// numbers are a default, not automatically earned) but here the sequence is
// the actual information: it tells a visitor how far into a guided,
// considered journey they are, which is the concierge framing the brief
// asked for, not decoration.
// `tone` names each section's own surface (light `baden-ivory` vs a dark
// register) so the rail can recolor itself for whichever section is
// currently active — it used to be one fixed `on-dark` palette, which
// disappeared entirely over Properties/Audiences/LegalTrust once those
// sections moved to the light ivory ground.
const SECTIONS = [
  { id: 'amenities', ru: 'Резиденция', en: 'The residence', tone: 'dark' },
  { id: 'properties', ru: 'Форматы', en: 'Formats', tone: 'light' },
  { id: 'how-it-works', ru: 'Владение', en: 'Ownership', tone: 'dark' },
  { id: 'audiences', ru: 'Кому подходит', en: 'Who it suits', tone: 'light' },
  { id: 'trust', ru: 'Документы', en: 'Documents', tone: 'light' },
  { id: 'contact', ru: 'Консультация', en: 'Consultation', tone: 'dark' },
  { id: 'faq', ru: 'Вопросы', en: 'Questions', tone: 'dark' },
];

// Two small palettes, keyed by tone, rather than sprinkling ternaries through
// the markup below.
const TONE = {
  dark: {
    line: 'border-baden-on-dark/15',
    dot: 'bg-baden-on-dark/25 group-hover:bg-baden-on-dark/50',
    dotActive: 'bg-baden-on-dark/80',
    label: 'text-baden-on-dark/70',
  },
  light: {
    line: 'border-baden-ink-line',
    dot: 'bg-baden-ink/25 group-hover:bg-baden-ink/50',
    dotActive: 'bg-baden-ink/80',
    label: 'text-baden-ink/70',
  },
};

export default function SectionRail() {
  const { isRu } = useLanguage();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);
  const ratios = useRef(new Map());

  // Rail appears once the hero has scrolled fully past — matches the point
  // NavBar drops its link row, so exactly one wayfinding element is ever on
  // screen at a time.
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: '-64px 0px 0px 0px',
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Active section = whichever tracked section currently has the greatest
  // intersection ratio, rather than "first one that appears" — steadier
  // under fast scrolls and short sections.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.current.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = null;
        let bestRatio = 0;
        ratios.current.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-15% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const tone = TONE[SECTIONS.find((s) => s.id === active)?.tone || 'dark'];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          // y is a constant -50% (the vertical-centering transform), carried
          // in the SAME `x`/`y` transform framer already owns for the
          // entrance slide — not Tailwind's `-translate-y-1/2` utility.
          // Framer writes the element's `transform` style directly, which
          // silently replaced (not merged with) that utility's own
          // `transform: translateY(-50%)`, leaving the rail's Y position
          // undefined (effectively top-of-box, not centered) despite
          // `top-1/2` correctly placing its top edge at viewport-middle.
          initial={{ opacity: 0, x: -12, y: '-50%' }}
          animate={{ opacity: 1, x: 0, y: '-50%' }}
          exit={{ opacity: 0, x: -12, y: '-50%' }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-label={isRu ? 'Разделы страницы' : 'Page sections'}
          className="fixed left-8 top-1/2 z-40 hidden xl:block"
        >
          {/* No visible labels — a quiet line of dots, not a list of words.
              Each section's name still exists for anyone who needs it
              (aria-label on the link, a tooltip on hover for a sighted mouse
              user), it just isn't sitting on the page permanently as text.
              Longer and thinner than the previous version: more vertical
              travel between dots (gap-11 instead of gap-6) so it reads as a
              rail running the height of the viewport, and a fainter line/
              smaller dots so it recedes rather than competing with the
              page's own content. */}
          <ol className={`relative flex flex-col gap-11 border-l py-4 transition-colors duration-300 ${tone.line}`}>
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id} className="relative">
                  <a
                    href={`#${s.id}`}
                    onClick={goTo(s.id)}
                    aria-label={isRu ? s.ru : s.en}
                    className="group relative -ml-px flex items-center py-2 pl-4"
                  >
                    <span
                      className={`absolute left-0 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300 ${
                        isActive ? `scale-[1.8] ${tone.dotActive}` : tone.dot
                      }`}
                    />
                    {/* Name only ever appears on hover/focus, as a small
                        tooltip offset to the right — never part of the
                        rail's resting state. */}
                    <span
                      className={`pointer-events-none absolute left-4 whitespace-nowrap text-[10px] tracking-wide opacity-0 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${tone.label}`}
                      aria-hidden
                    >
                      {isRu ? s.ru : s.en}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
