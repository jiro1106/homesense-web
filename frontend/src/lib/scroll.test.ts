import { describe, it, expect } from "vitest";
import { clampScroll, getActivePanel, stepToward } from "./scroll";

describe("clampScroll", () => {
  it("returns the value when within range", () => {
    expect(clampScroll(50, 0, 100)).toBe(50);
  });
  it("clamps below min", () => {
    expect(clampScroll(-20, 0, 100)).toBe(0);
  });
  it("clamps above max", () => {
    expect(clampScroll(180, 0, 100)).toBe(100);
  });
});

describe("getActivePanel", () => {
  it("returns 0 at the start", () => {
    expect(getActivePanel(0, 1000, 4)).toBe(0);
  });
  it("returns the nearest panel index by rounding", () => {
    expect(getActivePanel(1200, 1000, 4)).toBe(1);
    expect(getActivePanel(1600, 1000, 4)).toBe(2);
  });
  it("never exceeds the last panel index", () => {
    expect(getActivePanel(99999, 1000, 4)).toBe(3);
  });
  it("never goes below 0", () => {
    expect(getActivePanel(-500, 1000, 4)).toBe(0);
  });
});

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
