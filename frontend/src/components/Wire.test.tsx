import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Wire } from "./Wire";

describe("Wire", () => {
  it("renders both a horizontal and a vertical trace", () => {
    const { container } = render(<Wire />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("is hidden from assistive tech", () => {
    const { container } = render(<Wire />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
  });

  it("applies the stagger delay to the animated charge paths", () => {
    const { container } = render(<Wire delay={600} />);
    const charges = container.querySelectorAll<SVGPathElement>(".wire-charge");
    expect(charges).toHaveLength(2);
    charges.forEach((c) => expect(c.style.animationDelay).toBe("600ms"));
  });
});
