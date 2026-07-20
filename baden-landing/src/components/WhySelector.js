import React from 'react';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import poolImg from '../assets/images/showcase-pool.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

const OPTIONS = [
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
];

// All three scenarios shown at once, in keeping with the editorial "nothing
// hidden behind interaction" language established in Listings — previously
// this was a tab strip that hid two of three cards, which sat oddly next to
// a section built entirely around always-visible content. Cards are
// deliberately uneven in height (middle one taller) to avoid the same grid
// rhythm as the Listings rows directly above.
export default function WhySelector() {
  const { isRu } = useLanguage();

  return (
    <section className="relative bg-baden-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
            {isRu ? 'Три сценария' : 'Three scenarios'}
          </p>
          <h2 className="font-display font-medium text-3xl md:text-5xl text-baden-base">
            {isRu ? 'Почему это имеет смысл' : 'Why it makes sense'}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {OPTIONS.map((o, i) => (
            <Reveal
              key={o.key}
              delay={i * 110}
              className={i === 1 ? 'md:mt-0' : 'md:mt-10'}
            >
              <div className="group relative overflow-hidden">
                <div
                  className={`relative w-full overflow-hidden ${
                    i === 1 ? 'h-80 md:h-[30rem]' : 'h-64 md:h-96'
                  }`}
                >
                  <img
                    src={o.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: positionFor(o.image) }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <span className="font-display text-xs tabular-nums text-baden-gold-bright">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display font-medium text-xl md:text-2xl text-baden-cream mt-1">
                      {isRu ? o.ru.label : o.en.label}
                    </h3>
                  </div>
                </div>
                <p className="text-sm md:text-base text-baden-base/65 leading-relaxed mt-5 max-w-sm">
                  {isRu ? o.ru.copy : o.en.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
