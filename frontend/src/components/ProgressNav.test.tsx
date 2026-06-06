import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressNav } from "./ProgressNav";

describe("ProgressNav", () => {
  it("renders one dot per panel", () => {
    render(
      <ProgressNav count={4} active={0} progress={0} onJump={() => {}} />
    );
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("calls onJump with the dot index when clicked", async () => {
    const onJump = vi.fn();
    render(
      <ProgressNav count={4} active={0} progress={0} onJump={onJump} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Go to panel 3" }));
    expect(onJump).toHaveBeenCalledWith(2);
  });
});
