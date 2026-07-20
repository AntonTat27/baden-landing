import React, { useState } from 'react';
import { positionFor } from '../assets/imagePositions';
import useInView from '../hooks/useInView';

// Shared expanding-panels accordion: N items share one horizontal (desktop) /
// vertical (mobile) strip; hovering/focusing a panel expands it, clicking the
// already-expanded panel fires onActivate. Originally built for Listings,
// now the base for both Listings and Amenities so the interaction language
// stays consistent across the two sections.
export default function ExpandingPanels({ items, renderCollapsed, renderExpanded, onActivate, ariaLabel }) {
  const [active, setActive] = useState(0);
  const [stripRef, stripInView] = useInView(0.12);

  const activate = (item, i) => {
    if (i === active) onActivate?.(item, i);
    else setActive(i);
  };

  return (
    <div
      ref={stripRef}
      className="flex flex-col md:flex-row gap-2 h-[140vw] max-h-[720px] md:h-[70vh] md:max-h-[640px]"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <div
            key={item.key}
            role="button"
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => activate(item, i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate(item, i);
              }
            }}
            aria-label={ariaLabel ? ariaLabel(item) : undefined}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.16,0.4,1)] ${
              isActive ? 'flex-[4] md:flex-[3.2]' : 'flex-1'
            } ${stripInView ? '' : 'opacity-0'}`}
            style={{
              animation: stripInView ? `rise 650ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms both` : 'none',
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: positionFor(item.image),
                  // Ambient breathing: constant-scale horizontal drift,
                  // phase/direction offset per panel so the strip never syncs
                  animation: `driftx ${18 + i * 3}s ease-in-out ${-i * 6}s infinite ${
                    i % 2 ? 'alternate-reverse' : 'alternate'
                  }`,
                }}
              />
            ) : (
              item.fallback
            )}
            {/* Neutral tint: heavier on collapsed panels so the active one reads lit */}
            <div
              className={`absolute inset-0 transition-colors duration-700 ${
                isActive ? 'bg-black/15' : 'bg-black/55'
              }`}
              aria-hidden
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden
            />

            {/* Collapsed label — horizontal on mobile, vertical on desktop */}
            <div
              className={`absolute inset-0 flex items-center px-5 md:px-0 md:justify-center transition-opacity duration-500 ${
                isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {renderCollapsed(item, i)}
            </div>

            {/* Expanded details — children cascade in with a short stagger
                once the panel opens; collapse resets instantly (no delay) */}
            <div className={`absolute inset-x-0 bottom-0 p-6 md:p-8 ${isActive ? '' : 'pointer-events-none'}`}>
              {renderExpanded(item, i, isActive).map((child, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                  style={{ transitionDelay: isActive ? `${180 + idx * 80}ms` : '0ms' }}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
