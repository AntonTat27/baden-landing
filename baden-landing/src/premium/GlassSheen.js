import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'framer-motion';

// A pointer-reactive glass highlight — a soft radial glare that tracks the
// cursor across the card, like light catching a glossy pane. Paired with
// Tilt3D, this is what sells the "floating glass panel" read from the
// reference without resorting to a literal glass texture.
export default function GlassSheen({ className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 120, damping: 22 });
  const smy = useSpring(my, { stiffness: 120, damping: 22 });
  const background = useMotionTemplate`radial-gradient(320px circle at ${smx}% ${smy}%, rgba(255,255,255,0.22), transparent 60%)`;

  if (reduce) return null;

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      aria-hidden
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${className}`}
      style={{ background }}
    />
  );
}
