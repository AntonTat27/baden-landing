// NOTE: placeholder photography sourced from Unsplash (free to use under the
// Unsplash License, https://unsplash.com/license) until the client supplies
// real photography for each property. Each listing below is a distinct,
// independently-owned property in the Baden portfolio — not different units
// inside the same building.
import { HOTEL_IMG, VILLA_IMG, LAGOON_IMG, RESIDENCES_IMG, WATER_VILLAS_IMG } from '../assets/imagePositions';

export const MONTHS = [
  { ru: 'Январь', en: 'January', short: { ru: 'Янв', en: 'Jan' } },
  { ru: 'Февраль', en: 'February', short: { ru: 'Фев', en: 'Feb' } },
  { ru: 'Март', en: 'March', short: { ru: 'Мар', en: 'Mar' } },
  { ru: 'Апрель', en: 'April', short: { ru: 'Апр', en: 'Apr' } },
  { ru: 'Май', en: 'May', short: { ru: 'Май', en: 'May' } },
  { ru: 'Июнь', en: 'June', short: { ru: 'Июн', en: 'Jun' } },
  { ru: 'Июль', en: 'July', short: { ru: 'Июл', en: 'Jul' } },
  { ru: 'Август', en: 'August', short: { ru: 'Авг', en: 'Aug' } },
  { ru: 'Сентябрь', en: 'September', short: { ru: 'Сен', en: 'Sep' } },
  { ru: 'Октябрь', en: 'October', short: { ru: 'Окт', en: 'Oct' } },
  { ru: 'Ноябрь', en: 'November', short: { ru: 'Ноя', en: 'Nov' } },
  { ru: 'Декабрь', en: 'December', short: { ru: 'Дек', en: 'Dec' } },
];

// Baden works across three distinct ownership models — not every property
// offers all three. `ownership` names which one(s) apply to that listing;
// `entryFrom` is the starting buy-in price to actually own it (a one-time
// figure, separate from `prices`, which is the illustrative seasonal usage
// cost shown on the residence page). See OWNERSHIP_MODELS below for the
// plain-language definition of each model.
//
// PLACEHOLDER FIGURES — entryFrom values (especially the €5,000 Beyzade
// timeshare entry) are illustrative for the client call, not confirmed
// pricing. Replace with real figures before this goes live.
// Accent per model. One consistent 3-colour legend reused everywhere
// ownership type appears (residence-card dots, the HowItWorks switcher, the
// ownership donut, the document bullets in LegalTrust).
//
// The keys used to be hue names ('gold' / 'teal' / 'rust'), which is how the
// legend got contaminated: the same two hues were also the CTA fill and the
// decorative hairline colour, so consumers could not tell a legend colour
// from a brand colour. The keys are now the concepts themselves, and the
// palette exposes a dedicated own-* ramp that is used for nothing else.
export const OWNERSHIP_MODELS = {
  full: {
    accent: 'full',
    ru: { label: 'Полное владение', short: 'Полное владение', def: 'Объект целиком принадлежит вам. Без графика по неделям и без совладельцев.' },
    en: { label: 'Full ownership', short: 'Full ownership', def: 'You own the whole property outright. No shared calendar, no co-owners.' },
  },
  fractional: {
    accent: 'fractional',
    ru: { label: 'Дробное владение', short: 'Доля', def: 'Официально зарегистрированная доля в конкретном объекте: ТАПУ на ваше имя, свои недели, можно продать или передать по наследству.' },
    en: { label: 'Fractional ownership', short: 'Fractional', def: 'A legally registered share of a specific property: a title (TAPU) in your name, your own weeks, resellable and inheritable.' },
  },
  timeshare: {
    accent: 'timeshare',
    ru: { label: 'Таймшер', short: 'Таймшер', def: 'Право пользования определёнными неделями каждый год. Самый доступный порог входа, для отдыха.' },
    en: { label: 'Timeshare', short: 'Timeshare', def: 'The right to use specific weeks every year. The lowest entry point, best suited to holiday use.' },
  },
};

