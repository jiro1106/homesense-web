import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThesisFooter } from "./ThesisFooter";

describe("ThesisFooter", () => {
  it("renders the formal thesis title as the primary heading", () => {
    render(<ThesisFooter />);
    expect(
      screen.getByRole("heading", { name: /iot-based household electricity monitoring system/i })
    ).toBeInTheDocument();
  });

  it("renders the contact CTA as a mailto link", () => {
    render(<ThesisFooter />);
    const link = screen.getByRole("link", { name: /contact the team/i });
    expect(link).toHaveAttribute("href", "mailto:app.homesense@gmail.com");
  });
});
