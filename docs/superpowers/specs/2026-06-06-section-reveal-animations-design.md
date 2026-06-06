# Subtle & Elegant Section Reveal Animations

**Date:** 2026-06-06
**Status:** Approved (pending implementation)

## Problem

Every panel already has Framer Motion entrance animations (`whileInView` fade-up
with `viewport={{ once: true }}`), but they feel plain and abrupt, and the motion
config is duplicated and hand-tuned per element. ProductBento and HowItWorks set
manual per-card `delay` values, which is bookkeeping that drifts out of sync.

## Goal

Elevate the reveals to feel **subtle and elegant** — soft easing, a short rise, a
light blur-in, and a smoothly orchestrated stagger — matching the site's minimal,
flat aesthetic. Keep the one-shot reveal model (animate once when a section comes
into view; do not replay). Centralize the motion values so one knob tunes the
whole site.

## Non-Goals

- No scroll-progress-linked motion (parallax, scrubbing). Reveals stay one-shot.
- No springy/bouncy or cinematic character.
- No changes to the scroll hook, the `Panel` primitive, or layout structure.
- No new animation dependency — Framer Motion (already present) only.

## Approach

Introduce a single source of motion truth and two tiny wrapper components, then
refactor the four panels to use them. The motion *values* live in one module; the
panels declare *what* reveals and in *what group*.

## Detailed Design

### `frontend/src/lib/motion.ts` (new)

Exports plain Framer Motion `Variants` objects and tokens — pure data, so they are
unit-testable like the other `lib/` utilities:

- `EASE_OUT: [0.22, 1, 0.36, 1]` — smooth expo-style deceleration cubic-bezier.
- `fadeUp: Variants`:
  - `hidden: { opacity: 0, y: 18, filter: "blur(6px)" }`
  - `show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } }`
- `revealGroup: Variants` — a container that orchestrates children:
  - `hidden: {}`
  - `show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } }`

### `frontend/src/components/Reveal.tsx` (new)

Two small wrappers, both forwarding `className` so layout classes stay on the
animated element (no extra wrapper divs that would disrupt grid/flex):

- `RevealGroup` — a `motion.div` with:
  - `variants={revealGroup}`, `initial="hidden"`, `whileInView="show"`,
    `viewport={{ once: true, amount: 0.2 }}`.
  - Owns the IntersectionObserver trigger and the stagger orchestration.
  - Props: `className?`, `children`.
- `Reveal` — a `motion.div` with `variants={fadeUp}`. Inside a `RevealGroup` it
  inherits the staggered timing automatically (Framer propagates the `show`
  animation state to variant children); no manual `delay` needed.
  - Props: `className?`, `children`.

Both accept and spread `className`; children are rendered as-is.

### Panel refactors

For each panel, replace the hand-rolled `motion.div` reveal elements with a
`RevealGroup` wrapping `Reveal` children. Remove manual per-element `delay` and
inline `initial`/`whileInView`/`transition` props.

- **Hero** (`panels/Hero.tsx`): wrap the two-column grid contents in a
  `RevealGroup`; the text column and the phone `Placeholder` each become a
  `Reveal`. They cascade via the group stagger instead of the current explicit
  `delay: 0.1`.
- **ProductBento** (`panels/ProductBento.tsx`): wrap the bento grid in a
  `RevealGroup`; the large screenshot cell and each of the four feature cells
  become `Reveal` children. Drop `delay: 0.05 * (i + 1)` — the group staggers
  them. The heading/intro paragraph can also be wrapped in a `Reveal` so the
  whole panel reveals as one orchestrated sequence.
- **HowItWorks** (`panels/HowItWorks.tsx`): wrap the four step cards in a
  `RevealGroup`; each step card becomes a `Reveal`. Drop `delay: 0.08 * i`. The
  "Built with" stack badges can be a second small `RevealGroup` (or included in
  the same group) so they cascade after the steps.
- **ThesisFooter** (`panels/ThesisFooter.tsx`): the single content block becomes
  a `RevealGroup` whose lines (primary heading, secondary, tertiary, actions,
  copyright) each become `Reveal` children for a gentle top-to-bottom cascade.

### Accessibility

The global `MotionConfig reducedMotion="user"` (in `App`) already reduces
transform/blur animations while preserving opacity for users who prefer reduced
motion. The new variants animate `opacity` (kept), `y`, and `filter` (reduced) —
so reduced-motion users get a plain fade with no movement or blur, automatically.
No per-component handling required; verify behavior holds.

### Reliability on horizontal scroll

The showcase moves panels via CSS `translateX`, not native scroll.
`whileInView` uses IntersectionObserver, whose intersection geometry reflects CSS
transforms, so reveals fire as panels translate into view. `viewport={{ once:
true, amount: 0.2 }}` makes each panel trigger once it is ~20% on screen and not
replay. This is verified manually in the running dev server.

## Files

- **Create:** `frontend/src/lib/motion.ts`, `frontend/src/lib/motion.test.ts`,
  `frontend/src/components/Reveal.tsx`
- **Modify:** `frontend/src/components/panels/Hero.tsx`,
  `frontend/src/components/panels/ProductBento.tsx`,
  `frontend/src/components/panels/HowItWorks.tsx`,
  `frontend/src/components/panels/ThesisFooter.tsx`
- **Unchanged:** scroll hook, `Panel`, `App`, `HorizontalShowcase`, `ProgressNav`

## Testing

- **`frontend/src/lib/motion.test.ts`:** assert the variant tokens have the
  expected shape and values — `EASE_OUT` array, `fadeUp.hidden`/`fadeUp.show`
  opacity/y/filter values and transition (duration + easing), and
  `revealGroup.show.transition.staggerChildren`. Pure-data assertions, matching
  the `lib/` test convention.
- **Existing component smoke tests:** must continue to pass. The
  `IntersectionObserver` stub in `src/test/setup.ts` already supports
  `whileInView` in jsdom. If any panel smoke test asserts on the old inline motion
  structure, update it to the new `Reveal`/`RevealGroup` structure.
- **Manual browser verification (dev server):** each panel's content reveals with
  a smooth staggered fade-up + blur-in when scrolled into view; reveals fire once
  and do not replay; reduced-motion shows plain fades with no movement.

## Tunable

All feel lives in `motion.ts`: `EASE_OUT` curve, `fadeUp` distance/blur/duration,
and `revealGroup` stagger/delay. One edit retunes the entire site.
