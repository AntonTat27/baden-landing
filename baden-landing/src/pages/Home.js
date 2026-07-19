import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import ArrivalFrame from '../components/ArrivalFrame';
import Showcase from '../components/Showcase';
import Listings from '../components/Listings';
import HowItWorks from '../components/HowItWorks';
import WhySelector from '../components/WhySelector';
import TrustBlock from '../components/TrustBlock';
import LeadForm from '../components/LeadForm';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // slight delay so the section has laid out before we scroll to it
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
      <ArrivalFrame />
      <Showcase />
      <Listings />
      <HowItWorks />
      <WhySelector />
      <TrustBlock />
      <LeadForm />
    </>
  );
}
