import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE } from './motion';
import { formatEUR } from '../data/units';
import { useUnits } from '../context/UnitsContext';

// Spring used for the hover "pop" on an individual wedge/tick — deliberately
// stiffer/lighter than the entrance spring below, so a hover reads as an
// instant, physical response rather than a settling motion.
const HOVER_SPRING = { type: 'spring', stiffness: 420, damping: 20, mass: 0.4 };

// The signature interaction (guide §5) — spent on the product mechanic
// itself, not on hero scenery. One ring, standing in for a single property,
// visibly divides as the visitor switches ownership model:
//   full        → one solid, uncut ring (the whole property, no co-owners)
//   fractional  → the ring splits into a handful of wedges, one highlighted
//                 (your registered share)
//   timeshare   → instead of a slice of the ring (a share metaphor that
//                 doesn't fit timeshare), small tick marks around the ring
//                 stand in for individual weeks, a few of them highlighted —
//                 closer to how a timeshare actually works.
// A visitor who plays with this understands fractional ownership better than
// a paragraph of copy would — and it's specific to what Baden actually sells.
//
// Each model gets its own distinct hue again — this is data encoding (three
// different legal things), not decoration, so it is the one place on the
// page a second and third hue is earned. See ACCENT_HEX below.

const SEGMENTS_BY_MODEL = { full: 1, fractional: 6, timeshare: 52 };
const HIGHLIGHT_BY_MODEL = { full: 1, fractional: 1, timeshare: 3 };

// Literal hex, not a Tailwind class — SVG fill can't reach into Tailwind's
// arbitrary-value pipeline. Must track the own-* tokens in tailwind.config.js
// by hand: an SVG fill cannot read a Tailwind token, so this is the one place
// the legend values are duplicated. If the palette moves, move these with it.
const ACCENT_HEX = {
  full: '#D9A653', // matches baden.own-full — gold
  fractional: '#4FA5AC', // matches baden.own-frac — teal
  timeshare: '#CC7085', // matches baden.own-share — rust/rose
};
// One dark ground now, so one neutral set — the on-light variant this used
// to carry (for HowItWorks' old mid/putty surface) is gone with that surface.
const NEUTRALS = {
  line: 'rgba(237,231,218,0.18)', // on-dark hairline
  dimFill: 'rgba(237,231,218,0.08)', // on-dark, faint
  dimStroke: 'rgba(237,231,218,0.22)', // on-dark, faint
};

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function donutSegmentPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

