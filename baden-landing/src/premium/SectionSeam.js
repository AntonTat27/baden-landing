import React from 'react';

// A small, deliberate stitch between two sections that land on the SAME
// surface tone — currently only Audiences -> LegalTrust, both baden-ivory.
// Everywhere else on the page, the light/dark alternation itself is the
// separator (see PremiumHome.js), so this is used sparingly rather than
// as a default between every section.
//
// Rendered as its own element BETWEEN the two <section>s in PremiumHome.js,
// not nested inside either one — an earlier version tried to straddle the
// boundary with a negative top offset from inside the second section, but
// both sections use `overflow-hidden` (for their ambient blurred discs),
// which clipped the seam into invisibility. A plain in-flow row between the
// two sections has no clipping to fight and is guaranteed visible.
export default function SectionSeam({ label }) {
  return (
    <div className="relative z-10 flex items-center justify-center gap-3 bg-baden-ivory py-5" aria-hidden>
      <span className="h-px w-10 bg-baden-ink-line" />
      {label && <span className="whitespace-nowrap text-[10px] tracking-widest3 uppercase text-baden-ink-muted">{label}</span>}
      <span className="h-px w-10 bg-baden-ink-line" />
    </div>
  );
}
