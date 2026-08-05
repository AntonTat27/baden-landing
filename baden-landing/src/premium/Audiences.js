import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HOTEL_IMG, LAGOON_IMG, poolImg, positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, EASE } from './motion';

// One accent, not three (guide's new mandate) — the three scenarios no
// longer get distinct hues. `tagline` is a short, punchy line (no numbers,
// no ROI/legal claims — this is a real-estate/immigration product, so
// anything quantitative here would need client sign-off first) used as an
// editorial pull-quote over the photo.
//
// IMAGE PAIRING — the pull-quote is overlaid directly on the photo, so the
// two have to agree. They did not: "Шаг ближе к жизни у моря" / "One step
// closer to a life by the sea" was set over the resort's indoor restaurant
// render, and the investment scenario was on the hamam interior. Both of
// those images also belong to Amenities, which is where they actually
// illustrate something (the restaurant IS the "Ресторан и детский клуб"
// card, the hamam IS the "Хамам и массаж" card) — reusing them here meant
// the same two interiors appeared twice on one page under unrelated
// captions.
//
// Now: investment gets the resort exterior (a real, physical, income-earning
// building — the closest thing available to "a real asset"), relocation gets
// open coastline (a life by the sea, literally), and leisure keeps the
// outdoor pool.
//
// That resolves the caption/image contradictions, but NOT every duplicate:
// poolImg is still shown here and again as the Amenities pool card, because
// the asset pool is exhausted (the other four remote images are each already
// spoken for by a residence in src/data/units.js). Reusing the pool at least
// doesn't lie — an outdoor pool genuinely illustrates both "the resort has a
// pool" and "your place by the sea" — whereas the restaurant-under-a-
// "life by the sea" caption did. The real fix is more photography, which is
// recorded in TODO-CONTENT.md at the project root along with the rest of the
// placeholder inventory.
const AUDIENCES = [
  {
    key: 'investment',
    image: HOTEL_IMG,
    ru: {
      tag: 'Инвестиции',
      title: 'Реальный актив, дробная цена',
      copy: 'Диверсификация в средиземноморскую недвижимость без порога входа в целый объект: рост стоимости и ликвидность через долю.',
      point: 'Доход от аренды сезона + рост цены побережья',
      tagline: 'Актив, а не абонемент',
    },
    en: {
      tag: 'Investment',
      title: 'A real asset, at a fractional price',
      copy: 'Diversify into Mediterranean real estate without the full-property price tag. Capital appreciation and liquidity, through your share.',
      point: 'Seasonal rental income + coastal appreciation',
      tagline: 'An asset, not a subscription',
    },
  },
  {
    key: 'relocation',
    image: LAGOON_IMG,
    ru: {
      tag: 'Переезд',
      title: 'Вид на жительство в Турции',
      copy: 'Доля в недвижимости даёт доступный шаг к ВНЖ для вас и семьи, в разы дешевле полноценной покупки объекта.',
      point: 'Путь к резиденции без покупки целой квартиры',
      tagline: 'Шаг ближе к жизни у моря',
    },
    en: {
      tag: 'Relocation',
      title: 'A path to Turkish residency',
      copy: 'A registered share is an accessible route toward residence permits for you and your family, at a fraction of buying a whole property.',
      point: 'Residency route without buying a whole apartment',
      tagline: 'One step closer to a life by the sea',
    },
  },
  {
    key: 'tourism',
    image: poolImg,
    ru: {
      tag: 'Отдых',
      title: 'Своё место у моря, каждый год',
      copy: 'Стабильная точка возвращения раз в год, без забот о содержании. Приезжаете, и всё готово к отдыху.',
      point: 'Гарантированные недели без аренды и хлопот',
      tagline: 'Отпуск, который у вас не отнять',
    },
    en: {
      tag: 'Leisure',
      title: 'Your place by the sea, every year',
      copy: 'A stable place to return to once a year, with none of the upkeep: you arrive, and everything is ready.',
      point: 'Guaranteed weeks, no renting, no upkeep',
      tagline: 'The holiday nobody can take away',
    },
  },
];

