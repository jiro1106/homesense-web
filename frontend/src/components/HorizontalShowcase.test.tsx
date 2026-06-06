import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HorizontalShowcase } from "./HorizontalShowcase";

describe("HorizontalShowcase", () => {
  it("renders all four panel headings", () => {
    render(<HorizontalShowcase />);
    expect(
      screen.getByRole("heading", { name: /monitor every watt/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the app/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /a thesis project/i })
    ).toBeInTheDocument();
  });
});
