import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines } from './motion';
import groundsImg from '../assets/images/image.png';

// The transaction, as a factual sequence — kept to labels only, no
// per-step descriptions.
const PROCESS = [
  { ru: 'Проверка объекта', en: 'Due diligence' },
  { ru: 'Нотариус', en: 'Notary' },
  { ru: 'Регистрация ТАПУ', en: 'TAPU registration' },
  { ru: 'Передача владения', en: 'Handover' },
];

// Short badges, no sentences — the detail lives in the documents below
// instead of being spelled out here.
const BADGES = [
  { ru: 'Официальный ТАПУ', en: 'Official TAPU' },
  { ru: 'Юрист на сделке', en: 'Lawyer on every deal' },
  { ru: 'Полная документация', en: 'Full documentation' },
];

// What's in the document pack. The three ownership-type contracts
// (full/fractional/timeshare) carry the SAME accent keys ('gold' | 'teal' |
// 'rust') as OWNERSHIP_MODELS in src/data/units.js, and the same accent map
// used by Properties.js / HowItWorks.js / OwnershipVisualizer.js — kept in
// sync deliberately so a visitor learns "gold = full, teal = fractional,
// rust = timeshare" once and it holds everywhere. The company profile /
// price list are not ownership-type documents, so they stay neutral
// (accent: null).
//
// These used to render as five rows, each with its own disabled "СКОРО"
// download button. Five dead CTAs in a column is the single least persuasive
// thing you can put in a section whose entire job is to establish that this
// is a real company with real paperwork — it reads as "nothing here yet"
// five times over. Same information, stated once and honestly: this is what
// the pack contains, and you get it by asking. No download affordance at all
// until there are actual files to download.
const DOCS = [
  { key: 'full', accent: 'full', ru: 'Договор: полное владение', en: 'Full ownership: sample contract' },
  { key: 'fractional', accent: 'fractional', ru: 'Договор: дробное владение (ТАПУ)', en: 'Fractional ownership: TAPU agreement' },
  { key: 'timeshare', accent: 'timeshare', ru: 'Договор: таймшер', en: 'Timeshare: usage agreement' },
  { key: 'profile', accent: null, ru: 'О компании Baden Premium Projects', en: 'Baden Premium Projects: company profile' },
  { key: 'pricing', accent: null, ru: 'Прайс-лист и условия оплаты', en: 'Price list & payment terms' },
];

// Same three-color ownership system as Properties.js / HowItWorks.js /
// OwnershipVisualizer.js (see src/data/units.js OWNERSHIP_MODELS). This
// section sits on the DARK surface, like Properties, so the marker uses the
// dark-surface-weight variants rather than the -ink ones.
const ACCENT_DOT = {
  full: 'bg-baden-own-full',
  fractional: 'bg-baden-own-frac',
  timeshare: 'bg-baden-own-share',
};

