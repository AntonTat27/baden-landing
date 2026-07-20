import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp, motion } from './motion';

// The transaction, as a factual sequence — reinforces the "proper way"
// message with the actual process, no invented figures.
const PROCESS = [
  { ru: 'Проверка объекта', en: 'Due diligence' },
  { ru: 'Нотариус', en: 'Notary' },
  { ru: 'Регистрация ТАПУ', en: 'TAPU registration' },
  { ru: 'Передача владения', en: 'Handover' },
];

const POINTS = [
  {
    ru: { t: 'Официальный ТАПУ', d: 'Право собственности регистрируется в кадастре Турции и заверяется у нотариуса.' },
    en: { t: 'Official TAPU deed', d: 'Ownership is registered in the Turkish land registry and notarized.' },
  },
  {
    ru: { t: 'Сопровождение сделки', d: 'Юрист ведёт вас на каждом этапе — от проверки до передачи доли.' },
    en: { t: 'Guided transaction', d: 'A lawyer walks you through every stage — from due diligence to transfer.' },
  },
  {
    ru: { t: 'Полная документация', d: 'Договор, доля и права пользования зафиксированы письменно.' },
    en: { t: 'Full documentation', d: 'The contract, share, and usage rights are all recorded in writing.' },
  },
];

export default function LegalTrust() {
  const { isRu } = useLanguage();
  return (
    <section className="relative bg-baden-panel2 py-24 md:py-32 overflow-hidden">
      {/* Ambient depth + faint diagonal, matching the treatment on the other
          sections so this one doesn't read as a bare panel. */}
      <div className="absolute -bottom-24 -left-20 h-[26rem] w-[24rem] rounded-full bg-baden-teal/[0.07] blur-[130px] pointer-events-none" aria-hidden />
      <div className="absolute -top-24 right-0 h-[24rem] w-[22rem] rounded-full bg-baden-gold/[0.06] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute inset-0 opacity-[0.05] bg-grain mix-blend-overlay pointer-events-none" aria-hidden />

      <div className="max-w-8xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center relative">
        {/* Deed / seal graphic */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-md aspect-[4/5] rounded-2xl border border-baden-line bg-gradient-to-br from-baden-panel to-baden-base p-8 md:p-10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.15] bg-grain" aria-hidden />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] tracking-widest2 uppercase text-baden-muted">TAPU · ТАПУ</span>
                <span className="text-[11px] tracking-widest2 uppercase text-baden-muted">Antalya</span>
              </div>
              <div className="space-y-3 flex-1">
                {[92, 74, 84, 60, 78].map((w, i) => (
                  <div key={i} className="h-2.5 rounded-full bg-baden-cream/8" style={{ width: `${w}%` }} />
                ))}
              </div>
              {/* Rotating seal */}
              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full text-baden-gold-bright/70"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
                  >
                    <defs>
                      <path id="sealpath" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
                    </defs>
                    <text fontSize="8" letterSpacing="2.5" fill="currentColor" className="uppercase font-grotesk">
                      <textPath href="#sealpath">BADEN PREMIUM PROJECTS · ANTALYA · TÜRKIYE ·</textPath>
                    </text>
                  </motion.svg>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-7 w-7 text-baden-gold-bright">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="font-display text-lg text-baden-cream">{isRu ? 'Доля зарегистрирована' : 'Share registered'}</p>
                  <p className="text-xs text-baden-muted">{isRu ? 'на имя собственника' : "in the owner's name"}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
            <span className="h-px w-8 bg-baden-gold" />
            {isRu ? 'Юридическая прозрачность' : 'Legal transparency'}
          </Reveal>
          <h2 className="font-display font-light text-3xl md:text-5xl text-baden-cream leading-[1.04] tracking-[-0.02em] mb-8">
            <RevealLines lines={isRu ? ['Собственность,', <>оформленная <span className="italic text-baden-gold-bright">по закону</span></>] : ['Ownership, registered', <>the <span className="italic text-baden-gold-bright">proper way</span></>]} />
          </h2>

          <motion.ul
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            {POINTS.map((p, i) => (
              <motion.li key={i} variants={fadeUp} className="flex gap-4">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-baden-teal/25 text-baden-teal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-lg text-baden-cream mb-1">{isRu ? p.ru.t : p.en.t}</p>
                  <p className="text-sm text-baden-muted leading-relaxed max-w-md">{isRu ? p.ru.d : p.en.d}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Process timeline strip — the sequence, from first look to keys. */}
      <Reveal className="max-w-8xl mx-auto px-6 md:px-10 mt-16 md:mt-24 relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 border-t border-baden-line pt-8">
          {PROCESS.map((p, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm tabular-nums text-baden-gold-bright/70">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs md:text-sm tracking-wide uppercase text-baden-cream/80">{isRu ? p.ru : p.en}</span>
              </div>
              {i < PROCESS.length - 1 && (
                <span className="hidden sm:block flex-1 h-px bg-baden-line mx-2" aria-hidden />
              )}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
