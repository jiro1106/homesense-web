# Eased Free-Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the horizontal showcase's wheel/keyboard scrolling glide smoothly (eased free-scroll) instead of jumping per wheel notch.

**Architecture:** Split track position into a `targetRef` (where input points) and `offsetRef` (rendered position). A `requestAnimationFrame` loop eases the rendered offset toward the target each frame via a pure `stepToward` helper, writing the transform and updating derived state, then idles when settled. No new dependencies.

**Tech Stack:** React 19, TypeScript, Vite, Vitest. Pure interpolation math lives in `frontend/src/lib/scroll.ts`; the rAF loop lives in `frontend/src/hooks/useHorizontalScroll.ts`.

---

## File Structure

- `frontend/src/lib/scroll.ts` — **modify.** Add the pure `stepToward(current, target, ease)` interpolation helper next to existing `clampScroll` / `getActivePanel`.
- `frontend/src/lib/scroll.test.ts` — **modify.** Add unit tests for `stepToward`.
- `frontend/src/hooks/useHorizontalScroll.ts` — **modify.** Replace the direct-transform wheel write and CSS transition with a `targetRef` + rAF easing loop using `stepToward`.

No other files change. The hook's public API (`trackRef`, `active`, `progress`, `goTo`) and all consumers stay identical.

> **Note on commands:** all `npm`/`npx` commands run from the `frontend/` directory.

---

## Task 1: Pure `stepToward` interpolation helper

**Files:**
- Modify: `frontend/src/lib/scroll.ts`
- Test: `frontend/src/lib/scroll.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `frontend/src/lib/scroll.test.ts`. First make sure `stepToward` is added to the existing import from `"./scroll"` at the top of the file (it currently imports `clampScroll` and/or `getActivePanel`), then append these tests:

```ts
describe("stepToward", () => {
  it("moves a fraction of the way toward the target", () => {
    // 0 -> 100 with ease 0.1 should land at 10
    expect(stepToward(0, 100, 0.1)).toBeCloseTo(10);
  });

  it("is a no-op when already at the target", () => {
    expect(stepToward(50, 50, 0.12)).toBe(50);
  });

  it("converges toward the target over repeated calls", () => {
    let current = 0;
    for (let i = 0; i < 100; i++) {
      current = stepToward(current, 100, 0.12);
    }
    expect(current).toBeCloseTo(100, 1);
  });

  it("works when moving in the negative direction", () => {
    // 100 -> 0 with ease 0.25 should land at 75
    expect(stepToward(100, 0, 0.25)).toBeCloseTo(75);
  });
});
```

If `describe`/`it`/`expect` are not already imported in this file, add `import { describe, it, expect } from "vitest";` at the top (match whatever the existing tests in this file already use — do not duplicate an existing import).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/scroll.test.ts`
Expected: FAIL — `stepToward is not defined` / import error.

- [ ] **Step 3: Implement `stepToward`**

Add to `frontend/src/lib/scroll.ts` (after the existing functions):

```ts
/**
 * One frame of linear interpolation: move `current` a fraction (`ease`, 0..1)
 * of the remaining distance toward `target`. Pure — used by the scroll rAF loop.
 */
export function stepToward(
  current: number,
  target: number,
  ease: number
): number {
  return current + (target - current) * ease;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/scroll.test.ts`
Expected: PASS — all `stepToward` cases plus the pre-existing `clampScroll`/`getActivePanel` cases.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/scroll.ts frontend/src/lib/scroll.test.ts
git commit -m "feat: add pure stepToward interpolation helper

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: rAF easing loop in the scroll hook

**Files:**
- Modify: `frontend/src/hooks/useHorizontalScroll.ts`

