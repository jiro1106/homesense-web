import { describe, it, expect } from "vitest";
import { clampScroll, getActivePanel } from "./scroll";

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
