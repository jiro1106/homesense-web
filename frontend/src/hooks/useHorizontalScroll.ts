import { useEffect, useRef, useState } from "react";
import { clampScroll, getActivePanel } from "../lib/scroll";

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
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const goToRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const panelWidth = () => window.innerWidth;
    const maxOffset = () => panelWidth() * (count - 1);

    const apply = (smooth = false) => {
      const track = trackRef.current;
      if (!track) return;
      const max = maxOffset();
      track.style.transition =
        smooth && !prefersReduced() ? "transform 500ms ease-out" : "none";
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      setActive(getActivePanel(offsetRef.current, panelWidth(), count));
      setProgress(max > 0 ? offsetRef.current / max : 0);
    };

    const goTo = (index: number, smooth = true) => {
      offsetRef.current = clampScroll(index, 0, count - 1) * panelWidth();
      apply(smooth);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      // Use whichever axis has the larger delta (trackpads send both).
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      offsetRef.current = clampScroll(
        offsetRef.current + delta,
        0,
        maxOffset()
      );
      apply(false);
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
        offsetRef.current = 0;
        if (track) track.style.transform = "none";
        setActive(0);
        setProgress(0);
        return;
      }
      // Re-snap to the active panel so resizing keeps alignment.
      const idx = getActivePanel(offsetRef.current, panelWidth(), count);
      goTo(idx, false);
    };

    goToRef.current = (index: number) => goTo(index);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return {
    trackRef,
    active,
    progress,
    goTo: (index: number) => goToRef.current(index),
  };
}
