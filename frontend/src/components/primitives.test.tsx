import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Zap } from "lucide-react";
import { Placeholder } from "./Placeholder";
import { YellowButton } from "./YellowButton";
import { IconTile } from "./IconTile";

describe("Placeholder", () => {
  it("shows the asset name hint", () => {
    render(<Placeholder name="phone-mockup.png" />);
    expect(screen.getByText("phone-mockup.png")).toBeInTheDocument();
  });
});

describe("YellowButton", () => {
  it("renders its label", () => {
    render(<YellowButton>Download APK</YellowButton>);
    expect(
      screen.getByRole("button", { name: "Download APK" })
    ).toBeInTheDocument();
  });
});

describe("IconTile", () => {
  it("renders an accessible label", () => {
    render(<IconTile icon={Zap} label="Real-time" />);
    expect(screen.getByLabelText("Real-time")).toBeInTheDocument();
  });
});
