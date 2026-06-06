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

  it("renders all four pipeline steps", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Sensor")).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.getByText("App")).toBeInTheDocument();
  });

  it("renders tech-stack badges", () => {
    render(<HowItWorks />);
    expect(screen.getByText("[ESP32]")).toBeInTheDocument();
  });
});
