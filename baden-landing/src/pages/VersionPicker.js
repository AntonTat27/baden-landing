// The comparison index.
//
// Deliberately NEUTRAL — a plain dark grey chooser with no point of view of
// its own. If this page had an aesthetic it would bias the comparison, and
// its only job is to hand the viewer to three pages that do.

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VERSIONS } from '../versions/registry';
import { useLanguage } from '../context/LanguageContext';
import { BRAND, t } from '../data/site';

export default function VersionPicker() {
  const { isRu, toggle } = useLanguage();

  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = 'dark';
    document.body.style.background = '#141414';
    return () => {
      root.style.colorScheme = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div style={{ background: '#141414', color: '#ededea', minHeight: '100vh', fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="mx-auto max-w-[80rem] px-5 md:px-10 py-14 md:py-20">
        <header className="flex items-start justify-between gap-6 mb-12 md:mb-16 pb-8" style={{ borderBottom: '1px solid rgba(237,237,234,0.16)' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(237,237,234,0.5)', marginBottom: 12 }}>
              {BRAND.full}
            </p>
            <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 500, maxWidth: '30ch' }}>
              {isRu ? 'Ранние варианты дизайна' : 'Earlier design explorations'}
            </h1>
            <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6, color: 'rgba(237,237,234,0.62)', maxWidth: '58ch' }}>
              {isRu
                ? 'Три ранних направления, из которых собран текущий сайт. Они больше не поддерживаются и оставлены только для сравнения — актуальная версия живёт на главной.'
                : 'Three earlier directions the current site was composed from. They are no longer maintained and are kept for comparison only — the live version is on the home page.'}
            </p>
            <Link to="/" style={{ display: 'inline-block', marginTop: 18, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#ededea', borderBottom: '1px solid rgba(237,237,234,0.35)', paddingBottom: 4 }}>
              {isRu ? '← Вернуться на сайт' : '← Back to the site'}
            </Link>
          </div>
          <button type="button" onClick={toggle}
            style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,237,234,0.62)', padding: '8px 12px', border: '1px solid rgba(237,237,234,0.22)', flexShrink: 0 }}>
            {isRu ? 'EN' : 'RU'}
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {VERSIONS.map((v, i) => {
            const c = isRu ? v.ru : v.en;
            return (
              <Link key={v.slug} to={`/v/${v.slug}`} className="group flex flex-col"
                style={{ background: '#1c1c1c', border: '1px solid rgba(237,237,234,0.14)', animation: `rise 700ms cubic-bezier(.16,1,.3,1) ${i * 90}ms both` }}>
                {/* The palette IS the preview — five real tokens from the
                    version, at page scale, in their actual proportions. */}
                <div style={{ display: 'flex', height: 132 }} aria-hidden>
                  {v.swatches.map((s, j) => (
                    <span key={s} style={{ background: s, flex: j === 0 ? 2.4 : 1, transition: 'flex 500ms cubic-bezier(.16,1,.3,1)' }} />
                  ))}
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{v.name}</h2>
                    <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,237,234,0.42)' }}>
                      {v.scheme === 'light' ? (isRu ? 'светлая' : 'light') : (isRu ? 'тёмная' : 'dark')}
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(237,237,234,0.5)', marginBottom: 14 }}>
                    {c.family}
                  </p>
                  <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'rgba(237,237,234,0.78)', marginBottom: 12 }}>{c.line}</p>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(237,237,234,0.52)', flex: 1 }}>{c.note}</p>

                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(237,237,234,0.14)' }}>
                    <p style={{ fontSize: 11.5, color: 'rgba(237,237,234,0.45)', marginBottom: 14 }}>{v.type}</p>
                    <span className="inline-flex items-center gap-2"
                      style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: v.swatches[3] }}>
                      {isRu ? 'Открыть версию' : 'Open version'}
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* The honest caveat. This build is a design comparison, not a
            launch-ready site, and saying so here costs nothing and prevents
            the client reading placeholder figures as settled. */}
        <div className="mt-14 p-6" style={{ border: '1px solid rgba(237,237,234,0.16)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,237,234,0.5)', marginBottom: 12 }}>
            {isRu ? 'Перед публикацией' : 'Before launch'}
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.68, color: 'rgba(237,237,234,0.72)', maxWidth: '72ch' }}>
            {isRu
              ? 'Все три версии показывают неподтверждённые данные — телефоны, юридическое лицо и цены. Каждое такое значение помечено на странице цветной точкой. Полный список того, что нужно заменить, — в TODO-CONTENT.md.'
              : 'All three versions display unconfirmed data — phone numbers, the legal entity, and prices. Every such figure is marked on the page with a coloured dot. The full replacement list is in TODO-CONTENT.md.'}
          </p>
        </div>

        <footer className="mt-10" style={{ fontSize: 12, color: 'rgba(237,237,234,0.4)' }}>
          &copy; {new Date().getFullYear()} {BRAND.full} · {t(BRAND.locale, isRu)}
        </footer>
      </div>
    </div>
  );
}
