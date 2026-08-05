import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// Very subtle pointer tilt for a hint of depth — no glare, small angles, kept
// restrained so it reads as craft rather than a tech gimmick.
export default function Tilt3D({ children, className = '', max = 4, scale = 1.01, perspective = 1400 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  // Pointer state is written on every mousemove but only *read* once per
  // frame. Mousemove fires far more often than the compositor paints (easily
  // 100-200Hz on a high-polling mouse), and each raw handler was doing a
  // getBoundingClientRect — a forced layout read — plus two motion-value
  // writes. With five of these mounted in the Properties rail that was the
  // single most expensive interaction on the page. Coalescing to one rAF tick
  // keeps the tilt identical to the eye and caps the layout reads at 60/s.
  const pointer = useRef({ cx: 0, cy: 0 });
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  if (reduce) return <div className={className}>{children}</div>;

  const flush = () => {
    frame.current = 0;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    x.set((pointer.current.cx - rect.left) / rect.width);
    y.set((pointer.current.cy - rect.top) / rect.height);
  };

  const onMove = (e) => {
    pointer.current.cx = e.clientX;
    pointer.current.cy = e.clientY;
    if (frame.current) return;
    frame.current = requestAnimationFrame(flush);
  };
  const onLeave = () => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{ perspective, transformStyle: 'preserve-3d' }}
      className={className}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}
