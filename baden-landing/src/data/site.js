// SINGLE SOURCE OF TRUTH for every piece of bilingual copy on the site.
//
// The three design versions (iznik / portolan / lycia) all read from this
// file. They differ in visual world, composition, and motion — never in
// facts. If a fact is wrong here it is wrong in three places at once, which
// is the point: previously the WhatsApp number lived in two components and
// had already begun to drift (see TODO-CONTENT.md §1).
//
// PLACEHOLDER DISCIPLINE
// Anything still unconfirmed is exported through `PLACEHOLDER` below and is
// rendered with a visible marker in the UI. Nothing invented is allowed to
// look confirmed. See TODO-CONTENT.md for the full go-live inventory.

// ---------------------------------------------------------------------------
// CONTACT — NOT YET CONFIRMED. TODO-CONTENT.md §1.
// These were previously hardcoded in LeadSection.js and Footer.js separately.
// One definition now; swap these four values and the whole site updates.
// ---------------------------------------------------------------------------
export const CONTACT = {
  whatsapp: { display: '+90 000 000 00 00', href: 'https://wa.me/900000000000', confirmed: false },
  phone: { display: '+90 000 000 00 00', href: 'tel:+900000000000', confirmed: false },
  telegram: { display: '@baden_premium', href: 'https://t.me/baden_premium', confirmed: false },
  email: { display: 'info@baden-premium.com', href: 'mailto:info@baden-premium.com', confirmed: false },
};

// The legal entity string is EXPLICITLY a placeholder and currently renders
// the word "placeholder" to visitors. TODO-CONTENT.md §2.
export const LEGAL_ENTITY = {
  ru: 'ООО «Baden Premium Projects»',
  en: '"Baden Premium Projects" LLC',
  confirmed: false,
};

export const DEVELOPER = {
  name: 'PP Projektentwicklung GmbH',
  href: 'https://premium-projektentwicklung.de/',
  country: { ru: 'Германия', en: 'Germany' },
};

export const BRAND = {
  name: 'Baden',
  full: 'Baden Premium Projects',
  // Taken verbatim from the client's own render watermark.
  tagline: 'PREMIUM PROJECT',
  locale: { ru: 'Анталья, Турция', en: 'Antalya, Türkiye' },
};

// ---------------------------------------------------------------------------
// NAVIGATION — shared anchor targets. Each version styles these its own way.
// ---------------------------------------------------------------------------
export const NAV = [
  { id: 'portfolio', ru: 'Резиденции', en: 'Residences' },
  { id: 'ownership', ru: 'Владение', en: 'Ownership' },
  { id: 'life', ru: 'На территории', en: 'The grounds' },
  { id: 'trust', ru: 'Документы', en: 'Legal' },
  { id: 'faq', ru: 'Вопросы', en: 'FAQ' },
];

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const HERO = {
  region: { ru: 'Турецкая Ривьера', en: 'Turkish Riviera' },
  headline: {
    ru: ['Недвижимость', 'на побережье'],
    en: ['Property on', 'the Turkish coast'],
  },
  sub: {
    ru: 'Купить целиком, долю или таймшер — пять объектов на средиземноморском побережье, у каждого свой формат владения.',
    en: 'Buy outright, buy a share, or buy weeks — five properties on the Mediterranean coast, each with its own ownership model.',
  },
  // PLACEHOLDER FIGURES — TODO-CONTENT.md §3. `entryFrom` in units.js and the
  // hero stat below are derived from the same Beyzade timeshare number and
  // must be corrected together.
  stats: [
    { ru: { l: 'Минимальный срок', v: '1 неделя' }, en: { l: 'Minimum term', v: '1 week' }, confirmed: false },
    { ru: { l: 'Вход от', v: '€5,000' }, en: { l: 'Entry from', v: '€5,000' }, confirmed: false },
    { ru: { l: 'Объектов', v: '5' }, en: { l: 'Properties', v: '5' }, confirmed: true },
  ],
  primary: { ru: 'Оставить контакт', en: 'Leave your contact' },
  secondary: { ru: 'Смотреть резиденции', en: 'View the residences' },
};

