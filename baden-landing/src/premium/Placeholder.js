import React, { useMemo } from 'react';

// Quiet, image-free swatch used in place of the low-quality renders.
// Warm neutral tonal gradient with a soft horizon line and a faint architectural
// silhouette — reads as an elegant "render pending" plate rather than a photo.
// Deterministic per `seed`.

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

// Warm, restrained neutral pairs (top → bottom)
const SCHEMES = [
  { top: '#EFE7D8', bot: '#D8CBB2' }, // ivory → sand
  { top: '#E7DFCF', bot: '#CDBEA2' }, // greige → taupe
  { top: '#EDE4D2', bot: '#D3C4A8' }, // warm stone
  { top: '#E4DDCB', bot: '#C9BB9F' }, // olive-sand
];

export default function Placeholder({
  seed = 'baden',
  label,
  index,
  className = '',
  rounded = 'rounded-2xl',
  monogram = 'B',
}) {
  const r = useMemo(() => hash(String(seed)), [seed]);
  const scheme = SCHEMES[Math.floor(r * SCHEMES.length) % SCHEMES.length];
  const angle = 145 + Math.floor(r * 30);
  const horizon = 58 + Math.floor(r * 18); // %

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${scheme.top} 0%, ${scheme.bot} 100%)` }}
      aria-hidden
    >
      {/* Soft light pooling from the upper corner */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 70% at 22% 12%, rgba(255,255,255,0.45), transparent 60%)' }}
      />

      {/* Faint architectural silhouette on the horizon */}
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" className="absolute inset-x-0 bottom-0 w-full" style={{ top: `${horizon}%` }}>
        <g fill="rgba(35,32,26,0.06)">
          <rect x="26" y="120" width="70" height="120" rx="2" />
          <rect x="104" y="86" width="58" height="154" rx="2" />
          <rect x="170" y="140" width="90" height="100" rx="2" />
          <rect x="268" y="70" width="52" height="170" rx="2" />
          <rect x="326" y="150" width="60" height="90" rx="2" />
        </g>
        {/* a couple of slender palms */}
        <g stroke="rgba(35,32,26,0.08)" strokeWidth="2" fill="none">
          <path d="M60 240 q2 -46 0 -70 M60 172 q-16 -8 -26 -2 M60 172 q16 -8 26 -2" />
          <path d="M300 240 q2 -40 0 -60 M300 182 q-14 -8 -22 -2 M300 182 q14 -8 22 -2" />
        </g>
      </svg>

      {/* Thin horizon line */}
      <div className="absolute inset-x-0 h-px bg-lux-ink/10" style={{ top: `${horizon + 24}%` }} />

      {/* Ghost monogram */}
      <span className="absolute -bottom-5 right-3 font-display font-light text-[7rem] leading-none text-lux-ink/[0.06] select-none">
        {monogram}
      </span>

      {label && (
        <span className="absolute top-4 left-4 text-[10px] tracking-widest2 uppercase text-lux-ink/70 bg-lux-paper/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {label}
        </span>
      )}

      {/* Crafted inner edge */}
      <div className={`absolute inset-0 ${rounded} ring-1 ring-inset ring-lux-ink/10`} />
    </div>
  );
}
