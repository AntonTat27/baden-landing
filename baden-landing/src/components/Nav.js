import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LINKS = [
  { id: 'showcase', ru: 'Резиденция', en: 'Residence' },
  { id: 'listings', ru: 'Варианты', en: 'Options' },
  { id: 'how-it-works', ru: 'Как это работает', en: 'How it works' },
  { id: 'lead-form', ru: 'Контакты', en: 'Contact' },
];

export default function Nav() {
  const { lang, toggle, isRu } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-baden-base/95 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? 'border-b border-baden-muted/25' : 'border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
        <Link to="/" className="font-display text-xl md:text-2xl tracking-wide text-baden-cream">
          BADEN
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={goTo(l.id)}
              className="group text-sm text-baden-muted hover:text-baden-cream transition-colors duration-200"
            >
              <span className="border-b border-transparent group-hover:border-baden-gold pb-0.5 transition-colors duration-200">
                {isRu ? l.ru : l.en}
              </span>
            </a>
          ))}
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="text-sm tracking-widest text-baden-cream border border-baden-muted/40 px-3 py-1.5 hover:border-baden-gold hover:text-baden-gold transition-colors duration-200"
          >
            {lang === 'ru' ? 'RU / EN' : 'EN / RU'}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="text-xs tracking-widest text-baden-cream border border-baden-muted/40 px-2 py-1"
          >
            {lang.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-sm text-baden-cream"
            aria-label="Menu"
          >
            {mobileOpen ? (isRu ? 'Закрыть' : 'Close') : isRu ? 'Меню' : 'Menu'}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 border-b border-baden-muted/25">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={goTo(l.id)}
              className="text-base text-baden-muted hover:text-baden-cream transition-colors duration-200"
            >
              {isRu ? l.ru : l.en}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
