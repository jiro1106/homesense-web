import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { DOWNLOAD_APK_URL } from "../lib/links";

describe("Navbar", () => {
  it("renders the HomeSense wordmark with the bulb logo", () => {
    render(<Navbar />);
    expect(screen.getByRole("img", { name: /homesense/i })).toBeInTheDocument();
    expect(screen.getByText(/mesense/i)).toBeInTheDocument();
  });

  it("renders the Download APK button linking to the APK build", () => {
    render(<Navbar />);
    const link = screen.getByRole("link", { name: /download apk/i });
    expect(link).toHaveAttribute("href", DOWNLOAD_APK_URL);
  });
});