// Five independent properties across the Turkish riviera — a curated
// portfolio, each with its own architecture, location, character, and
// ownership model.
export const UNITS = [
  {
    id: 'villa-aurelia',
    name: { ru: 'Вилла Aurelia', en: 'Villa Aurelia' },
    type: { ru: 'Вилла', en: 'Villa' },
    bedrooms: 4,
    size: '210 m² · сад 600 m²',
    guests: '4–8',
    location: { ru: 'Бодрум', en: 'Bodrum' },
    image: VILLA_IMG,
    ownership: ['full'],
    entryFrom: 420000,
    prices: [8999, 8999, 8999, 12999, 15999, 17999, 20999, 20999, 18999, 15999, 12999, 8999],
    blurb: {
      ru: 'Частная вилла на холме с видом на залив. Собственный сад, терраса и ощущение полностью личного дома. Продаётся целиком, в полную собственность.',
      en: 'A private hillside villa above the bay, with its own garden, terrace, and the feel of a fully personal home. Sold outright, full ownership only.',
    },
  },
  {
    id: 'beyzade-hotel',
    name: { ru: 'Beyzade Resort', en: 'Beyzade Resort' },
    type: { ru: 'Резорт/Отель', en: 'Resort/Hotel' },
    bedrooms: 2,
    size: 'Семейный резорт · концепция халяль',
    guests: '2–6',
    location: { ru: 'Аланья', en: 'Alanya' },
    image: HOTEL_IMG,
    ownership: ['timeshare'],
    entryFrom: 5000,
    prices: [10999, 10999, 10999, 14999, 18999, 21999, 24999, 24999, 21999, 18999, 14999, 10999],
    blurb: {
      ru: 'Семейный резорт в сердце Аланьи с бассейном для женщин, хамамом и мольбенной. Таймшер на определённые недели, самый доступный вход в портфель Baden.',
      en: 'A family resort in the heart of Alanya with a women-only pool, a hamam, and a prayer room. Sold as timeshare weeks, the most accessible entry point in the Baden portfolio.',
    },
  },
  {
    id: 'cape-lagoon-resort',
    name: { ru: 'Cape Lagoon Resort', en: 'Cape Lagoon Resort' },
    type: { ru: 'Резорт/Отель', en: 'Resort/Hotel' },
    bedrooms: 3,
    size: 'Резорт · 4.2 га',
    guests: '2–6',
    location: { ru: 'Фетхие', en: 'Fethiye' },
    image: LAGOON_IMG,
    ownership: ['fractional'],
    entryFrom: 32000,
    prices: [9999, 9999, 9999, 13999, 16999, 18999, 21999, 21999, 18999, 16999, 13999, 9999],
    blurb: {
      ru: 'Лагунный курорт с прямым выходом к воде и собственным пляжным клубом. Доля в объекте оформляется как ТАПУ на ваше имя.',
      en: 'A lagoon-front resort with direct water access and its own beach club. Sold as a fractional share, with a title (TAPU) in your name.',
    },
  },
  {
    id: 'marea-residences',
    name: { ru: 'Marea Residences', en: 'Marea Residences' },
    type: { ru: 'Апартаменты/Резиденции', en: 'Apartment/Residences' },
    bedrooms: 3,
    size: 'Резиденции · 14 домов',
    guests: '2–8',
    location: { ru: 'Чешме', en: 'Çeşme' },
    image: RESIDENCES_IMG,
    ownership: ['fractional', 'full'],
    entryFrom: 45000,
    prices: [11999, 11999, 11999, 16999, 19999, 21999, 23999, 23999, 21999, 19999, 16999, 11999],
    blurb: {
      ru: 'Современный комплекс приморских резиденций: архитектура, обращённая к морю, и общий бассейн-инфинити. Доступны и доля, и полная покупка отдельного дома.',
      en: 'A modern seafront residence complex: architecture that faces the water, with a shared infinity pool. Available as either a fractional share or a full purchase of a single home.',
    },
  },
  {
    id: 'the-water-villas',
    name: { ru: 'The Water Villas', en: 'The Water Villas' },
    type: { ru: 'Вилла на воде', en: 'Water Villa' },
    bedrooms: 5,
    size: '340 m² · над водой',
    guests: '4–10',
    location: { ru: 'Анталья', en: 'Antalya' },
    image: WATER_VILLAS_IMG,
    ownership: ['fractional'],
    entryFrom: 68000,
    prices: [15999, 15999, 15999, 22999, 27999, 30999, 34999, 34999, 30999, 27999, 22999, 15999],
    blurb: {
      ru: 'Флагман портфеля: виллы на сваях над лагуной, самые большие площади и прямой спуск к воде с террасы. Доля в объекте оформляется как ТАПУ на ваше имя.',
      en: 'The flagship of the portfolio: villas raised over the lagoon, the largest footprints, and a private ladder down to the water. Sold as a fractional share, with a title (TAPU) in your name.',
    },
  },
];

export function minPrice(unit) {
  return Math.min(...unit.prices);
}

export function formatEUR(value) {
  return `€${value.toLocaleString('de-DE')}`;
}

export function getUnitById(id) {
  return UNITS.find((u) => u.id === id);
}