This task has no unit test (the rAF loop touches `window`/DOM timing and is verified manually in the browser; its math is already covered by Task 1's `stepToward` tests). Verification is via type-check, lint, and the manual browser check in Task 3.

- [ ] **Step 1: Update the import**

Change the top-of-file import to include `stepToward`:

```ts
import { clampScroll, getActivePanel, stepToward } from "../lib/scroll";
```

- [ ] **Step 2: Add target/raf refs and tuning constants**

Inside `useHorizontalScroll`, alongside the existing `offsetRef`, add:

```ts
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
```

And near the top of the `useEffect` body (after the `isDesktop` / `prefersReduced` / `panelWidth` / `maxOffset` declarations), add:

```ts
    const EASE = 0.12; // glide speed: higher = snappier, lower = floatier
    const SNAP_PX = 0.5; // settle threshold; below this we land exactly on target
```

- [ ] **Step 3: Replace `apply` with a `render` + rAF `tick` loop**

Remove the existing `apply` function entirely and replace it with the following. `render` writes the current rendered offset to the DOM and updates derived state; `tick` advances one eased frame and reschedules until settled; `startLoop` kicks the loop if it isn't already running.

```ts
    const render = () => {
      const track = trackRef.current;
      if (!track) return;
      const max = maxOffset();
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      setActive(getActivePanel(offsetRef.current, panelWidth(), count));
      setProgress(max > 0 ? offsetRef.current / max : 0);
    };

    const tick = () => {
      // Reduced motion: jump straight to the target, no glide.
      if (prefersReduced()) {
        offsetRef.current = targetRef.current;
        render();
        rafRef.current = null;
        return;
      }
      offsetRef.current = stepToward(offsetRef.current, targetRef.current, EASE);
      if (Math.abs(targetRef.current - offsetRef.current) < SNAP_PX) {
        offsetRef.current = targetRef.current;
        render();
        rafRef.current = null;
        return;
      }
      render();
      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
```

- [ ] **Step 4: Rewrite `goTo` to set the target and start the loop**

Replace the existing `goTo` with:

```ts
    const goTo = (index: number) => {
      targetRef.current = clampScroll(index, 0, count - 1) * panelWidth();
      startLoop();
    };
```

(The old `smooth` parameter is gone — all motion now eases through the loop. Reduced-motion users still land instantly because `tick` snaps in one frame.)

- [ ] **Step 5: Rewrite the wheel handler to accumulate into the target**

Replace the body of `onWheel` so it updates `targetRef` and starts the loop instead of writing the transform directly:

```ts
    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      // Use whichever axis has the larger delta (trackpads send both).
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      targetRef.current = clampScroll(targetRef.current + delta, 0, maxOffset());
      startLoop();
    };
```

- [ ] **Step 6: Update `onResize` to reset both refs and cancel the loop**

Replace `onResize` with:

```ts
    const onResize = () => {
      const track = trackRef.current;
      // Below the desktop breakpoint the panels stack vertically; clear any
      // leftover horizontal offset so the mobile stack isn't shifted.
      if (!isDesktop()) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        offsetRef.current = 0;
        targetRef.current = 0;
        if (track) track.style.transform = "none";
        setActive(0);
        setProgress(0);
        return;
      }
      // Re-snap to the active panel so resizing keeps alignment.
      const idx = getActivePanel(offsetRef.current, panelWidth(), count);
      targetRef.current = clampScroll(idx, 0, count - 1) * panelWidth();
      startLoop();
    };
```

- [ ] **Step 7: Cancel the loop on cleanup**

In the `useEffect` return (cleanup) function, after the three `removeEventListener` calls, add:

```ts
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
```

- [ ] **Step 8: Confirm the `goToRef` wiring still matches**

The line `goToRef.current = (index: number) => goTo(index);` still works because `goTo` now takes only `index`. Leave the returned `goTo: (index) => goToRef.current(index)` as-is. Verify no remaining references to the deleted `apply` function or the old `smooth` argument exist in the file (search the file for `apply(` and `smooth`).

- [ ] **Step 9: Type-check and lint**

Run: `npm run build`
Expected: PASS — no TypeScript errors (this runs `tsc -b` then `vite build`).

Run: `npm run lint`
Expected: PASS — no ESLint errors. (If lint flags `rafRef`/`targetRef` as missing `useEffect` deps, note that refs are stable and exempt; do not add them to the dependency array — the array stays `[count]` as before.)

- [ ] **Step 10: Run the full test suite**

Run: `npm run test`
Expected: PASS — all existing component/lib tests plus Task 1's `stepToward` tests.

- [ ] **Step 11: Commit**

```bash
git add frontend/src/hooks/useHorizontalScroll.ts
git commit -m "feat: eased free-scroll via rAF interpolation loop

Replace direct per-notch transform writes with a target/rendered offset
split eased by requestAnimationFrame. Wheel, keyboard, and dot-nav all
glide through one loop; reduced-motion snaps instantly; loop idles when
settled.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Manual browser verification

**Files:** none (manual check).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open the shown local URL in a browser at a desktop width (>= 768px).

- [ ] **Step 2: Verify eased wheel scrolling**

Scroll the mouse wheel / trackpad. Expected: the track glides horizontally and eases to a stop rather than jumping per notch. Rapid scrolling accumulates and catches up smoothly.

- [ ] **Step 3: Verify keyboard and dot-nav**

Press ArrowRight/ArrowLeft, PageDown/PageUp, Home, End, and click the ProgressNav dots. Expected: each glides to the target panel with the same easing; `active` dot and progress bar update.

- [ ] **Step 4: Verify reduced motion**

Enable OS "reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion), reload. Expected: navigation jumps instantly with no glide; nothing breaks.

- [ ] **Step 5: Verify mobile / resize**

Narrow the window below 768px. Expected: panels stack vertically, normal native vertical scroll, no leftover horizontal transform. Widen again above 768px. Expected: re-snaps to a panel and horizontal eased scrolling resumes.

- [ ] **Step 6: (Optional) tune EASE**

If the glide feels too fast or too floaty, adjust the `EASE` constant in `useHorizontalScroll.ts` (try 0.08–0.18) and reload. Commit if changed.

---

## Self-Review Notes

- **Spec coverage:** `stepToward` helper + test (Task 1) ✓; `targetRef`/rendered split, rAF loop, wheel into target, `goTo` easing replacing CSS transition, reduced-motion snap, resize reset + raf cancel, cleanup cancel (Task 2) ✓; unchanged public API and mobile behavior (verified Task 3) ✓.
- **Naming consistency:** `stepToward`, `targetRef`, `offsetRef`, `rafRef`, `render`, `tick`, `startLoop`, `EASE`, `SNAP_PX` used consistently across tasks.
- **No placeholders:** every code step shows complete code.
