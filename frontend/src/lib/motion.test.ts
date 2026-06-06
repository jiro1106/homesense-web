import { describe, it, expect } from "vitest";
import { EASE_OUT, fadeUp, fadeUpReduced, revealGroup } from "./motion";

describe("EASE_OUT", () => {
  it("is the shared 4-point cubic-bezier curve", () => {
    expect(EASE_OUT).toEqual([0.22, 1, 0.36, 1]);
  });
});

describe("fadeUp", () => {
  it("starts transparent, lowered, and blurred", () => {
    expect(fadeUp.hidden).toMatchObject({
      opacity: 0,
      y: 18,
      filter: "blur(6px)",
    });
  });

  it("ends opaque, in place, and unblurred", () => {
    const show = fadeUp.show as unknown as {
      opacity: number;
      y: number;
      filter: string;
      transition: { duration: number; ease: number[] };
    };
    expect(show.opacity).toBe(1);
    expect(show.y).toBe(0);
    expect(show.filter).toBe("blur(0px)");
    expect(show.transition.duration).toBe(0.6);
    expect(show.transition.ease).toEqual(EASE_OUT);
  });
});

describe("fadeUpReduced", () => {
  it("animates opacity only (no movement or blur)", () => {
    expect(fadeUpReduced.hidden).toEqual({ opacity: 0 });
    const show = fadeUpReduced.show as unknown as {
      opacity: number;
      transition: { duration: number };
    };
    expect(show.opacity).toBe(1);
    expect(show).not.toHaveProperty("y");
    expect(show).not.toHaveProperty("filter");
  });
});

describe("revealGroup", () => {
  it("staggers its children when shown", () => {
    const show = revealGroup.show as unknown as {
      transition: { staggerChildren: number; delayChildren: number };
    };
    expect(show.transition.staggerChildren).toBe(0.09);
    expect(show.transition.delayChildren).toBe(0.05);
  });
});
