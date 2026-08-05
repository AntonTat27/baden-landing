import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from './motion';

// Footer is the other half of the dark register (Hero is the "arrival,"
// this is the "closing") — near-black ink, warm cream text, single gold
// accent, same as Hero.
export default function Footer() {
  const { lang, toggle, isRu } = useLanguage();
  // Separator is a middle dot, not an em-dash. This string is repeated four
  // times across the marquee, so a single character choice here was
  // responsible for eight of the page's visible em-dashes on its own.
  const marquee = 'Baden Premium Projects · Antalya, Türkiye · ';

  return (
    <footer className="relative bg-baden-dark border-t border-baden-on-dark/15 overflow-hidden">
      {/* Faint ambient glow behind the marquee — the closing section gets
          the same quiet gradient treatment as the lead form, so the page
          doesn't end on a completely flat panel. */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-[80px]"
        style={{ background: 'radial-gradient(closest-side, rgba(212,175,55,0.10), transparent)' }}
        aria-hidden
      />
      {/* Oversized ghost brand marquee */}
      <div className="py-10 md:py-14 select-none" aria-hidden>
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((n) => (
            <span key={n} className="font-display font-light text-5xl md:text-8xl uppercase tracking-tight text-baden-brand/[0.14] pr-6">
              {marquee.repeat(2)}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-8xl mx-auto px-6 md:px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
          <div>
            <p className="font-display text-2xl tracking-tight text-baden-on-dark">Baden</p>
            <p className="text-[10px] tracking-widest3 uppercase text-baden-brand/80 mt-1">Premium Projects</p>
            <p className="text-sm text-baden-on-dark/65 mt-5 max-w-xs leading-relaxed">
              {isRu
                ? 'Курортная недвижимость на побережье Турции. По долям, для жизни, отдыха и инвестиций.'
                : 'Resort real estate on the Turkish coast. By the share, for living, leisure, and investment.'}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest2 uppercase text-baden-brand mb-4">{isRu ? 'Контакты' : 'Contact'}</p>
            <ul className="space-y-2.5 text-sm text-baden-on-dark/65">
              <li className="hover:text-baden-on-dark transition-colors">WhatsApp: +90 000 000 00 00</li>
              <li className="hover:text-baden-on-dark transition-colors">Telegram: @baden_premium</li>
              <li className="hover:text-baden-on-dark transition-colors">{isRu ? 'Телефон' : 'Phone'}: +90 000 000 00 00</li>
            </ul>
            <p className="text-xs tracking-widest2 uppercase text-baden-brand mb-4 mt-8">{isRu ? 'Ресурсы' : 'Resources'}</p>
            <ul className="space-y-2.5 text-sm text-baden-on-dark/65">
              <li>
                <a href="#trust" className="hover:text-baden-on-dark transition-colors">
                  {isRu ? 'Документы и право' : 'Documents & legal'}
                </a>
              </li>
              <li>
                <a
                  href="https://premium-projektentwicklung.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-baden-on-dark transition-colors"
                >
                  {isRu ? 'Девелопер: PP Projektentwicklung GmbH' : 'Developer: PP Projektentwicklung GmbH'}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <button
              type="button"
              onClick={toggle}
              className="text-xs tracking-widest text-baden-on-dark/90 border border-baden-on-dark/25 px-4 py-2 rounded-full hover:border-baden-brand hover:text-baden-brand transition-colors duration-200 w-fit"
            >
              {lang === 'ru' ? 'RU · EN' : 'EN · RU'}
            </button>
            <p className="text-xs text-baden-on-dark/55 mt-8 md:mt-0 max-w-xs md:text-right">
              {isRu ? 'ООО «Baden Premium Projects» (плейсхолдер юр. лица)' : '"Baden Premium Projects" LLC (placeholder legal entity)'}
            </p>
          </div>
        </div>

        <div className="border-t border-baden-on-dark/15 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between text-xs text-baden-on-dark/50">
          <span>&copy; {new Date().getFullYear()} Baden Premium Projects. {isRu ? 'Все права защищены.' : 'All rights reserved.'}</span>
          <span>{isRu ? 'Анталья · Турция' : 'Antalya · Türkiye'}</span>
        </div>
      </div>
    </footer>
  );
}
