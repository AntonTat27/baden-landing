import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../premium/Hero';
import SectionRail from '../premium/SectionRail';
import Statement from '../premium/Statement';
import Amenities from '../premium/Amenities';
import Properties from '../premium/Properties';
import HowItWorks from '../premium/HowItWorks';
import Audiences from '../premium/Audiences';
import SectionSeam from '../premium/SectionSeam';
import LegalTrust from '../premium/LegalTrust';
import LeadSection from '../premium/LeadSection';
import Faq from '../premium/Faq';
import StickyRecapBar from '../premium/StickyRecapBar';

// The premium single-page experience. Ordered as a narrative:
// establish (hero) → desire (amenities) → understand (ownership formats) →
// choose (properties) → self-identify (audiences) → trust (legal + documents) →
// act (lead form) → reference (FAQ, last on purpose, kept out of the way of
// the conversion flow above).
//
// MarbleDivider is gone from between the sections. A decorative band whose
// only job is to announce "a new section starts here" is a symptom of
// sections that do not compose, not a fix for it: it made the page read as
// eight separate pages stapled together, which was the brief's main
// complaint. The sections now meet directly, and the light/dark/mid surface
// alternation plus varied vertical rhythm carries the transitions.
//
// This was its only consumer, so src/premium/MarbleDivider.js is deleted
// rather than left orphaned.
export default function PremiumHome() {
  const location = useLocation();
  const { isRu } = useLanguage();
  // Hero's background parallax tracks scroll across this wrapper (Hero +
  // Statement together), not Hero's own section — see Hero.js's own note on
  // `parallaxRef`. Progress hits 1, and the drift/zoom holds still, exactly
  // when this wrapper's bottom (Statement's bottom = Amenities' top) reaches
  // the viewport top, i.e. once Amenities fully occupies the screen.
  const heroParallaxRef = useRef(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* Hero's scroll-tied parallax tracks this wrapper, not Hero's own
          section — see heroParallaxRef above and Hero.js's own note. */}
      <div ref={heroParallaxRef}>
        <Hero parallaxRef={heroParallaxRef} />
        {/* Statement is NOT a revived MarbleDivider — see the note above and
            the component's own header. It carries the positioning line,
            both here and in the hero's own dark-navy ground. */}
        <Statement />
      </div>
      <SectionRail />
      <Amenities />
      {/* One "Formats" block: the three ownership formats first, then the
          residences sold under them — no seam between, one nav entry. */}
      <HowItWorks />
      <Properties />
      <Audiences />
      {/* Audiences and LegalTrust are the one pair of adjacent sections
          that share a surface tone (both baden-ivory) — an explicit seam
          marks that boundary; every other transition relies on the
          light/dark alternation itself. See SectionSeam.js. */}
      <SectionSeam label={isRu ? 'Документы и право' : 'Documents & legal'} />
      <LegalTrust />
      <LeadSection />
      <Faq />
      {/* Mobile-only: persistent price + CTA once past the hero */}
      <StickyRecapBar />
    </>
  );
}
