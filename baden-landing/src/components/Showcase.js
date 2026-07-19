import React from 'react';
import poolImg from '../assets/images/showcase-pool.jpg';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

const THEMES = [
  {
    key: 'pool',
    image: poolImg,
    span: 'md:col-span-7',
    ru: { title: 'Пляж и бассейн', line: 'Тень парусных навесов и вода — в двух шагах от двери.' },
    en: { title: 'Beach & pool', line: 'Sail-shaped shade and water, two steps from your door.' },
  },
  {
    key: 'grounds',
    image: groundsImg,
    span: 'md:col-span-5',
    ru: { title: 'Территория', line: 'Пальмы, тихие дорожки и пространство между домами.' },
    en: { title: 'Grounds', line: 'Palms, quiet paths, and room to breathe between residences.' },
  },
  {
    key: 'interiors',
    image: null,
    span: 'md:col-span-5',
    ru: {
      title: 'Интерьеры',
      line: 'Светлые, спокойные пространства — детали доступны при знакомстве с резиденцией.',
    },
    en: {
      title: 'Interiors',
      line: 'Bright, calm interiors — details shared once you get to know the residence.',
    },
  },
  {
    key: 'concierge',
    image: conciergeImg,
    span: 'md:col-span-7',
    ru: { title: 'Консьерж и сервис', line: 'От трансфера до уборки — резиденция заботится о деталях.' },
    en: { title: 'Concierge & service', line: 'From transfers to housekeeping, the residence handles the details.' },
  },
];

export default function Showcase() {
  const { isRu } = useLanguage();

  return (
    <section id="showcase" className="relative bg-baden-panel py-24 md:py-32">
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="font-display text-3xl md:text-5xl text-baden-cream max-w-2xl mb-14 md:mb-20">
          {isRu ? (
            <>
              Резиденция, устроенная вокруг{' '}
              <span className="font-accent italic text-baden-gold-bright">жизни</span>
            </>
          ) : (
            <>
              A residence built around <span className="font-accent italic text-baden-gold-bright">living</span>
            </>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {THEMES.map((theme) => (
            <div
              key={theme.key}
              className={`relative overflow-hidden ${theme.span} min-h-[320px] md:min-h-[380px] ${
                theme.image ? '' : 'bg-baden-base flex items-end'
              }`}
            >
              {theme.image && (
                <>
                  <img
                    src={theme.image}
                    alt={isRu ? theme.ru.title : theme.en.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: positionFor(theme.image),
                      filter: 'saturate(0.88) brightness(0.9) sepia(0.1)',
                    }}
                  />
                  <div className="absolute inset-0 bg-baden-base/30" aria-hidden />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-baden-base/90 via-baden-base/35 to-transparent"
                    aria-hidden
                  />
                </>
              )}
              <div className="relative z-10 p-7 md:p-9">
                <h3 className="font-display text-xl md:text-2xl text-baden-cream mb-2">
                  {isRu ? theme.ru.title : theme.en.title}
                </h3>
                <p className="text-sm md:text-base text-baden-muted max-w-sm">
                  {isRu ? theme.ru.line : theme.en.line}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 text-center">
          <a
            href="#listings"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block text-sm md:text-base tracking-wide text-baden-cream border-b border-baden-gold pb-1 hover:text-baden-gold-bright hover:border-baden-gold-bright transition-colors duration-200"
          >
            {isRu ? 'Смотреть варианты резиденций' : 'View residence options'}
          </a>
        </div>
      </div>
    </section>
  );
}
