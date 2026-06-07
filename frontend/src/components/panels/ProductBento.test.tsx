import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductBento } from "./ProductBento";

describe("ProductBento", () => {
  it("renders the section heading", () => {
    render(<ProductBento />);
    expect(
      screen.getByRole("heading", { name: /the app/i })
    ).toBeInTheDocument();
  });

  it("does not render an image placeholder", () => {
    render(<ProductBento />);
    expect(screen.queryByText("app-dashboard.png")).not.toBeInTheDocument();
  });

  it("renders every feature label", () => {
    render(<ProductBento />);
    for (const label of [
      /real-time feed/i,
      /bill prediction/i,
      /recommendations/i,
      /usage history/i,
      /cost estimate/i,
      /alerts/i,
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
