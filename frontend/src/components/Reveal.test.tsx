import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealGroup } from "./Reveal";

describe("Reveal", () => {
  it("renders children and forwards className onto the animated element", () => {
    render(
      <RevealGroup className="group-cls">
        <Reveal className="child-cls">hello reveal</Reveal>
      </RevealGroup>
    );
    const el = screen.getByText("hello reveal");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("child-cls");
  });

  it("renders a group with multiple children", () => {
    render(
      <RevealGroup>
        <Reveal>one</Reveal>
        <Reveal>two</Reveal>
      </RevealGroup>
    );
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
