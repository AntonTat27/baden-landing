import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Text wordmark used as a stand-in for the client's real logo file (the
// video-frame renders are too low-res to crop cleanly). Request the
// production logo asset before this ships.
export default function Footer() {
  const { lang, toggle, isRu } = useLanguage();

  return (
    <footer className="relative bg-baden-base border-t border-baden-muted/20 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
          <div>
            <p className="font-display text-2xl tracking-wide text-baden-cream">BADEN</p>
            <p className="text-xs tracking-widest2 uppercase text-baden-muted mt-1">
              Premium Project
            </p>
            <p className="text-sm text-baden-muted mt-5 max-w-xs">
              {isRu
                ? 'Курортная недвижимость в Турции для жизни, отдыха и инвестиций.'
                : 'Resort real estate in Turkey for living, leisure, and investment.'}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
              {isRu ? 'Контакты' : 'Contact'}
            </p>
            <ul className="space-y-2 text-sm text-baden-muted">
              <li className="hover:text-baden-cream transition-colors duration-200">
                {isRu ? 'Телефон' : 'Phone'}: +90 000 000 00 00
              </li>
              <li className="hover:text-baden-cream transition-colors duration-200">
                WhatsApp: +90 000 000 00 00
              </li>
              <li className="hover:text-baden-cream transition-colors duration-200">
                Telegram: @baden_premium
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <button
              type="button"
              onClick={toggle}
              className="text-sm tracking-widest text-baden-cream border border-baden-muted/40 px-3 py-1.5 hover:border-baden-gold hover:text-baden-gold transition-colors duration-200 w-fit"
            >
              {lang === 'ru' ? 'RU / EN' : 'EN / RU'}
            </button>
            <p className="text-xs text-baden-muted/70 mt-8 md:mt-0 max-w-xs md:text-right">
              {isRu
                ? 'ООО «Baden Premium Projects» (плейсхолдер юр. лица)'
                : '"Baden Premium Projects" LLC (placeholder legal entity)'}
            </p>
          </div>
        </div>

        <div className="border-t border-baden-muted/15 pt-6 text-xs text-baden-muted/60">
          &copy; {new Date().getFullYear()} Baden Premium Projects.{' '}
          {isRu ? 'Все права защищены.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
