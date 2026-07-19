import React, { useState } from 'react';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import poolImg from '../assets/images/showcase-pool.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

const OPTIONS = [
  {
    key: 'relocation',
    image: groundsImg,
    ru: {
      label: 'Переезд',
      copy: 'Доля в недвижимости — доступный шаг к виду на жительство в Турции, в разы дешевле полноценной покупки.',
    },
    en: {
      label: 'Relocation',
      copy: 'A fractional share can be your path toward Turkish residency — at a fraction of the cost of buying outright.',
    },
  },
  {
    key: 'investment',
    image: conciergeImg,
    ru: {
      label: 'Инвестиции',
      copy: 'Диверсификация без порога входа в целый объект: реальный актив, ликвидность через долю.',
    },
    en: {
      label: 'Investment',
      copy: 'Diversify into real estate without the full-property price tag — real asset, fractional liquidity.',
    },
  },
  {
    key: 'lifestyle',
    image: poolImg,
    ru: {
      label: 'Просто отдых',
      copy: 'Просто ваша неделя у моря, каждый год, без забот о содержании.',
    },
    en: {
      label: 'Lifestyle',
      copy: 'Simply your week by the sea, every year, without the upkeep.',
    },
  },
];

// Four Seasons-style selector: plain uppercase, tracked labels, dot-separated,
// underline only under the active label. No pills, no boxes.
export default function WhySelector() {
  const { isRu } = useLanguage();
  const [active, setActive] = useState('lifestyle');
  const current = OPTIONS.find((o) => o.key === active);

  return (
    <section className="relative bg-baden-cream py-24 md:py-32">
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-panel to-transparent"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
          {isRu ? 'Три сценария' : 'Three scenarios'}
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-baden-base mb-12 md:mb-16 max-w-2xl">
          {isRu ? 'Почему это имеет смысл' : 'Why it makes sense'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-10">
              {OPTIONS.map((o, i) => (
                <React.Fragment key={o.key}>
                  <button
                    type="button"
                    onClick={() => setActive(o.key)}
                    className={`text-xs md:text-sm tracking-widest2 uppercase pb-1 border-b transition-colors duration-200 ${
                      active === o.key
                        ? 'text-baden-gold border-baden-gold'
                        : 'text-baden-base/45 border-transparent hover:text-baden-base/75'
                    }`}
                  >
                    {isRu ? o.ru.label : o.en.label}
                  </button>
                  {i < OPTIONS.length - 1 && (
                    <span className="text-baden-base/25 text-xs md:text-sm select-none" aria-hidden>
                      &middot;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p
              key={current.key}
              className="font-display text-xl md:text-2xl leading-relaxed text-baden-base max-w-lg animate-[fadein_0.4s_ease]"
            >
              {isRu ? current.ru.copy : current.en.copy}
            </p>
          </div>

          <div className="order-1 md:order-2 relative h-72 md:h-[420px] overflow-hidden border border-baden-base/10">
            <img
              key={current.key}
              src={current.image}
              alt={isRu ? current.ru.label : current.en.label}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{
                objectPosition: positionFor(current.image),
                filter: 'saturate(0.88) brightness(0.92) sepia(0.08)',
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-baden-base/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
