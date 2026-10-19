import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { OWNERSHIP_MODELS } from '../data/units';
import { VILLA_IMG, RESIDENCES_IMG, HOTEL_IMG, positionFor } from '../assets/imagePositions';
import { Reveal, RevealLines, EASE } from './motion';
import OwnershipVisualizer from './OwnershipVisualizer';

// The ownership legend, on the dark surface. Reused wherever ownership type
// appears (residence-card dots in Properties, this row switcher, the donut in
// OwnershipVisualizer, the document bullets in LegalTrust). The `accent` key
// on each OWNERSHIP_MODELS entry (data/units.js) is the single source of
// truth these maps key off of.
//
// These are own-* tokens, never brand-*. The distinction is load-bearing: the
// brand accent means "you can click this", these three mean "this is how the
// property is sold" — three distinct hues (gold/teal/rust), since this is
// data encoding for three different legal things, not a decorative accent.
// `glow` replaces a flat `tint` fill: a soft radial spotlight seated at the
// row's left edge (where the colour bar already lives) rather than an even
// wash across the whole row, so the active row's own background visibly
// varies left-to-right instead of being one flat tinted rectangle — the
// highlight actually points at something (the bar + label) rather than just
// recolouring a box.
const ACCENT = {
  full: {
    text: 'text-baden-own-full',
    bar: 'bg-baden-own-full',
    border: 'border-baden-own-full/60',
    glow: 'radial-gradient(120% 140% at 0% 50%, rgba(217,166,83,0.16) 0%, rgba(217,166,83,0.04) 45%, transparent 75%)',
  },
  fractional: {
    text: 'text-baden-own-frac',
    bar: 'bg-baden-own-frac',
    border: 'border-baden-own-frac/60',
    glow: 'radial-gradient(120% 140% at 0% 50%, rgba(79,165,172,0.16) 0%, rgba(79,165,172,0.04) 45%, transparent 75%)',
  },
  timeshare: {
    text: 'text-baden-own-share',
    bar: 'bg-baden-own-share',
    border: 'border-baden-own-share/60',
    glow: 'radial-gradient(120% 140% at 0% 50%, rgba(204,112,133,0.16) 0%, rgba(204,112,133,0.04) 45%, transparent 75%)',
  },
};

// A representative photo per model, reused from the residences section
// (VILLA_IMG is Villa Aurelia, sold as full ownership; RESIDENCES_IMG is
// Marea's shared infinity pool, sold fractionally; HOTEL_IMG is Beyzade
// Resort, sold as timeshare) rather than new stock — grounds each abstract
// legal concept in an actual Baden place.
const MODEL_IMAGE = { full: VILLA_IMG, fractional: RESIDENCES_IMG, timeshare: HOTEL_IMG };

// 2-3 plain sentences + 2-3 checkmark benefit lines per model — the same
// "here's what this means for you" pattern already used in Audiences.js,
// replacing the old 01-04 numbered step list (that read as a process to
// complete rather than a choice to understand).
const MODEL_DETAILS = {
  full: {
    ru: {
      body: 'Резиденция становится вашей полностью. Недвижимость в вашем распоряжении круглый год.',
      benefits: ['Единоличное владение.', 'Свободная продажа или передача по наследству', 'Доступен в любое время года'],
    },
    en: {
      body: 'The residence becomes fully yours. The property is at your disposal year-round.',
      benefits: ['Sole ownership', 'Free resale or inheritance', 'Available any time of year'],
    },
  },
  fractional: {
    ru: {
      body: 'Официально зарегистрированная доля в объекте: ТАПУ на ваше имя и собственные недели каждый год. Дешевле полной покупки, но с теми же правами: продать, передать, сдать. Управление, клининг и сервис на месте уже включены.',
      benefits: ['ТАПУ на долю, официальное право собственности', 'Свои недели закреплены каждый год', 'Доход от аренды сезона + рост цены побережья'],
    },
    en: {
      body: 'A legally registered share of the property: a title (TAPU) in your name, with set weeks every year. Cheaper than buying outright, with the same rights: sell it, pass it on, rent it out. On-site management, cleaning, and service are already included.',
      benefits: ['A registered TAPU, real title rather than a contract', 'Your own weeks, locked in every year', 'Seasonal rental income + coastal appreciation'],
    },
  },
  timeshare: {
    ru: {
      body: 'Право пользования определёнными неделями каждый год. Самый доступный порог входа в портфель Baden. Управление, клининг и сервис на месте уже включены.',
      benefits: ['Низкий порог входа', 'Управление и клининг включены', 'Недели закреплены по договору'],
    },
    en: {
      body: 'The right to use specific weeks every year. The most accessible entry point into the Baden portfolio. On-site management, cleaning, and service are already included.',
      benefits: ['The lowest entry point in the portfolio', 'Management and cleaning included', 'Weeks locked in by contract'],
    },
  },
};

const CheckIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Each ownership type is a full-width row that is simultaneously the tab
// control and the content: the label + one-line definition are always
// visible (so an inactive row is still communicating something), and
// clicking expands 2-3 sentences, a few checkmark benefits, and a small
// representative photo directly beneath it — accordion-style, like the
// Audiences scenario list, rather than a separate tab bar sitting above a
// card.
function ModelRow({ modelKey, m, active, onSelect, isRu, reduce }) {
  const a = ACCENT[m.accent];
  const d = MODEL_DETAILS[modelKey][isRu ? 'ru' : 'en'];

  return (
    <div
      className={`relative flex border rounded-panel overflow-hidden transition-colors duration-300 ${
        active ? a.border : 'border-baden-line'
      }`}
      style={{ background: active ? a.glow : 'transparent' }}
    >
      <span className={`w-1 shrink-0 ${a.bar}`} aria-hidden />
      <div className="flex-1">
        <button type="button" onClick={() => onSelect(modelKey)} aria-expanded={active} className="w-full text-left px-5 md:px-7 py-5 md:py-6">
          <span className={`block font-display text-xl md:text-2xl mb-1 transition-colors duration-300 ${active ? a.text : 'text-baden-on-dark/75'}`}>
            {isRu ? m.ru.label : m.en.label}
          </span>
          <span className="block text-sm text-baden-on-dark/60 leading-relaxed max-w-lg">
            {isRu ? m.ru.def : m.en.def}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              key="content"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE, opacity: { duration: 0.35 } }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-7 pb-6 md:pb-7 flex flex-col sm:flex-row gap-5 md:gap-7">
                <div className="flex-1">
                  <p className="text-sm md:text-base text-baden-on-dark/80 leading-relaxed mb-4">{d.body}</p>
                  <ul className="space-y-2">
                    {d.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-baden-on-dark/85">
                        <CheckIcon className={`h-4 w-4 shrink-0 mt-0.5 ${a.text}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative shrink-0 w-full sm:w-40 md:w-48 h-32 sm:h-auto rounded-panel overflow-hidden">
                  <img
                    src={MODEL_IMAGE[modelKey]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: positionFor(MODEL_IMAGE[modelKey]) }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { isRu } = useLanguage();
  const [model, setModel] = useState('full');
  const reduce = useReducedMotion();

  // RHYTHM: py-28/py-36 against Properties' py-20/py-28 above. This is the
  // page's numbers/mechanics section, so it sits on the deepest ground
  // (baden-dark), not a lighter "raised panel" step — a deliberate contrast
  // against Properties' light ivory just above it, not one more shade in a
  // navy gradient. Separation from Properties also gets a hairline at the
  // join, a different vertical measure, the ambient photo grain below, and a
  // centred header where Properties' is left-aligned.
  return (
    <section
      id="how-it-works"
      className="relative bg-baden-dark pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden"
    >
      {/* Large, heavily darkened resort photo as ambient texture rather than
          a flat panel — barely visible, reads as atmosphere, not a picture. */}
      <img
        src={HOTEL_IMG}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.1] pointer-events-none"
        style={{
          objectPosition: positionFor(HOTEL_IMG),
          // Masked so the photo only ever shows on the right half of the
          // frame — the visualizer/list column on the left stays on a plain
          // flat ground, the section's own background genuinely differs
          // side to side rather than one uniform faint wash edge to edge.
          maskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 68%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 68%, black 100%)',
        }}
      />
      <div className="absolute inset-0 bg-baden-dark/85 pointer-events-none" aria-hidden />
      {/* PERF: blur-[110px] reduced to blur-[60px] on a slightly larger,
          slightly fainter disc — visually the same wash, a much smaller
          offscreen surface to composite. */}
      <div className="absolute top-0 right-0 h-[28rem] w-[24rem] rounded-full bg-baden-brand/[0.07] blur-[60px] pointer-events-none" aria-hidden />

      {/* The eyebrow ("Механика" / "The mechanics", flanked by two rules)
          is gone. It was one of six near-identical section eyebrows, which is
          what gave the page its templated rhythm; the headline already says
          what this section is.

          The accent word is no longer italic. Unbounded ships upright only,
          so `italic` would have asked the browser to synthesise an oblique by
          shearing the glyphs, which looks wrong at display size. Emphasis is
          now weight in the same family, which is also the correct move
          regardless of the font. */}
      <div className="max-w-8xl mx-auto px-6 md:px-10 text-center mb-12 md:mb-16 relative">
        <h2 className="font-display font-light text-3xl md:text-5xl text-baden-on-dark leading-[1.06] tracking-[-0.02em] mb-6">
          <RevealLines
            className="items-center"
            lines={isRu ? ['Три формата', <>владения <span className="font-medium">недвижимостью</span></>] : ['Three formats', <>of owning <span className="font-medium">real estate</span></>]}
          />
        </h2>
        <Reveal className="text-sm md:text-base text-baden-on-dark/70 leading-relaxed max-w-md mx-auto">
          {isRu ? 'Выберите формат. Ниже то, что он означает для вас.' : 'Pick a model. Below is what it actually means for you.'}
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative grid md:grid-cols-[260px_1fr] gap-10 md:gap-14 items-start">
        {/* The signature interaction (guide §5): one ring standing in for a
            property visibly divides as the model row changes — teaches the
            mechanic instead of just describing it. */}
        <Reveal className="flex justify-center md:justify-start md:sticky md:top-28" amount={0.2}>
          <OwnershipVisualizer model={model} isRu={isRu} size={240} />
        </Reveal>

        <div className="flex flex-col gap-3 md:gap-4">
          <Reveal>
            {Object.entries(OWNERSHIP_MODELS).map(([key, m]) => (
              <div key={key} className="mb-3 md:mb-4 last:mb-0">
                <ModelRow modelKey={key} m={m} active={key === model} onSelect={setModel} isRu={isRu} reduce={reduce} />
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-2 text-center md:text-left">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-baden-brand-bright border-b border-baden-brand/40 pb-0.5 hover:border-baden-brand hover:text-baden-brand transition-colors duration-200"
            >
              {isRu ? 'Не уверены, что подходит? Спросите нас' : "Not sure which fits? Ask us"} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
