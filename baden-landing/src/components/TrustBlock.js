import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import useInView from '../hooks/useInView';

// Placeholder About/legal copy — replace with the client's approved
// company description and legal entity details before launch.
// Layout: ghost-text brand marquee band + scroll-revealed info columns.

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function TrustBlock() {
  const { isRu } = useLanguage();
  const marqueeText = 'Baden Premium Projects — Antalya, Türkiye — ';

  return (
    <section className="relative bg-baden-base py-24 md:py-28 overflow-hidden">
      {/* Slow ghost marquee — motion without extra copy */}
      <div className="mb-16 md:mb-24 select-none" aria-hidden>
        <div
          className="flex w-max whitespace-nowrap"
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          {[0, 1].map((n) => (
            <span
              key={n}
              className="font-display font-semibold text-6xl md:text-8xl uppercase tracking-tight text-baden-cream/[0.05] pr-4"
            >
              {marqueeText.repeat(2)}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <Reveal>
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'О компании' : 'About us'}
          </p>
          <h2 className="font-display font-medium text-2xl md:text-3xl text-baden-cream mb-5">
            Baden Premium Projects
          </h2>
          <p className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md">
            {isRu
              ? 'Команда, развивающая курортную недвижимость на побережье Турции, ориентированная на архитектуру, сервис и долгосрочную ценность для собственников.'
              : 'A resort real estate developer working on the Turkish coast, focused on architecture, service, and long-term value for owners.'}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'Юридическая прозрачность' : 'Legal transparency'}
          </p>
          <p className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md">
            {isRu
              ? 'Право собственности оформляется через официальный турецкий title deed (ТАПУ) и заверяется у нотариуса. Мы сопровождаем сделку на каждом этапе и предоставляем полную документацию.'
              : 'Ownership is registered through the official Turkish title deed (TAPU) and notarized. We guide the transaction at every stage and provide complete documentation.'}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
