// Shared Framer Motion primitives for the premium site. Centralizing the
// variants keeps easing/timing consistent across every section and makes the
// motion system legible in one place.
import React, { useEffect, useRef, useState } from 'react';
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

// WHY THIS EXISTS INSTEAD OF `whileInView`
// ---------------------------------------------------------------------------
// framer-motion's `viewport={{ amount: N }}` only fires once N *percent of the
// element* is on screen. For a masked headline that is a correctness bug, not
// just a missed animation: the hidden state translates the text fully out of
// an `overflow-hidden` mask, so a headline whose threshold is never crossed
// (taller than the viewport, short viewport, an anchor jump that lands past
// it) is not merely unanimated — it is permanently invisible. That is what
// clipped the HowItWorks headline.
//
// So: observe with `threshold: 0` (ANY visible pixel counts, regardless of how
// tall the element is) and use rootMargin for the poise that `amount` used to
// provide — the element has to clear the bottom 12% of the viewport before it
// plays, which looks the same but can't deadlock. If IntersectionObserver is
// unavailable at all, we show immediately rather than leaving content hidden.
function useRevealTrigger(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0, rootMargin }
    );
    io.observe(el);
    // Belt and braces: if the observer somehow never delivers a callback (it
    // has been flaky under some in-page scroll containers), the content still
    // becomes visible rather than staying stuck behind the mask.
    const safety = setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [rootMargin, shown]);

  return [ref, shown];
}

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
  // `amount` is kept as the public knob callers already pass, but it now maps
  // to a rootMargin offset rather than an intersection ratio — same "wait
  // until it's properly on screen" feel, without the tall-element deadlock
  // described above. Reveal's default variant hides via opacity, so the same
  // failure mode (invisible content, not just unanimated content) applied here.
  const [ref, shown] = useRevealTrigger(`0px 0px -${Math.round(amount * 40)}% 0px`);
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
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={shown ? 'show' : 'hidden'}
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
  const [ref, shown] = useRevealTrigger();
  // pb-[0.16em] gives descenders (Cyrillic у/р/ф, Latin g/y/p) room inside the
  // overflow-hidden mask below — without it, the mask clips them flush at the
  // baseline.
  if (reduce) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block pb-[0.16em] ${lineClassName}`}>
            {l}
          </span>
        ))}
      </span>
    );
  }
  return (
    <motion.span
      ref={ref}
      className={className}
      variants={stagger(0.12, delayChildren)}
      initial="hidden"
      animate={shown ? 'show' : 'hidden'}
    >
      {lines.map((l, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.16em] ${lineClassName}`}>
          <motion.span className="block" variants={lineReveal}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export { motion };