// An editorial reveal-list, not a tab-bar-above-a-card. Every row IS the
// control — clicking a dim label brightens it and expands its own copy
// directly beneath, in place, like a magazine table of contents rather than
// a SaaS tab strip. Hierarchy comes entirely from type weight/opacity and
// the expand/collapse itself; there is no pill, fill, box, or border
// anywhere in this control. One accent (gold-ink) marks the active row,
// not a per-scenario hue.
function ScenarioList({ active, setActive, isRu }) {
  return (
    <div className="flex flex-col">
      {AUDIENCES.map((a, i) => {
        const on = i === active;
        const t = isRu ? a.ru : a.en;
        return (
          <motion.div layout key={a.key} className="border-t border-baden-ink-line last:border-b">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={on}
              className="w-full text-left py-5 md:py-6"
            >
              <span className={`font-display text-xl md:text-2xl transition-colors duration-300 ${on ? 'text-baden-brand-deep' : 'text-baden-ink/35 hover:text-baden-ink/65'}`}>
                {t.tag}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE, opacity: { duration: 0.5 } }}
                  className="overflow-hidden"
                >
                  <div className="pb-7 md:pb-9 max-w-md">
                    <h3 className="font-display text-2xl md:text-3xl text-baden-ink mb-3 leading-snug">
                      {t.title}
                    </h3>
                    <p className="text-sm md:text-base text-baden-ink/70 leading-relaxed mb-5">
                      {t.copy}
                    </p>
                    <div className="flex items-start gap-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 shrink-0 mt-0.5 text-baden-brand-deep">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <p className="text-sm text-baden-ink/80">{t.point}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Audiences() {
  const { isRu } = useLanguage();
  const [active, setActive] = useState(1); // open on Переезд — the featured reason
  const reduce = useReducedMotion();
  const a = AUDIENCES[active];
  const t = isRu ? a.ru : a.en;

  // Lightest register on the page — this is the "rest and chill" section
  // (leisure, relocation, a slower life by the sea), so it sits on the same
  // warm-ivory ground as Statement/LegalTrust rather than the dark register
  // the surrounding sections use. It lands right after HowItWorks' dark
  // numbers-and-mechanics ground, so the tone shift itself marks "we're done
  // with the mechanics, this part is about why."
  return (
    <section id="audiences" className="relative bg-baden-ivory py-24 md:py-32 overflow-hidden border-t border-baden-ink-line">
      <div className="max-w-8xl mx-auto px-6 md:px-10 relative">
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="font-display font-light text-4xl md:text-6xl text-baden-ink leading-[1.02] tracking-[-0.02em] mb-6">
            {/* No eyebrow above the heading (craft-floor ban). The accent
                word is weight, not colour — the brand accent is reserved for
                interactive elements. */}
            <RevealLines lines={isRu ? ['Одна недвижимость,', <>три <span className="font-medium">причины</span></>] : ['One property,', <>three <span className="font-medium">reasons</span></>]} />
          </h2>
          <Reveal className="text-sm md:text-base text-baden-ink/70 max-w-xl leading-relaxed">
            {isRu
              ? 'Собственники Baden приходят за разным. Выберите сценарий слева, и он раскроется здесь же.'
              : 'Baden owners come for different reasons. Pick a scenario on the left and it opens right where it is.'}
          </Reveal>
        </div>

        {/* Editorial two-up: a reveal-list stands in for tabs on the left,
            a single sticky photo carries the imagery on the right — instead
            of a tab-bar sitting above a separate card. */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 lg:gap-20 items-start">
            <ScenarioList active={active} setActive={setActive} isRu={isRu} />

            <div className="relative rounded-panel overflow-hidden border border-baden-ink-line h-64 sm:h-80 md:h-[26rem] lg:h-[30rem] md:sticky md:top-28">
              <AnimatePresence mode="sync">
                <motion.img
                  key={a.key}
                  src={a.image}
                  alt=""
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  style={{ objectPosition: positionFor(a.image) }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" aria-hidden />
              {/* Editorial pull-quote, not a stat — no invented figures next
                  to a product that already carries real legal/financial
                  disclaimers elsewhere on the page. */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={a.key}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 font-display font-light text-lg md:text-xl text-baden-on-dark"
                  style={{ textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}
                >
                  {t.tagline}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