// Documents & legal — one of the page's light beats (alongside Properties
// and Audiences; Statement moved back to dark navy). Sits on baden-ivory
// rather than another navy shade, deliberate against a page that otherwise
// cycles dark/dark-2/dark-3/black: a trust/legal section reading like an
// actual paper deed is a better fit for the content than one more dark
// panel.
//
// Structural notes carried over from the previous pass: the reading column
// stays `max-w-3xl`-equivalent (`max-w-7xl` grid, prose capped per-block)
// rather than the page's default `max-w-8xl`, and vertical rhythm is kept
// tight (mb-10/12, mb-12/16) rather than the ~200px gaps an earlier version
// had.
//
// NEW — the architectural render breaks the grid on purpose: every other
// image on the page sits inside its section's max-width column, so this one
// runs wider than the text above and below it (its own `max-w-[100rem]`
// wrapper, outside the `max-w-7xl` reading column). One deliberate width
// break is a considered layout choice; the same trick on every section would
// just be a new default.
export default function LegalTrust() {
  const { isRu } = useLanguage();
  return (
    <section id="trust" className="relative overflow-hidden bg-baden-ivory py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 relative md:px-10">
        <h2 className="mb-6 max-w-4xl font-display text-3xl font-light leading-[1.1] tracking-tight text-baden-ink md:text-5xl">
          <RevealLines
            lines={
              isRu
                ? ['Полностью официальная сделка, оформляется ТАПУ на ваше имя.']
                : ['A fully official transaction, with a TAPU registered in your name.']
            }
          />
        </h2>

        {/* Short trust badges in simple row */}
        <Reveal className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-2">
          {BADGES.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-baden-ink/60 md:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-baden-brand-deep" />
              {isRu ? b.ru : b.en}
            </span>
          ))}
        </Reveal>

        {/* Process timeline — minimal typographic timeline */}
        <Reveal className="mb-16 max-w-4xl md:mb-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
            {PROCESS.map((p, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs tabular-nums text-baden-brand-deep/70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[11px] tracking-widest2 uppercase text-baden-ink/70">{isRu ? p.ru : p.en}</span>
                </div>
                {i < PROCESS.length - 1 && (
                  <span className="mx-2 hidden h-px flex-1 bg-baden-ink-line sm:block" aria-hidden />
                )}
              </React.Fragment>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Large architectural render — the one deliberate width break (see
          header note): its own wider column, not the section's max-w-7xl. */}
      <div className="mx-auto mb-16 max-w-[100rem] px-4 md:mb-24 md:px-8">
        <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-panel md:aspect-[2.6/1]">
          <img
            src={groundsImg}
            alt="Baden architectural grounds render"
            className="h-full w-full object-cover opacity-90 grayscale-[0.15] transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-baden-ink/45 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Developer Story — Staggered Editorial Hero.
            Baden Premium Projects IS a German company — kept to one plain
            sentence rather than spelling out the corporate structure. */}
        <div className="mb-20 grid grid-cols-1 items-start gap-8 md:mb-28 md:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="mb-3 block text-xs uppercase tracking-widest3 text-baden-brand-deep">
              {isRu ? 'Немецкая компания' : 'A German Company'}
            </span>
            <h3 className="font-display font-light text-4xl leading-[1.05] tracking-tight text-baden-ink md:text-5xl lg:text-6xl">
              PP Projektentwicklung GmbH
            </h3>
            <p className="mt-3 text-sm uppercase tracking-widest2 text-baden-ink/45">
              {isRu ? 'Германия' : 'Germany'}
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 lg:col-span-6">
            <p className="text-base font-light leading-relaxed text-baden-ink/65 md:text-lg">
              {isRu
                ? 'Baden Premium Projects — немецкая компания. Немецкое качество и инженерия — в основе каждого проекта портфеля.'
                : 'Baden Premium Projects is a German company. German quality and engineering are at the core of every project in the portfolio.'}
            </p>
            <div>
              <a
                href="https://premium-projektentwicklung.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-baden-brand-deep border-b border-baden-brand-deep/25 pb-1 transition-all duration-300 hover:border-baden-brand-deep"
              >
                {isRu ? 'Официальный сайт' : 'Developer Website'}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Document Pack — sits on its own faint ivory-2 tint, the one
            partial-background variation inside this section: a panel one
            shade deeper than the page, not another dark box. */}
        <div className="grid grid-cols-1 gap-8 rounded-panel border border-baden-ink-line bg-baden-ivory-2/60 p-6 md:gap-16 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h4 className="mb-3 font-display text-2xl font-light text-baden-ink">
              {isRu ? 'Пакет документов' : 'The Document Pack'}
            </h4>
            <p className="max-w-sm text-sm leading-relaxed text-baden-ink/55">
              {isRu
                ? 'Все материалы предоставляются по запросу, вместе с финансовым расчетом по выбранному объекту.'
                : 'All materials are available upon request, complete with financial breakdowns for your selected unit.'}
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-8">
            <ul className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
              {DOCS.map((doc) => (
                <li key={doc.key} className="flex items-start gap-3 py-1 text-sm text-baden-ink/85">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${doc.accent ? ACCENT_DOT[doc.accent] : 'bg-baden-ink/25'}`}
                    aria-hidden
                  />
                  <span className="font-sans leading-tight">{isRu ? doc.ru : doc.en}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-baden-ink/65 border-b border-baden-ink-line pb-1 transition-all duration-300 hover:border-baden-ink/50 hover:text-baden-ink"
              >
                {isRu ? 'Запросить пакет документов' : 'Request documents pack'}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
