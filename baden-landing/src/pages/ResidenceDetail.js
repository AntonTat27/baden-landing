import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { OWNERSHIP_MODELS, MONTHS, formatEUR } from '../data/units';
import { useUnits } from '../context/UnitsContext';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines } from '../premium/motion';
import OwnershipVisualizer from '../premium/OwnershipVisualizer';

// A full year of weeks, same as the timeshare model's own ring elsewhere on
// the site — not an arbitrary 4-week cap. Month names sit around the ring
// (see `monthLabels` below) so a raw week count reads as a place in the
// calendar, not just a number.
const WEEKS_IN_YEAR = 52;

// One section, one dark ground — this page used to be four stacked sections
// (photo band, blurb, calculator, a boxed lead form) each on its own slightly
// different dark shade, which is what made it feel like a mess of leftover
// pre-redesign pieces rather than one considered screen. Everything the page
// actually needs — what this is, what it costs, what a stay costs — now
// lives in one section over the property's own photo, and the calculator
// reuses the same ring diagram from HowItWorks: two knobs you press and drag
// around a 52-week dial, one for arrival, one for departure, with month
// names marking where each month starts.
//
// This used to be a single count ("how many weeks, counting from week 1")
// with one drag handle — the wrong model for booking a stay, which is
// actually an arrival/departure PAIR. It's a start/end range now: `range`
// (OwnershipVisualizer.js) takes both boundaries and renders one handle per
// end.
//
// There also used to be a SEPARATE month-picker (a row of 12 pill buttons)
// above this, driving `unit.prices[monthIndex]` independently from the
// weeks. Once the ring itself carries month labels, that second control is
// redundant — it asks the same "which point in the year" question twice.
// The month used for pricing is derived from the arrival week instead, so
// there is exactly one control.
export default function ResidenceDetail() {
  const { id } = useParams();
  const { isRu } = useLanguage();
  const { units, ready } = useUnits();
  const unit = units.find((u) => u.id === id);

  // A one-week default stay, starting "now" on the 52-week ring.
  const [range, setRange] = useState(() => {
    const week = Math.min(WEEKS_IN_YEAR, Math.round(((new Date().getMonth() + 0.5) * WEEKS_IN_YEAR) / 12) + 1);
    return [week, week];
  });
  const [startWeek, endWeek] = range;
  const weeksCount = endWeek - startWeek + 1;

  // Client-side routing doesn't reset scroll position on navigation, and
  // this page is now one short section rather than the four stacked ones it
  // used to be — a visitor who clicked a card while scrolled deep into the
  // homepage landed with the browser's leftover scrollY exceeding this
  // page's now-shorter height, which the browser clamps to the bottom.
  // Reset on mount and on every residence swap (`id`), not just once.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Where each month starts on the 52-week ring — 52/12 weeks per month,
  // rounded so the twelve labels land on whole ticks.
  const monthStarts = useMemo(() => MONTHS.map((_, i) => Math.round((i * WEEKS_IN_YEAR) / 12)), []);
  const monthLabels = useMemo(
    () => MONTHS.map((m, i) => ({ index: monthStarts[i], label: isRu ? m.short.ru : m.short.en })),
    [isRu, monthStarts]
  );
  // The month the arrival week falls into: the last month whose start week
  // is at or before it. Pricing is keyed off arrival, not departure.
  const monthIndex = useMemo(() => {
    const boundary = startWeek - 1;
    let m = 0;
    for (let i = 0; i < monthStarts.length; i += 1) {
      if (monthStarts[i] <= boundary) m = i;
    }
    return m;
  }, [startWeek, monthStarts]);

  if (!unit) {
    if (!ready) return null;
    return <Navigate to="/" replace />;
  }

  const monthlyPrice = unit.prices[monthIndex];
  const pricePerWeek = Math.round(monthlyPrice / 4);
  const illustrativeTotal = pricePerWeek * weeksCount;
  const primaryModel = unit.ownership[0] || 'full';

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-baden-dark">
      <img
        src={unit.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: positionFor(unit.image),
          filter: 'saturate(0.9) brightness(0.7)',
          animation: 'kenburns 34s ease-in-out infinite alternate',
        }}
      />
      <div className="absolute inset-0 bg-baden-dark/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-baden-dark via-baden-dark/70 to-baden-dark"
        aria-hidden
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <Link
          to="/#properties"
          className="text-xs tracking-widest2 uppercase text-baden-on-dark/60 hover:text-baden-brand transition-colors duration-200 mb-8 inline-block w-fit"
        >
          &larr; {isRu ? 'Все варианты' : 'All options'}
        </Link>

        <p className="text-xs tracking-widest2 uppercase text-baden-brand mb-3">
          {isRu ? unit.location.ru : unit.location.en} &middot;{' '}
          {unit.ownership.map((k) => (isRu ? OWNERSHIP_MODELS[k].ru.label : OWNERSHIP_MODELS[k].en.label)).join(isRu ? ' или ' : ' or ')}
        </p>
        <h1 className="font-display font-light text-4xl md:text-6xl text-baden-on-dark max-w-2xl leading-[1.04] tracking-[-0.02em]">
          <RevealLines lines={[isRu ? unit.name.ru : unit.name.en]} />
        </h1>
        <Reveal delay={0.1} className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-baden-on-dark/60">
          <span>{unit.size}</span>
          <span>
            {unit.bedrooms} {isRu ? 'спальни' : 'BR'} · {unit.guests} {isRu ? 'гостей' : 'guests'}
          </span>
          <span className="text-baden-brand font-display text-base">
            {isRu ? 'Владеть от ' : 'Own from '}
            {formatEUR(unit.entryFrom)}
          </span>
        </Reveal>

        {/* The calculator — the one thing this page actually does. A single
            card so it reads as one instrument, not a sequence of form rows. */}
        <Reveal delay={0.2} className="mt-14 rounded-panel border border-baden-line bg-baden-dark-2/60 backdrop-blur-sm p-6 md:p-10">
          <p className="text-xs tracking-widest2 uppercase text-baden-brand-bright mb-2">
            {isRu ? 'Калькулятор' : 'Calculator'}
          </p>
          <p className="text-sm text-baden-on-dark/55 mb-8 max-w-lg leading-relaxed">
            {isRu
              ? 'Иллюстративная оценка стоимости использования — отдельно от стоимости входа во владение, указанной выше.'
              : 'An illustrative usage-cost estimate — separate from the ownership entry price shown above.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
            {/* Arrival/departure, picked by pressing and dragging either
                knob around the same ring diagram HowItWorks uses for
                ownership — the filled knob is arrival, the hollow one is
                departure. Month names mark where each month starts, and the
                arrival knob's position also drives the month used for
                pricing below (see the header note on why the old separate
                month picker is gone). Clicking a tick moves whichever knob
                is nearer. */}
            <div className="flex flex-col items-center">
              <p className="text-[11px] tracking-widest2 uppercase text-baden-on-dark/55 mb-4 self-start md:self-center">
                {isRu ? 'Недели (иллюстративно)' : 'Weeks (illustrative)'}
              </p>
              <OwnershipVisualizer
                model={primaryModel}
                isRu={isRu}
                size={240}
                segments={WEEKS_IN_YEAR}
                range={range}
                onRangeChange={(start, end) => setRange([start, end])}
                segmentLabels={monthLabels}
                forceTicks
                draggable
                hideCaption
              />
              <p className="mt-5 font-display text-lg text-baden-on-dark tabular-nums text-center">
                {isRu ? `Неделя ${startWeek}` : `Week ${startWeek}`}
                {endWeek !== startWeek ? ` – ${endWeek}` : ''}
                {' · '}
                {weeksCount} {isRu ? (weeksCount === 1 ? 'неделя' : weeksCount < 5 ? 'недели' : 'недель') : weeksCount === 1 ? 'week' : 'weeks'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-baden-on-dark/60 mb-2">
                  {isRu ? `${MONTHS[monthIndex].ru} · за месяц` : `${MONTHS[monthIndex].en} · per month`}
                </p>
                <p key={monthlyPrice} className="font-display text-2xl text-baden-on-dark animate-[fadein_350ms_ease]">
                  {formatEUR(monthlyPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-baden-on-dark/60 mb-2">
                  {isRu ? 'Ориентировочно за неделю' : 'Approx. per week'}
                </p>
                <p key={pricePerWeek} className="font-display text-2xl text-baden-on-dark animate-[fadein_350ms_ease]">
                  {formatEUR(pricePerWeek)}
                </p>
              </div>
              <div>
                <p className="text-xs text-baden-on-dark/60 mb-2">
                  {isRu ? `Итого за ${weeksCount} нед. (иллюстративно)` : `Total for ${weeksCount} wk(s) (illustrative)`}
                </p>
                <p
                  key={illustrativeTotal}
                  className="font-display text-2xl text-baden-brand-bright animate-[fadein_350ms_ease]"
                >
                  {formatEUR(illustrativeTotal)}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-10">
          <Link
            to="/#contact"
            className="group inline-flex items-center gap-3 text-xs md:text-sm tracking-widest2 uppercase text-baden-brand-bright border border-baden-brand/50 px-8 py-4 rounded-full hover:bg-baden-brand/10 hover:border-baden-brand transition-colors duration-300"
          >
            {isRu ? 'Получить консультацию' : 'Get a consultation'}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
