import React from 'react';
import arrivalImg from '../assets/images/arrival.jpg';
import { positionFor } from '../assets/imagePositions';
import { useLanguage } from '../context/LanguageContext';

// DRAFT COPY — client has said not to worry about final wording here yet.
// This is a hinge/transition moment, not a full section: one image, one line.
export default function ArrivalFrame() {
  const { isRu } = useLanguage();

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-baden-base">
      <img
        src={arrivalImg}
        alt="Baden Premium Projects — sea horizon"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: positionFor(arrivalImg),
          filter: 'brightness(0.78) saturate(0.8) sepia(0.16) contrast(1.03)',
        }}
      />
      {/* Full-frame warm wash — consistent opacity across the whole image so
          the sea/sky read warm everywhere, not just near the text */}
      <div className="absolute inset-0 bg-baden-base/45" aria-hidden />
      <div className="absolute inset-0 bg-baden-gold/10 mix-blend-multiply" aria-hidden />
      {/* Blend strips into the sections above/below */}
      <div
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent z-10"
        aria-hidden
      />
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-baden-panel to-transparent z-10"
        aria-hidden
      />

      <div className="relative z-20 flex h-full items-center justify-center px-6 text-center">
        <p className="font-display text-2xl sm:text-3xl md:text-4xl text-baden-cream max-w-2xl">
          {isRu ? 'Всё начинается с моря на горизонте.' : 'It all begins with the sea on the horizon.'}
        </p>
      </div>
    </section>
  );
}
