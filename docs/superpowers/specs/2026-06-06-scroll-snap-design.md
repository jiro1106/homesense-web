# Scroll-snap panel locking — design

## Problem

`useHorizontalScroll` currently accumulates raw wheel/trackpad delta into a
free-floating target offset and eases toward it. The track can rest anywhere
between two panels. We want a **scroll-snap** feel: scrolling a small portion
into the next section commits and fast-glides the track so that section is fully
centered, one panel per gesture.

## Decisions

- **Transition feel:** fast glide (keep existing eased `goTo`), not a hard cut.
- **Continuous scroll:** one gesture = one panel. A sustained trackpad swipe
  advances exactly one panel; its momentum tail is ignored until the gesture
  ends.

## Approach

Change `onWheel` in `frontend/src/hooks/useHorizontalScroll.ts` from a delta
accumulator into a threshold trigger. The rAF glide (`tick`/`stepToward`/`EASE`)
and `goTo` stay as-is — they already ease to full panel alignment.

### New gesture state (refs)

- `lockedRef: boolean` — true while a snap is committed/animating; further wheel
  input is ignored.
- `accumRef: number` — delta accumulated within the current gesture.
- `quietTimerRef: number | null` — timeout id, re-armed on every wheel event.

### `onWheel` behavior

1. Desktop-only guard (unchanged); `preventDefault()` always.
2. Pick the dominant axis delta (unchanged).
3. (Re)arm the quiet timer for `GESTURE_QUIET_MS`. On fire: if the glide has
   settled (`rafRef === null`), clear `lockedRef` and reset `accumRef` — ending
   the gesture.
4. If `lockedRef` → return (absorbs momentum tail).
5. Add `delta` to `accumRef`. If `|accumRef|` ≥ `SNAP_THRESHOLD * panelWidth`,
   commit: `goTo(current ± 1)` by sign, set `lockedRef = true`, reset `accumRef`.

### Tunables (top of effect)

- `SNAP_THRESHOLD = 0.15` — fraction of a panel scrolled before committing.
- `GESTURE_QUIET_MS = 180` — idle gap that ends one gesture.

### Cleanup

Clear `quietTimerRef` in the effect's teardown alongside the rAF cancel.

## Unchanged

Keyboard nav, dot-nav `goTo`, resize re-snap, reduced-motion instant jump,
mobile no-op.

## Testing

The wheel handler is DOM/event-driven and lives in the hook; the pure helpers in
`src/lib/scroll.ts` are unaffected. Verify via existing component tests still
passing plus a manual check in the dev server (glide centers one panel per
gesture, no resting between panels, momentum doesn't overshoot).
