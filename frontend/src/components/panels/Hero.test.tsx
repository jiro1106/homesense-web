import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the big tagline and the primary CTA", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: /monitor every watt/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download apk/i })
    ).toBeInTheDocument();
  });

  it("renders the phone mockup placeholder", () => {
    render(<Hero />);
    expect(screen.getByText("phone-hero.png")).toBeInTheDocument();
  });
});
