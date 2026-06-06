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

  it("renders the primary app screenshot placeholder", () => {
    render(<ProductBento />);
    expect(screen.getByText("app-dashboard.png")).toBeInTheDocument();
  });

  it("renders feature labels", () => {
    render(<ProductBento />);
    expect(screen.getByText(/real-time feed/i)).toBeInTheDocument();
    expect(screen.getByText(/cost estimate/i)).toBeInTheDocument();
  });
});