// ---------------------------------------------------------------------------
// AMENITIES / LIFE ON THE GROUNDS
// Sourced from Beyzade Resort's own "Sosyal Alanlar" page.
// ---------------------------------------------------------------------------
export const AMENITIES = [
  {
    key: 'privacy',
    ru: { label: 'Приватность', title: 'Раздельные зоны бассейна', copy: 'Отдельные зоны у воды для мужчин и женщин — приватно и с уважением к традициям гостей.' },
    en: { label: 'Privacy', title: 'Separate pool areas', copy: 'Distinct water areas for men and women — private and considerate of guests’ traditions.' },
  },
  {
    key: 'grounds',
    ru: { label: 'Территория', title: 'Ресторан и детский клуб', copy: 'Игровые площадки, мини-клуб и ресторан — отдых продуман для всей семьи.' },
    en: { label: 'Grounds', title: 'Restaurant & kids’ club', copy: 'Play areas, a mini club, and an on-site restaurant — built around the whole family.' },
  },
  {
    key: 'hamam',
    ru: { label: 'Спа', title: 'Хамам и массаж', copy: 'Турецкая баня, комната отдыха и массажный кабинет — забота о теле включена.' },
    en: { label: 'Spa', title: 'Hamam & massage', copy: 'A Turkish bath, a relaxation room, and a massage suite — wellness built in.' },
  },
  {
    key: 'beach',
    ru: { label: 'Пляж', title: 'Собственный пляжный клуб', copy: 'Лежаки, кабаны и кухня на берегу — галечный пляж в нескольких минутах от резиденции.' },
    en: { label: 'Beach', title: 'A private beach club', copy: 'Loungers, cabanas, and a kitchen on the shore — a pebble beach minutes from the residence.' },
  },
];

// ---------------------------------------------------------------------------
// OWNERSHIP — the mechanism. Detail copy per model.
// Model labels/definitions live in units.js OWNERSHIP_MODELS.
// ---------------------------------------------------------------------------
export const OWNERSHIP_DETAIL = {
  full: {
    ru: {
      body: 'Объект становится полностью вашим — без общего графика и без совладельцев. Полный ТАПУ оформляется на ваше имя, объект в вашем распоряжении круглый год.',
      benefits: ['Единоличное владение — график ни с кем не делится', 'Свободная перепродажа и наследование', 'Доступ в любое время года'],
    },
    en: {
      body: 'The residence becomes fully yours — no shared calendar, no co-owners. A full TAPU is registered in your name, and the property is yours year-round.',
      benefits: ['Sole ownership — no calendar to share', 'Free resale or inheritance', 'Available any time of year'],
    },
  },
  fractional: {
    ru: {
      body: 'Официально зарегистрированная доля объекта — ТАПУ на ваше имя и закреплённые недели каждый год. Дешевле полной покупки, права те же: продать, передать по наследству, сдавать.',
      benefits: ['Зарегистрированный ТАПУ — право собственности, а не договор', 'Свои недели, закреплённые каждый год', 'Доход от сезонной аренды + рост стоимости побережья'],
    },
    en: {
      body: 'A legally registered share of the property — a title (TAPU) in your name, with set weeks every year. Cheaper than buying outright, with the same rights: sell it, pass it on, rent it out.',
      benefits: ['A registered TAPU — real title, not a contract', 'Your own weeks, locked in every year', 'Seasonal rental income + coastal appreciation'],
    },
  },
  timeshare: {
    ru: {
      body: 'Право пользования определёнными неделями каждый год — самый доступный вход в портфель Baden. Управление, уборка и сервис на месте уже включены.',
      benefits: ['Самый низкий порог входа в портфеле', 'Управление и уборка включены', 'Недели закреплены договором'],
    },
    en: {
      body: 'The right to use specific weeks every year — the most accessible entry point into the Baden portfolio. On-site management, cleaning, and service are already included.',
      benefits: ['The lowest entry point in the portfolio', 'Management and cleaning included', 'Weeks locked in by contract'],
    },
  },
};

