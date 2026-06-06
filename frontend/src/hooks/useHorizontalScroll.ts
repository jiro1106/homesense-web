import { useEffect, useRef, useState } from "react";
import { clampScroll, getActivePanel, stepToward } from "../lib/scroll";

type UseHorizontalScroll = {
  /** Ref to attach to the moving track element. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Current panel index (0-based). */
  active: number;
  /** Scroll progress 0..1 across the whole track. */
  progress: number;
  /** Programmatically move to a panel (used by dot-nav / keyboard). */
  goTo: (index: number) => void;
};

/**
 * Translates vertical wheel/trackpad and keyboard input into a clamped
 * horizontal offset on a track of `count` full-viewport panels. Active only at
 * >= 768px; below that it no-ops so the track can stack vertically via CSS.
 */
export function useHorizontalScroll(count: number): UseHorizontalScroll {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const goToRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const panelWidth = () => window.innerWidth;
    const maxOffset = () => panelWidth() * (count - 1);

    const EASE = 0.12; // glide speed: higher = snappier, lower = floatier
    const SNAP_PX = 0.5; // settle threshold; below this we land exactly on target

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

    const goTo = (index: number) => {
      targetRef.current = clampScroll(index, 0, count - 1) * panelWidth();
      startLoop();
    };

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

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop()) return;
      const current = getActivePanel(offsetRef.current, panelWidth(), count);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(count - 1);
      }
    };

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

    goToRef.current = (index: number) => goTo(index);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [count]);

  return {
    trackRef,
    active,
    progress,
    goTo: (index: number) => goToRef.current(index),
  };
}
