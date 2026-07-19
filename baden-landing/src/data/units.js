import heroImg from '../assets/images/hero.jpg';
import arrivalImg from '../assets/images/arrival.jpg';
import poolImg from '../assets/images/showcase-pool.jpg';
import groundsImg from '../assets/images/showcase-grounds.jpg';
import conciergeImg from '../assets/images/showcase-concierge.jpg';

// NOTE: renders are generic exterior stills of the Baden property (not photographed
// per individual unit type). Reused across cards as placeholder imagery until the
// client supplies unit-specific renders/photography.

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

export const UNITS = [
  {
    id: 'standard-1-1',
    name: { ru: 'Стандартные апартаменты 1+1', en: 'Standard apartment 1+1' },
    size: '45 m²',
    guests: '2–4',
    location: { ru: 'Турция', en: 'Turkey' },
    image: heroImg,
    prices: [6999, 6999, 6999, 9999, 11999, 12999, 14999, 14999, 13999, 11999, 9999, 6999],
    blurb: {
      ru: 'Компактная резиденция для тех, кому важно море рядом и минимум забот.',
      en: 'A compact residence for those who want the sea close by and nothing to manage.',
    },
  },
  {
    id: 'standard-garden-1-1',
    name: { ru: 'Стандарт с садом 1+1', en: 'Standard with garden 1+1' },
    size: '85 m² / 130 m²',
    guests: '2–4',
    location: { ru: 'Турция', en: 'Turkey' },
    image: groundsImg,
    prices: [8999, 8999, 8999, 11999, 13999, 14999, 18999, 18999, 16999, 13999, 11999, 8999],
    blurb: {
      ru: 'Собственный сад и больше пространства для размеренной жизни у моря.',
      en: 'A private garden and more room to slow down by the sea.',
    },
  },
  {
    id: 'standard-2-1',
    name: { ru: 'Стандартные апартаменты 2+1', en: 'Standard apartment 2+1' },
    size: '80 m²',
    guests: '2–6',
    location: { ru: 'Турция', en: 'Turkey' },
    image: poolImg,
    prices: [9999, 9999, 9999, 14999, 17999, 19999, 21999, 21999, 19999, 17999, 14999, 9999],
    blurb: {
      ru: 'Достаточно места для семьи или друзей, без компромиссов в комфорте.',
      en: 'Enough room for family or friends, without compromising on comfort.',
    },
  },
  {
    id: 'duplex-3-1',
    name: { ru: 'Дуплекс 3+1', en: 'Duplex 3+1' },
    size: '120 m²',
    guests: '2–8',
    location: { ru: 'Турция', en: 'Turkey' },
    image: conciergeImg,
    prices: [10999, 10999, 10999, 15999, 18999, 20999, 22999, 22999, 20999, 18999, 15999, 10999],
    blurb: {
      ru: 'Два уровня, отдельная гостиная и ощущение полноценного дома.',
      en: 'Two levels, a separate living room, and the feel of a full-sized home.',
    },
  },
  {
    id: 'prime-deluxe-2-1',
    name: { ru: 'Prime Deluxe 2+1', en: 'Prime Deluxe 2+1' },
    size: '218 m² / 320 m²',
    guests: '2–8',
    location: { ru: 'Турция', en: 'Turkey' },
    image: arrivalImg,
    prices: [11999, 11999, 11999, 18999, 23999, 25999, 29999, 29999, 27999, 25999, 18999, 11999],
    blurb: {
      ru: 'Флагманская резиденция — самая большая площадь и лучшие виды комплекса.',
      en: 'The flagship residence — the largest footprint and the best views on the property.',
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