export const STEPS = [
  {
    ru: { t: 'Выберите объект и способ владения', d: 'Не у каждого объекта есть все три варианта — сначала смотрим, что доступно именно там.' },
    en: { t: 'Choose the property and the model', d: 'Not every property offers all three — we start with what is actually available there.' },
  },
  {
    ru: { t: 'Оформите — ТАПУ под ваш формат', d: 'Полный ТАПУ при полном владении, долевой ТАПУ при дробном, или контракт на недели при таймшере.' },
    en: { t: 'Register — a TAPU matched to the model', d: 'A full TAPU for outright ownership, a shared TAPU for fractional, or a weeks contract for timeshare.' },
  },
  {
    ru: { t: 'Пользуйтесь', d: 'Свой дом — в любое время. Доля или таймшер — свои недели каждый год. Управление и сервис на месте.' },
    en: { t: 'Use it', d: 'Your own home, any time. A share or timeshare gives you your weeks every year. Management and service on site.' },
  },
  {
    ru: { t: 'Продайте или передайте', d: 'ТАПУ или таймшер-контракт — каждый формат передаётся и наследуется, как любая недвижимость.' },
    en: { t: 'Sell it or pass it on', d: 'A TAPU or a timeshare contract — every model is transferable and inheritable, like any property.' },
  },
];

// ---------------------------------------------------------------------------
// AUDIENCES — the three buyer scenarios from PRODUCT.md.
// ---------------------------------------------------------------------------
export const AUDIENCES = [
  {
    key: 'investment',
    ru: { tag: 'Инвестиции', title: 'Реальный актив, дробная цена', copy: 'Диверсификация в средиземноморскую недвижимость без порога входа в целый объект: рост стоимости и ликвидность через долю.', point: 'Доход от сезонной аренды + рост цены побережья' },
    en: { tag: 'Investment', title: 'A real asset, at a fractional price', copy: 'Diversify into Mediterranean real estate without the full-property price tag — capital appreciation and liquidity through your share.', point: 'Seasonal rental income + coastal appreciation' },
  },
  {
    key: 'relocation',
    ru: { tag: 'Переезд', title: 'Вид на жительство в Турции', copy: 'Доля в недвижимости — доступный шаг к ВНЖ для вас и семьи, в разы дешевле полноценной покупки объекта.', point: 'Путь к резиденции без покупки целой квартиры' },
    en: { tag: 'Relocation', title: 'A path to Turkish residency', copy: 'A registered share is an accessible route toward residence permits for you and your family — at a fraction of buying a whole property.', point: 'Residency route without buying a whole apartment' },
  },
  {
    key: 'leisure',
    ru: { tag: 'Отдых', title: 'Своё место у моря — каждый год', copy: 'Стабильная точка возвращения раз в год, без забот о содержании: приезжаете — и всё готово к отдыху.', point: 'Гарантированные недели без аренды и хлопот' },
    en: { tag: 'Leisure', title: 'Your place by the sea — every year', copy: 'A stable place to return to once a year, with none of the upkeep: you arrive, and everything is ready.', point: 'Guaranteed weeks, no renting, no upkeep' },
  },
];

