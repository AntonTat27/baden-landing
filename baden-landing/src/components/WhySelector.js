import React, { useEffect, useState } from 'react';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';
import poolImg from '../assets/images/showcase-pool.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

const ROTATE_MS = 6000;

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

// Auto-advancing scenario tabs: the underline under the active label doubles
// as a countdown to the next tab. Hovering the section (or focusing a tab)
// pauses rotation; clicking selects and restarts the timer.
export default function WhySelector() {
  const { isRu } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = OPTIONS[active];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % OPTIONS.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section className="relative bg-baden-cream py-24 md:py-32">
      <div
        className="max-w-7xl mx-auto px-6 md:px-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="text-xs tracking-widest2 uppercase text-baden-gold mb-4">
          {isRu ? 'Три сценария' : 'Three scenarios'}
        </p>
        <h2 className="font-display font-medium text-3xl md:text-5xl text-baden-base mb-12 md:mb-16 max-w-2xl">
          {isRu ? 'Почему это имеет смысл' : 'Why it makes sense'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 mb-10">
              {OPTIONS.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  className={`relative text-xs md:text-sm tracking-widest2 uppercase pb-2 transition-colors duration-200 ${
                    i === active ? 'text-baden-base' : 'text-baden-base/40 hover:text-baden-base/70'
                  }`}
                >
                  {isRu ? o.ru.label : o.en.label}
                  {/* Track + countdown fill */}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-baden-base/15" aria-hidden />
                  {i === active && (
                    <span
                      key={`${active}-${paused}`}
                      className="absolute bottom-0 left-0 right-0 h-px bg-baden-gold origin-left"
                      style={{
                        animation: `tabprogress ${ROTATE_MS}ms linear both`,
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>

            <p
              key={current.key}
              className="font-display text-xl md:text-2xl leading-relaxed text-baden-base max-w-lg animate-[fadein_0.4s_ease]"
            >
              {isRu ? current.ru.copy : current.en.copy}
            </p>
          </div>

          {/* Stacked crossfade — all images stay mounted so switches are smooth */}
          <div className="order-1 md:order-2 relative h-72 md:h-[420px] overflow-hidden">
            {OPTIONS.map((o, i) => (
              <img
                key={o.key}
                src={o.image}
                alt={isRu ? o.ru.label : o.en.label}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                style={{
                  objectPosition: positionFor(o.image),
                  opacity: i === active ? 1 : 0,
                }}
                aria-hidden={i !== active}
              />
            ))}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              aria-hidden
            />
            <p className="absolute bottom-4 right-5 font-display text-sm text-baden-cream/80 tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(OPTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
