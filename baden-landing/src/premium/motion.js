// Shared Framer Motion primitives for the premium site. Centralizing the
// variants keeps easing/timing consistent across every section and makes the
// motion system legible in one place.
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Calm, expensive-feeling easing — a soft overshoot-free ease-out.
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

// Container that staggers its children's entrance.
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

// Line-by-line headline reveal (mask + rise).
export const lineReveal = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
};

// Reveal-on-scroll wrapper. Fires once, respects reduced motion.
export function Reveal({
  children,
  className = '',
  variants = fadeUp,
  amount = 0.3,
  delay = 0,
  as = 'div',
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

// Masked single-line headline. Pass an array of strings (one per visual line).
export function RevealLines({ lines, className = '', lineClassName = '', delayChildren = 0.05 }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {l}
          </span>
        ))}
      </span>
    );
  }
  return (
    <motion.span
      className={className}
      variants={stagger(0.12, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      {lines.map((l, i) => (
        <span key={i} className={`block overflow-hidden ${lineClassName}`}>
          <motion.span className="block" variants={lineReveal}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export { motion };
