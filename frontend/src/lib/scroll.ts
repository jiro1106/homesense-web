/** Clamp a scroll offset between min and max (inclusive). */
export function clampScroll(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Given a horizontal scroll offset and per-panel width, return the index of
 * the panel nearest to the current position, clamped to [0, count - 1].
 */
export function getActivePanel(
  scrollX: number,
  panelWidth: number,
  count: number
): number {
  if (panelWidth <= 0) return 0;
  const raw = Math.round(scrollX / panelWidth);
  return clampScroll(raw, 0, count - 1);
}
