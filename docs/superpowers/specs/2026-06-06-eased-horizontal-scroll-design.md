# Eased Free-Scroll for the Horizontal Showcase

**Date:** 2026-06-06
**Status:** Approved (pending implementation)

## Problem

The horizontal showcase's wheel handler (`frontend/src/hooks/useHorizontalScroll.ts`)
applies the raw wheel delta directly to the track's `translateX` transform with
`transition: none`. Every mouse-wheel notch jumps the track instantly by the OS
scroll step, producing jerky, non-smooth motion (most noticeable on a notched
mouse wheel versus a trackpad).

## Goal

Make wheel scrolling feel smooth as an **eased free-scroll**: input still moves
the track freely (no forced panel snapping), but the track *glides* toward where
input points instead of jumping. Keyboard and dot-nav navigation share the same
eased motion.

## Non-Goals

- No panel snapping or "slideshow" lock behavior.
- No new dependencies (GSAP was considered and explicitly rejected for this scope;
  its free tier offers little over a small rAF loop, and ScrollSmoother is a paid
  Club plugin).
- No architectural rewrite (ScrollTrigger pinning was considered and rejected as
  more than this problem needs).
- No changes to mobile behavior — the hook still no-ops below 768px and the track
  stacks vertically via CSS.

## Approach

Split the track position into two values:

- **`targetRef`** — where input wants the track to be.
- **`offsetRef`** — where the track currently renders (the existing ref, now
  meaning "rendered position").

Input updates the target instantly. A `requestAnimationFrame` loop eases the
rendered offset toward the target each frame, writes the transform, and updates
derived state. When the offset is within a small threshold of the target, it
snaps exactly to the target and the loop stops, so the page idles at 0 CPU when
settled.

## Detailed Changes

### `frontend/src/lib/scroll.ts` (new pure helper)

Add `stepToward(current, target, ease)`:

```
stepToward(current, target, ease) = current + (target - current) * ease
```

A pure, single-frame interpolation function — extracted here so it is
unit-testable alongside the existing `clampScroll` / `getActivePanel` utilities.

### `frontend/src/hooks/useHorizontalScroll.ts`

- Add `targetRef` (a `useRef<number>(0)`) next to `offsetRef`. `offsetRef` now
  holds the rendered position; `targetRef` holds the desired position.
- Add `rafRef` to track the active animation frame and a small `EASE` constant
  (~0.12) plus a snap threshold (~0.5px).
- **rAF loop (`tick`):**
  - Compute `offsetRef.current = stepToward(offsetRef.current, targetRef.current, EASE)`.
  - If `|target - offset| < threshold`, set `offset = target` and stop the loop
    (clear `rafRef`).
  - Write `track.style.transform = translateX(-offset px)`.
  - Update `active` via `getActivePanel` and `progress` via `offset / maxOffset`.
  - Otherwise schedule the next frame.
- A `startLoop()` helper that schedules `tick` only if no frame is already
  pending (prevents stacking multiple loops).
- **Wheel handler:** clamp `targetRef.current + delta` into `[0, maxOffset]`,
  then call `startLoop()`. Remove the direct transform write and the
  `transition` style management.
- **`goTo(index)`:** set `targetRef.current` to the panel's pixel position
  (`clampScroll(index, 0, count-1) * panelWidth`) and call `startLoop()`. This
  replaces the old CSS `transition: transform 500ms ease-out`, so keyboard and
  dot-nav navigation glide with the same easing as the wheel.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, skip easing — set
  `offsetRef.current = targetRef.current` and apply immediately (single frame, no
  glide).
- **Resize:** below 768px, reset both `offsetRef` and `targetRef` to 0, clear the
  transform, cancel any pending frame, reset `active`/`progress` (as today).
  On desktop, re-snap the target to the active panel and run the loop.
- **Cleanup:** `cancelAnimationFrame(rafRef.current)` on unmount, alongside the
  existing event-listener removal.

### Public API — unchanged

The hook still returns `{ trackRef, active, progress, goTo }` with identical
signatures. No consumer changes.

## Files NOT Changed

- `frontend/src/components/HorizontalShowcase.tsx`
- `frontend/src/components/ProgressNav.tsx`
- All panels under `frontend/src/components/panels/`
- Mobile stacking behavior

## Testing

- **`frontend/src/lib/scroll.test.ts`:** add cases for `stepToward` — moves a
  fraction of the way toward the target, converges over repeated calls, and is a
  no-op when `current === target`.
- The existing pure-utility tests (`clampScroll`, `getActivePanel`) are
  unaffected.
- Component smoke tests are unaffected (the public hook API is unchanged). The
  rAF loop itself is exercised manually in the browser; the testable math lives
  in the pure `stepToward` helper.

## Tunable

A single `EASE` constant (~0.12) controls glide speed. Higher = snappier, lower =
floatier. Easy to adjust after seeing it live.
