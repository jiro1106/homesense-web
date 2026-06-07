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

  it("renders the phone mockup image", () => {
    render(<Hero />);
    expect(
      screen.getByRole("img", { name: /homesense app running on a phone/i })
    ).toBeInTheDocument();
  });
});
