import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './motion';

// A quiet band between the hero and the amenities showcase — both full-bleed
// photo sections, both dark navy. Two earlier passes tried to make this
// section carry its own photograph and/or a big statement line, and both
// still read as a "quote block" no matter how the styling changed.
//
// Was briefly moved to the page's warm-paper surface (baden-ivory) to break
// up a run of navy sections, then moved back: the brief specifically wants
// this one dark BLUE (baden-dark), not the warm-neutral ivory — the
// "vary background tone" goal is carried by Properties/Audiences/LegalTrust
// instead, which stay ivory. The glow behind each figure was gold (the
// brand accent), then moved to a cool blue instead — on a section whose
// whole point is "dark blue," a warm gold glow fought the ground rather than
// sitting in it; no design token for this exists (own-frac's teal is
// reserved for the fractional-ownership legend, not decoration), so it's a
// literal value, matched by eye to the baden-dark ground. Opacity brought
// down from 0.16 to 0.07 in a follow-up pass — the first value read as a
// visible blue smudge competing with the text sitting on top of it, rather
// than an ambient wash seasoning the ground behind it.
export default function Statement() {
  const { isRu } = useLanguage();

  const facts = [
    { value: '5', label: isRu ? 'Резиденций' : 'Residences' },
    { value: '3', label: isRu ? 'Формата владения' : 'Ownership formats' },
    { value: '1', label: isRu ? 'Побережье' : 'Coastline' },
  ];

  return (
    <section className="relative w-full overflow-hidden border-y border-baden-line bg-baden-dark">
      {/* Off-centre wash, not a symmetric vignette — keeps this from reading
          as a stock "light card" background and gives the section its own
          quiet asymmetry against the strictly-centred hero above it. */}
      <div
        className="pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-[rgba(94,150,224,0.07)] blur-[70px]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center md:px-10 md:py-20">
        <Reveal as="div" className="flex flex-col items-center gap-4">
          <span className="block h-px w-12 bg-baden-line" aria-hidden />
          <span className="text-[10px] tracking-widest3 uppercase text-baden-on-dark/55">
            {isRu ? 'Портфель' : 'The portfolio'}
          </span>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-8"
        >
          {facts.map((f) => (
            <div key={f.label} className="relative flex flex-col items-center gap-2 px-8">
              {/* The highlight: a soft radial glow sits behind each figure,
                  not the label — the number is the thing worth noticing. */}
              <span
                className="pointer-events-none absolute -inset-x-2 -inset-y-3 rounded-full bg-[rgba(94,150,224,0.07)] blur-xl"
                aria-hidden
              />
              <span className="relative font-display text-4xl font-light tabular-nums leading-none text-baden-on-dark md:text-5xl">
                {f.value}
              </span>
              <span className="relative text-[11px] tracking-widest2 uppercase text-baden-on-dark/55">{f.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