// A simple roofline glyph sits at the centre so the ring reads as "a
// property," not an abstract pie chart.
function VillaGlyph({ color }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 md:h-12 md:w-12" fill="none">
      <path d="M10 26L24 14l14 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M14 24v12h20V24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M20 36v-7h8v7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}

export default function OwnershipVisualizer({
  model,
  isRu,
  size = 280,
  // Reused as a generic "select a count on a ring" control (the residence
  // detail page's weeks picker) rather than the fixed model→segment mapping
  // below — when passed, `segments`/`selected` override SEGMENTS_BY_MODEL/
  // HIGHLIGHT_BY_MODEL, `onSelectSegment(n)` makes each tick/wedge clickable
  // (1-indexed: clicking the 3rd tick selects "3"), `forceTicks` renders tick
  // marks regardless of `model` (ticks read as "units of something" better
  // than wedges for a plain count), and `hideCaption` suppresses the built-in
  // caption/price text so the caller can render its own beside the ring.
  segments,
  selected,
  onSelectSegment,
  forceTicks = false,
  hideCaption = false,
  // Small text labels at specific tick indices, outside the ring — the
  // residence detail page's weeks picker uses this to mark where each month
  // starts on the 52-week ring, so "week 22" reads as "early June" instead
  // of a bare number. `[{ index, label }]`, index 0-based into `segments`.
  segmentLabels,
  // RANGE MODE — an arrival/departure pair (`[startWeek, endWeek]`, both
  // 1-indexed, inclusive) instead of a single count from the start. Two
  // grabbable knobs sit on the ring, one per boundary; press-drag either one
  // around the ring to move just that end, independent of the other. This is
  // what the residence detail page's weeks picker actually needed — "which
  // weeks am I there," not "how many weeks counting from week 1" — a single
  // count/single-handle version was tried first and was the wrong model.
  // Requires `onRangeChange(start, end)`. `draggable` gates the handles.
  range,
  onRangeChange,
  draggable = false,
}) {
  const reduce = useReducedMotion();
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const { units } = useUnits();
  // Which handle ('start' | 'end' | null) is currently being dragged. Kept
  // as state (for the visual grow-on-drag effect) AND mirrored into a ref
  // (see dragHandleRef below) — the window-level pointermove listener needs
  // the ref, since a listener attached in an effect closes over whatever
  // `dragHandle` was at attach time, and re-attaching the listener on every
  // state change is unnecessary churn for something a ref does more simply.
  const [dragHandle, setDragHandle] = useState(null);
  const dragHandleRef = useRef(null);
  // Same freshness problem, mirrored for the range values themselves: the
  // window listener is attached once per drag (effect keyed on whether a
  // drag is active, not on the range), so it must read the LATEST start/end
  // through a ref rather than closing over the range prop from mount time.
  const rangeValueRef = useRef(null);
  // A hovered index from the previous model's shape count could otherwise
  // point at nothing (or the wrong thing) once the shape count changes —
  // e.g. hovering wedge 5 of 6 in `fractional`, then switching straight to
  // `full` (1 shape). Reset on every model change.
  React.useEffect(() => {
    setHoverIdx(null);
  }, [model]);
  const total = segments ?? SEGMENTS_BY_MODEL[model];
  const highlighted = selected ?? HIGHLIGHT_BY_MODEL[model];
  const rangeMode = Array.isArray(range) && range.length === 2;
  const [rangeStart, rangeEnd] = rangeMode ? range : [1, highlighted];
  rangeValueRef.current = [rangeStart, rangeEnd];
  const accentHex = ACCENT_HEX[model];
  // Live "from" price for whichever units actually sell under this model —
  // real data (units' entryFrom), not an invented figure, same discipline as
  // the rest of the page.
  const modelUnits = units.filter((u) => u.ownership.includes(model));
  const fromPrice = modelUnits.length ? Math.min(...modelUnits.map((u) => u.entryFrom)) : null;
  const { line: LINE_HEX, dimFill: DIM_FILL, dimStroke: DIM_STROKE } = NEUTRALS;
  const onSurfaceText = 'text-baden-on-dark/70';
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.46;
  const rInner = size * 0.3;
  // Only meaningful when the ring is actually cut into wedges — the
  // `total === 1` (full ownership) case renders as an uncut stroked circle
  // and never reads these. Tighter gaps at high segment counts so 52 weeks
  // don't dissolve into gaps.
  const gapDeg = total > 20 ? 0.9 : 3.2;
  const step = 360 / total;
  const isTimeshare = forceTicks || model === 'timeshare';
  // Tick marks sit inside the ring band rather than spanning it full-width,
  // so they read as marks on a dial (individual weeks) rather than pie
  // wedges (a share of the whole) — a better metaphor for a timeshare.
  const tickROuter = rOuter - (rOuter - rInner) * 0.12;
  const tickRInner = rInner + (rOuter - rInner) * 0.12;

  // DRAG HANDLES — converts a pointer position into a 1-indexed week on the
  // ring. `size`/viewBox share one coordinate space (width/height both equal
  // `size`), so client px only need an offset by the SVG's own bounding
  // rect, no extra scale factor.
  function weekFromPoint(clientX, clientY) {
    const rect = svgRef.current.getBoundingClientRect();
    const scale = size / rect.width;
    const px = (clientX - rect.left) * scale;
    const py = (clientY - rect.top) * scale;
    const deg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90;
    const normalized = deg < 0 ? deg + 360 : deg;
    return (Math.round(normalized / step) % total) + 1;
  }
  // Dragging the start handle past the end (or vice versa) clamps rather
  // than crosses — the range can collapse to a single week but never invert.
  function updateRangeFromPoint(clientX, clientY) {
    const which = dragHandleRef.current;
    if (!which || !onRangeChange) return;
    const week = weekFromPoint(clientX, clientY);
    const [curStart, curEnd] = rangeValueRef.current;
    if (which === 'start') onRangeChange(Math.min(week, curEnd), curEnd);
    else onRangeChange(curStart, Math.max(week, curStart));
  }
  function beginDrag(which) {
    return (e) => {
      if (!onRangeChange) return;
      dragHandleRef.current = which;
      setDragHandle(which);
      updateRangeFromPoint(e.clientX, e.clientY);
    };
  }
  // Window-level listeners, not per-element `onPointerMove`/pointer capture:
  // capture-based dragging on the handle element itself turned out flaky in
  // practice (a fast pointerdown→pointermove pair could fire before the
  // element had actually captured the pointer). Listening on `window` for
  // the duration of the drag is the more robust, standard pattern and works
  // for both mouse and touch identically.
  React.useEffect(() => {
    if (!dragHandle) return undefined;
    const onMove = (e) => updateRangeFromPoint(e.clientX, e.clientY);
    const onUp = () => {
      dragHandleRef.current = null;
      setDragHandle(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragHandle]);

  // Clicking a tick/wedge directly: in range mode, moves whichever boundary
  // (start or end) is nearer to the clicked week; otherwise (the older
  // single-count API) it's `onSelectSegment`.
  function handleSegmentClick(i) {
    const week = i + 1;
    if (rangeMode && onRangeChange) {
      const distStart = Math.abs(week - rangeStart);
      const distEnd = Math.abs(week - rangeEnd);
      if (distStart <= distEnd) onRangeChange(Math.min(week, rangeEnd), rangeEnd);
      else onRangeChange(rangeStart, Math.max(week, rangeStart));
    } else if (onSelectSegment) {
      onSelectSegment(week);
    }
  }
  function isSegHighlighted(i) {
    const week = i + 1;
    return rangeMode ? week >= rangeStart && week <= rangeEnd : week <= highlighted;
  }
  const startHandlePos = polarToCartesian(cx, cy, tickROuter + 9, (rangeStart - 1) * step);
  const endHandlePos = polarToCartesian(cx, cy, tickROuter + 9, (rangeEnd - 1) * step);

  // Three mutually exclusive ways to draw the ring, resolved once here rather
  // than as nested ternaries inside the SVG:
  //
  //   1 segment (full)      — an UNCUT ring. This has to be a stroked <circle>,
  //                           not a donut path: donutSegmentPath(…, 0, 360)
  //                           produces identical start and end polar points, so
  //                           the arc is degenerate and paints nothing. That
  //                           bug made the section's default view a blank grey
  //                           ring with no accent in it at all.
  //   n segments            — wedges, one highlighted (your registered share).
  //   many ticks (timeshare)— marks on a dial, a few highlighted.
  let shapes;
  if (isTimeshare) {
    shapes = Array.from({ length: total }).map((_, i) => {
      const angle = i * step;
      const isHighlighted = isSegHighlighted(i);
      const isHovered = hoverIdx === i;
      const isClickable = rangeMode ? !!onRangeChange : !!onSelectSegment;
      const outer = polarToCartesian(cx, cy, tickROuter, angle);
      const inner = polarToCartesian(cx, cy, tickRInner, angle);
      return (
        <motion.line
          key={`${model}-${i}`}
          x1={inner.x}
          y1={inner.y}
          x2={outer.x}
          y2={outer.y}
          strokeLinecap="round"
          // stroke/strokeWidth are set as plain SVG attributes and crossfade
          // via the CSS `transition` below rather than through framer's
          // `animate` — framer-motion's SVG color/attribute interpolation
          // needs the animated key present in `initial` to establish a "from"
          // value; without it the value snapped straight to black instead of
          // transitioning. A plain CSS transition on the attribute sidesteps
          // that entirely and is just as smooth for a same-element recolor.
          stroke={isHighlighted || isHovered ? accentHex : DIM_STROKE}
          strokeWidth={isHighlighted ? 2.5 : isHovered ? 2.2 : 1.5}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : Math.min(i * 0.008, 0.4) }}
          whileHover={reduce ? undefined : { scale: 1.3, transition: HOVER_SPRING }}
          whileTap={reduce || !isClickable ? undefined : { scale: 1.5, transition: HOVER_SPRING }}
          style={{
            transformOrigin: `${(inner.x + outer.x) / 2}px ${(inner.y + outer.y) / 2}px`,
            cursor: isClickable ? 'pointer' : 'default',
            transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
          }}
          onHoverStart={() => setHoverIdx(i)}
          onHoverEnd={() => setHoverIdx((cur) => (cur === i ? null : cur))}
          onClick={isClickable ? () => handleSegmentClick(i) : undefined}
        />
      );
    });
  } else if (total === 1) {
    // Scale only — NO per-shape opacity animation. The wedge and tick branches
    // animate their own opacity because they need per-index stagger delays to
    // paint in sequence; a single uncut ring has nothing to stagger against, so
    // its fade is entirely the parent <g>'s job. Giving it a second, redundant
    // opacity track is what left it stranded at opacity 0 when returning to
    // `full` from another model — the group faded in correctly while the circle
    // inside it never ran its own animation, so the ring was invisible again.
    // One element, one owner of opacity.
    shapes = (
      <motion.circle
        cx={cx}
        cy={cy}
        r={(rOuter + rInner) / 2}
        fill="none"
        stroke={accentHex}
        strokeWidth={rOuter - rInner}
        initial={reduce ? false : { scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 }}
        whileHover={reduce ? undefined : { scale: 1.02, transition: HOVER_SPRING }}
        style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'default' }}
      />
    );
  } else {
    shapes = Array.from({ length: total }).map((_, i) => {
      const start = i * step + gapDeg / 2;
      const end = (i + 1) * step - gapDeg / 2;
      const isHighlighted = isSegHighlighted(i);
      const isHovered = hoverIdx === i;
      const isClickable = rangeMode ? !!onRangeChange : !!onSelectSegment;
      const d = donutSegmentPath(cx, cy, rOuter, rInner, start, end);
      return (
        <motion.path
          key={`${model}-${i}`}
          d={d}
          // fill/fillOpacity are plain SVG attributes crossfaded via the CSS
          // `transition` below, not framer's `animate` — see the identical
          // note on the timeshare tick marks above for why.
          fill={isHighlighted || isHovered ? accentHex : DIM_FILL}
          fillOpacity={isHighlighted ? 1 : isHovered ? 0.5 : 1}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 0.5, ease: EASE, delay: reduce ? 0 : Math.min(i * 0.012, 0.4) },
            scale: reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 24, mass: 0.6, delay: reduce ? 0 : Math.min(i * 0.012, 0.4) },
          }}
          whileHover={reduce ? undefined : { scale: 1.06, transition: HOVER_SPRING }}
          whileTap={reduce || !isClickable ? undefined : { scale: 1.12, transition: HOVER_SPRING }}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            cursor: isClickable ? 'pointer' : 'default',
            transition: 'fill 0.2s ease, fill-opacity 0.2s ease',
          }}
          onHoverStart={() => setHoverIdx(i)}
          onHoverEnd={() => setHoverIdx((cur) => (cur === i ? null : cur))}
          onClick={isClickable ? () => handleSegmentClick(i) : undefined}
        />
      );
    });
  }

  const defaultCaption =
    model === 'full'
      ? isRu
        ? 'Без совладельцев'
        : 'No co-owners'
      : model === 'fractional'
        ? isRu
          ? `1 из ${total} долей — ваша`
          : `1 of ${total} shares is yours`
        : isRu
          ? `${highlighted} из ${total} недель — ваши`
          : `${highlighted} of ${total} weeks are yours`;

  // Hovering an individual wedge/tick swaps the caption to name that exact
  // slice — a visitor can explore the whole ring, not just see the one
  // pre-highlighted share.
  let caption = defaultCaption;
  if (hoverIdx !== null && hoverIdx < total) {
    const isMine = hoverIdx < highlighted;
    if (isTimeshare) {
      caption = isMine
        ? isRu
          ? `Ваша неделя ${hoverIdx + 1}`
          : `Your week ${hoverIdx + 1}`
        : isRu
          ? `Неделя ${hoverIdx + 1} из ${total}`
          : `Week ${hoverIdx + 1} of ${total}`;
    } else if (total > 1) {
      caption = isMine
        ? isRu
          ? 'Ваша доля'
          : 'Your share'
        : isRu
          ? `Доля ${hoverIdx + 1} из ${total}`
          : `Share ${hoverIdx + 1} of ${total}`;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* overflow: visible — segmentLabels sit just outside rOuter, past
            the viewBox's own edge; SVG root elements clip to the viewBox by
            default, which would cut the labels off flush. */}
        <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Faint reference ring so the shape reads even before segments
              paint in. */}
          <circle cx={cx} cy={cy} r={(rOuter + rInner) / 2} fill="none" stroke={LINE_HEX} strokeWidth={rOuter - rInner} opacity="0.6" />
          {/* NO AnimatePresence around the shapes — deliberately.
              This element's one job is to never be blank, and every blank-ring
              bug it has had traces back to an exit animation that didn't
              finish. Two of them, in order:
                1. donutSegmentPath(…, 0, 360) painted a degenerate arc, so the
                   default `full` view was an empty grey ring.
                2. Handing AnimatePresence the `shapes` array directly meant its
                   child list changed identity wholesale on every switch (1
                   circle ↔ 6 paths ↔ 52 lines, all differently keyed). It could
                   not reconcile that: timeshare → full left all 52 outgoing
                   ticks stuck in the DOM while the incoming gold ring sat at
                   opacity 0. Collapsing to a single <g key={model}> under
                   `mode="wait"` then deadlocked the other way — the outgoing
                   group's exit never completed, so the incoming group never
                   mounted at all and the ring froze on the previous model.
              So the group is keyed by `model` and simply remounted: React drops
              the old shapes and mounts the new ones, which fade in from
              `initial`. There is no exit to complete and therefore no state in
              which the ring can be stuck empty or stale. The cost is losing the
              outgoing crossfade; the per-shape stagger delays below still run,
              which is what actually carried the character of the transition. */}
          <motion.g
            key={model}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {shapes}
          </motion.g>
          {segmentLabels && segmentLabels.length > 0 && (
            <g aria-hidden>
              {segmentLabels.map(({ index, label }) => {
                const angle = index * step;
                const pos = polarToCartesian(cx, cy, rOuter + 16, angle);
                return (
                  <text
                    key={`label-${index}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={9}
                    fill={DIM_STROKE}
                    style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          )}
          {draggable && rangeMode && onRangeChange && (
            <>
              <motion.circle
                cx={startHandlePos.x}
                cy={startHandlePos.y}
                r={dragHandle === 'start' ? 9 : 7}
                fill={accentHex}
                stroke="#0B1220"
                strokeWidth={2}
                animate={{ scale: dragHandle === 'start' ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  transformOrigin: `${startHandlePos.x}px ${startHandlePos.y}px`,
                  cursor: dragHandle === 'start' ? 'grabbing' : 'grab',
                  touchAction: 'none',
                }}
                onPointerDown={beginDrag('start')}
              />
              <motion.circle
                cx={endHandlePos.x}
                cy={endHandlePos.y}
                r={dragHandle === 'end' ? 9 : 7}
                fill="none"
                stroke={accentHex}
                strokeWidth={2.5}
                animate={{ scale: dragHandle === 'end' ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  transformOrigin: `${endHandlePos.x}px ${endHandlePos.y}px`,
                  cursor: dragHandle === 'end' ? 'grabbing' : 'grab',
                  touchAction: 'none',
                }}
                onPointerDown={beginDrag('end')}
              />
            </>
          )}
        </svg>
        {/* pointer-events-none — this div is `absolute inset-0`, so despite
            only the small centred glyph being visible, it stacks ABOVE the
            svg (absolutely-positioned elements paint above static ones
            regardless of DOM order) and silently ate every pointer event
            over the whole square, including the drag handles out near the
            ring's edge. That's what made dragging seem broken in real use. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <VillaGlyph color={accentHex} />
        </div>
      </div>
      {!hideCaption && (
        <>
          <AnimatePresence mode="wait">
            <motion.p
              key={caption}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`mt-5 text-xs md:text-sm tracking-wide ${onSurfaceText} text-center`}
            >
              {caption}
            </motion.p>
          </AnimatePresence>
          {/* Live price, tied to the model itself rather than the hover — the
              figure a visitor is actually pricing is "this ownership model,"
              not "this particular wedge." Re-enters (not AnimatePresence-
              crossfades) on model change: this file's own history is the
              reason — see the long note above on why `shapes` deliberately has
              no exit animation. A `key` change unmounts the old text and mounts
              the new one, synchronously, with no exit to ever get stuck on. */}
          {fromPrice != null && (
            <motion.p
              key={`${model}-price`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : 0.05 }}
              className="mt-1.5 font-display text-base md:text-lg text-baden-on-dark tabular-nums text-center"
            >
              {isRu ? 'от ' : 'from '}
              <span style={{ color: accentHex }}>{formatEUR(fromPrice)}</span>
            </motion.p>
          )}
        </>
      )}
    </div>
  );
}
