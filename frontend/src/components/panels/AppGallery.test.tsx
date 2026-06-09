import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppGallery } from "./AppGallery";

describe("AppGallery", () => {
  it("opens a lightbox when a screen is clicked", async () => {
    const user = userEvent.setup();
    render(<AppGallery />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /enlarge appliance records screen/i })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("portals the lightbox out of the transformed track ancestor", async () => {
    // The showcase track has a transform/will-change, which makes it the
    // containing block for `position: fixed`. The lightbox must portal to
    // document.body so it stays viewport-relative; if it renders inside the
    // panel <section> it would be pushed off-screen in the real browser.
    const user = userEvent.setup();
    const { container } = render(<AppGallery />);

    await user.click(
      screen.getByRole("button", { name: /enlarge appliance records screen/i })
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.closest("section")).toBeNull();
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  it("pages through screens with next and closes with the X button", async () => {
    const user = userEvent.setup();
    render(<AppGallery />);

    await user.click(
      screen.getByRole("button", { name: /enlarge appliance records screen/i })
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Appliance records screen");

    await user.click(within(dialog).getByRole("button", { name: /next screen/i }));
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-label",
      "Usage history screen"
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /close preview/i,
      })
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<AppGallery />);

    await user.click(
      screen.getByRole("button", { name: /enlarge usage history screen/i })
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
