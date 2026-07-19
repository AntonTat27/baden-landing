import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Placeholder About/legal copy — replace with the client's approved
// company description and legal entity details before launch.
export default function TrustBlock() {
  const { isRu } = useLanguage();

  return (
    <section className="relative bg-baden-base py-24 md:py-28">
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-cream to-transparent"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'О компании' : 'About us'}
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-baden-cream mb-5">
            Baden Premium Projects
          </h2>
          <p className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md">
            {isRu
              ? 'Turkey — команда, развивающая курортную недвижимость на побережье Турции, ориентированная на архитектуру, сервис и долгосрочную ценность для собственников.'
              : 'A resort real estate developer working on the Turkish coast, focused on architecture, service, and long-term value for owners.'}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'Юридическая прозрачность' : 'Legal transparency'}
          </p>
          <p className="text-sm md:text-base text-baden-muted leading-relaxed max-w-md">
            {isRu
              ? 'Право собственности оформляется через официальный турецкий title deed (ТАПУ) и заверяется у нотариуса. Мы сопровождаем сделку на каждом этапе и предоставляем полную документацию.'
              : 'Ownership is registered through the official Turkish title deed (TAPU) and notarized. We guide the transaction at every stage and provide complete documentation.'}
          </p>
        </div>
      </div>
    </section>
  );
}
