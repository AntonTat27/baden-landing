import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from './motion';

export default function Footer() {
  const { lang, toggle, isRu } = useLanguage();
  const marquee = 'Baden Premium Projects — Antalya, Türkiye — ';

  return (
    <footer className="relative bg-baden-base border-t border-baden-line overflow-hidden">
      {/* Oversized ghost brand marquee */}
      <div className="py-10 md:py-14 select-none" aria-hidden>
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((n) => (
            <span key={n} className="font-display font-light text-5xl md:text-8xl uppercase tracking-tight text-baden-cream/[0.06] pr-6">
              {marquee.repeat(2)}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-8xl mx-auto px-6 md:px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
          <div>
            <p className="font-display text-2xl tracking-tight text-baden-cream">Baden</p>
            <p className="text-[10px] tracking-widest3 uppercase text-baden-gold-bright/80 mt-1">Premium Projects</p>
            <p className="text-sm text-baden-muted mt-5 max-w-xs leading-relaxed">
              {isRu
                ? 'Курортная недвижимость на побережье Турции — по долям, для жизни, отдыха и инвестиций.'
                : 'Resort real estate on the Turkish coast — by the share, for living, leisure, and investment.'}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">{isRu ? 'Контакты' : 'Contact'}</p>
            <ul className="space-y-2.5 text-sm text-baden-muted">
              <li className="hover:text-baden-cream transition-colors">WhatsApp: +90 000 000 00 00</li>
              <li className="hover:text-baden-cream transition-colors">Telegram: @baden_premium</li>
              <li className="hover:text-baden-cream transition-colors">{isRu ? 'Телефон' : 'Phone'}: +90 000 000 00 00</li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <button
              type="button"
              onClick={toggle}
              className="text-xs tracking-widest text-baden-cream/90 border border-baden-cream/25 px-4 py-2 rounded-full hover:border-baden-gold-bright hover:text-baden-gold-bright transition-colors duration-200 w-fit"
            >
              {lang === 'ru' ? 'RU · EN' : 'EN · RU'}
            </button>
            <p className="text-xs text-baden-muted/70 mt-8 md:mt-0 max-w-xs md:text-right">
              {isRu ? 'ООО «Baden Premium Projects» (плейсхолдер юр. лица)' : '"Baden Premium Projects" LLC (placeholder legal entity)'}
            </p>
          </div>
        </div>

        <div className="border-t border-baden-line pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between text-xs text-baden-muted/60">
          <span>&copy; {new Date().getFullYear()} Baden Premium Projects. {isRu ? 'Все права защищены.' : 'All rights reserved.'}</span>
          <span>{isRu ? 'Анталья · Турция' : 'Antalya · Türkiye'}</span>
        </div>
      </div>
    </footer>
  );
}
