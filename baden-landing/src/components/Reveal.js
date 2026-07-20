import React from 'react';
import useInView from '../hooks/useInView';

// Shared scroll-triggered reveal: content fades/rises in once, the first time
// it enters the viewport (useInView disconnects after firing, so nothing
// replays on the way back up). Distances stay small and easing calm.
// Under prefers-reduced-motion the global CSS collapses the transition to an
// instant state change.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 700,
  threshold = 0.2,
  className = '',
}) {
  const [ref, inView] = useInView(threshold);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translate3d(0, ${y}px, 0)`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
