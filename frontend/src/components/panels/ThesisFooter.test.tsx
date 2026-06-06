import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThesisFooter } from "./ThesisFooter";

describe("ThesisFooter", () => {
  it("renders the primary credit heading", () => {
    render(<ThesisFooter />);
    expect(
      screen.getByRole("heading", { name: /a thesis project/i })
    ).toBeInTheDocument();
  });

  it("renders the download CTA", () => {
    render(<ThesisFooter />);
    expect(
      screen.getByRole("link", { name: /download apk/i })
    ).toBeInTheDocument();
  });
});
