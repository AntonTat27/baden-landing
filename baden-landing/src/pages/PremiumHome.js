import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../premium/Hero';
import Amenities from '../premium/Amenities';
import Properties from '../premium/Properties';
import HowItWorks from '../premium/HowItWorks';
import Audiences from '../premium/Audiences';
import LegalTrust from '../premium/LegalTrust';
import LeadSection from '../premium/LeadSection';

// The premium single-page experience. Ordered as a narrative:
// establish (hero, incl. key stats) → desire (amenities) → choose (properties)
// → understand (how it works) → self-identify (audiences) → trust (legal)
// → act (lead form).
export default function PremiumHome() {
  const location = useLocation();

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
      <Hero />
      <Amenities />
      <Properties />
      <HowItWorks />
      <Audiences />
      <LeadSection />
    </>
  );
}
