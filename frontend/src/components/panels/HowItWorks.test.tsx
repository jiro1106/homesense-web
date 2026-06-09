import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks", () => {
  it("renders the section heading", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
  });

  it("renders all four accurate pipeline steps", () => {
    render(<HowItWorks />);
    // Step labels render as headings; the "Built with" manifest reuses some of
    // the same names as <dt> labels, so target the headings specifically.
    expect(
      screen.getByRole("heading", { name: "Smart Plug" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Database Storage" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "API & Machine Learning" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mobile App" })
    ).toBeInTheDocument();
  });

  it("wires the steps together with three connectors", () => {
    const { container } = render(<HowItWorks />);
    // 3 Wire components between 4 nodes; each Wire has 2 svgs => 6 charge paths.
    expect(container.querySelectorAll(".wire-charge")).toHaveLength(6);
  });

  it("renders tech-stack badges by plain name", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText("2 Pin Flat 20A WiFi Tuya Smart Plug")
    ).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
  });
});