// ---------------------------------------------------------------------------
// TRUST / LEGAL
// ---------------------------------------------------------------------------
export const TRUST = {
  claim: {
    ru: 'Каждая сделка проходит через нотариуса и заканчивается ТАПУ на ваше имя.',
    en: 'Every deal goes through a notary and ends with a TAPU registered in your name.',
  },
  process: [
    { ru: 'Проверка объекта', en: 'Due diligence' },
    { ru: 'Нотариус', en: 'Notary' },
    { ru: 'Регистрация ТАПУ', en: 'TAPU registration' },
    { ru: 'Передача владения', en: 'Handover' },
  ],
  badges: [
    { ru: 'Официальный ТАПУ', en: 'Official TAPU' },
    { ru: 'Юрист на сделке', en: 'Lawyer on every deal' },
    { ru: 'Полная документация', en: 'Full documentation' },
  ],
  docs: [
    { key: 'full', accent: 'full', ru: 'Договор — полное владение', en: 'Full ownership — sample contract' },
    { key: 'fractional', accent: 'fractional', ru: 'Договор — дробное владение (ТАПУ)', en: 'Fractional ownership — TAPU agreement' },
    { key: 'timeshare', accent: 'timeshare', ru: 'Договор — таймшер', en: 'Timeshare — usage agreement' },
    { key: 'profile', accent: null, ru: 'О компании Baden Premium Projects', en: 'Baden Premium Projects — company profile' },
    { key: 'pricing', accent: null, ru: 'Прайс-лист и условия оплаты', en: 'Price list & payment terms' },
  ],
  packTitle: { ru: 'Пакет документов', en: 'The document pack' },
  packCopy: {
    ru: 'Отправляем по запросу — вместе с расчётом по конкретному объекту.',
    en: 'Sent on request, alongside a costing for the specific property.',
  },
  packCta: { ru: 'Запросить документы', en: 'Request the documents' },
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export const FAQ = [
  {
    ru: { q: 'Даёт ли доля в недвижимости вид на жительство в Турции?', a: 'Зарегистрированная собственность (включая долевой ТАПУ, при соблюдении минимального порога стоимости) может быть основанием для подачи на ВНЖ — точные условия и пороги устанавливает миграционная служба Турции и могут меняться. Это общая информация, а не гарантия и не юридическая консультация — перед покупкой уточняйте актуальные требования у иммиграционного юриста.' },
    en: { q: 'Does a share in the property lead to Turkish residency?', a: 'Registered ownership (including a shared TAPU, above a minimum value threshold) can be grounds for a residence permit application — the exact conditions and thresholds are set by Turkish immigration authorities and can change. This is general information, not a guarantee or legal advice — confirm current requirements with an immigration lawyer before you buy.' },
  },
  {
    ru: { q: 'Кто отвечает за содержание и управление объектом?', a: 'На каждый объект назначена управляющая команда на месте — уборка, обслуживание, бронирование недель для долевых и таймшер-владельцев. Управляющий сбор рассчитывается индивидуально по объекту и обсуждается на этапе консультации.' },
    en: { q: 'Who handles upkeep and management?', a: 'Each property has an on-site management team — cleaning, maintenance, and week-booking for fractional and timeshare owners. The management fee is calculated per property and discussed during your consultation.' },
  },
  {
    ru: { q: 'В какой валюте оформляется сделка и есть ли дополнительные расходы?', a: 'Сделки обычно номинируются в евро или турецких лирах в зависимости от объекта. Помимо цены входа, как правило, есть разовые расходы на оформление (нотариус, регистрация ТАПУ, перевод документов) — точный расчёт предоставляется индивидуально перед сделкой.' },
    en: { q: 'What currency is the deal in, and are there extra costs?', a: 'Deals are typically denominated in euros or Turkish lira depending on the property. Beyond the entry price, there are usually one-time registration costs (notary, TAPU registration, document translation) — an exact breakdown is provided individually before you commit.' },
  },
  {
    ru: { q: 'Нужно ли платить налоги на недвижимость в Турции?', a: 'Да, владение недвижимостью в Турции сопряжено с ежегодным налогом на имущество и, при сдаче в аренду, налогом на доход от аренды — ставки зависят от типа и стоимости объекта. Мы не даём налоговых консультаций: перед покупкой рекомендуем проконсультироваться с турецким налоговым юристом или бухгалтером.' },
    en: { q: 'Are there property taxes in Turkey?', a: 'Yes — property ownership in Turkey carries an annual property tax and, if you rent it out, tax on rental income; rates depend on the property type and value. We do not provide tax advice — we recommend consulting a Turkish tax lawyer or accountant before purchasing.' },
  },
];

export const DISCLAIMER = {
  ru: 'Это общая информация для ознакомления, а не юридическая, налоговая или финансовая консультация. Условия могут меняться в зависимости от объекта, законодательства и вашей личной ситуации — перед сделкой рекомендуем проконсультироваться с независимым юристом.',
  en: 'This is general informational content, not legal, tax, or financial advice. Terms can vary by property, by law, and by your personal situation — we recommend consulting an independent lawyer before you commit.',
};

// ---------------------------------------------------------------------------
// LEAD CAPTURE — the conversion surface. This is the page's whole job.
// ---------------------------------------------------------------------------
export const LEAD = {
  title: { ru: ['Подберём резиденцию', 'под вашу цель'], en: ['Find the residence', 'for your goal'] },
  copy: {
    ru: 'Оставьте контакт — расскажем про форматы, цены по сезонам и оформление ТАПУ в коротком разговоре, на русском.',
    en: 'Leave your contact — we’ll walk you through the models, seasonal pricing, and TAPU registration in a short call.',
  },
  fields: [
    { id: 'name', ru: 'Имя', en: 'Name', type: 'text', ac: 'name', required: true },
    { id: 'phone', ru: 'Телефон / WhatsApp', en: 'Phone / WhatsApp', type: 'tel', ac: 'tel', required: true },
    { id: 'time', ru: 'Удобное время (необязательно)', en: 'Preferred time (optional)', type: 'text', ac: 'off', required: false },
  ],
  submit: { ru: 'Отправить запрос', en: 'Send request' },
  sending: { ru: 'Отправляем…', en: 'Sending…' },
  consent: {
    ru: 'Нажимая кнопку, вы соглашаетесь на обработку контактных данных для обратной связи.',
    en: 'By submitting, you consent to your contact details being processed so we can reply.',
  },
  errorRequired: { ru: 'Укажите имя и телефон.', en: 'Please provide your name and phone.' },
  errorPhone: { ru: 'Проверьте номер — нужно не меньше 9 цифр.', en: 'Check the number — at least 9 digits.' },
  successTitle: { ru: 'Спасибо!', en: 'Thank you!' },
  successCopy: {
    ru: 'Мы получили запрос и свяжемся с вами в ближайшее время.',
    en: 'We’ve received your request and will be in touch shortly.',
  },
};

// Shared CTA labels — the page repeats its ask, in the same words, everywhere.
export const CTA = {
  lead: { ru: 'Оставить контакт', en: 'Leave your contact' },
  call: { ru: 'Заказать звонок', en: 'Request a call' },
  ask: { ru: 'Задать вопрос', en: 'Ask a question' },
  view: { ru: 'Смотреть', en: 'View' },
  whatsapp: { ru: 'Написать в WhatsApp', en: 'Message on WhatsApp' },
};

// A visible, non-negotiable marker for anything not yet confirmed. Every
// version renders this the same way in spirit: the visitor is never shown an
// invented figure that looks settled.
export const PLACEHOLDER = { ru: 'уточняется', en: 'to be confirmed' };

export function t(obj, isRu) {
  if (obj == null) return '';
  return isRu ? obj.ru : obj.en;
}

// Russian needs three forms where English needs two. Getting "5 объекта"
// wrong on a page selling to Russian speakers reads as a machine-translated
// site, which is the exact opposite of the credibility this page is buying.
// forms.ru: [1, 2–4, 5+] — e.g. ['объект', 'объекта', 'объектов'].
// forms.en: [singular, plural] — spelled out, so irregulars ("property" →
// "properties") never get an "s" bolted on.
export function plural(n, forms, isRu) {
  if (!isRu) return `${n} ${forms.en[n === 1 ? 0 : 1]}`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${forms.ru[0]}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${forms.ru[1]}`;
  return `${n} ${forms.ru[2]}`;
}
