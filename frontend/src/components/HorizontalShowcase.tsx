import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import { Navbar } from "./Navbar";
import { ProgressNav } from "./ProgressNav";
import { ScrollCue } from "./ScrollCue";
import { Hero } from "./panels/Hero";
import { ProductBento } from "./panels/ProductBento";
import { AppGallery } from "./panels/AppGallery";
import { HowItWorks } from "./panels/HowItWorks";
import { ThesisFooter } from "./panels/ThesisFooter";

const PANEL_COUNT = 5;

/**
 * Top-level showcase. On desktop (>= md) the panels sit in a horizontal track
 * moved by the wheel/keyboard hook; below md the same track stacks vertically
 * (flex-col) and the hook no-ops, giving normal vertical scroll.
 */
export function HorizontalShowcase() {
  const { trackRef, active, progress, goTo } = useHorizontalScroll(PANEL_COUNT);

  return (
    <main className="relative md:h-svh md:overflow-hidden">
      <Navbar
        onHome={() => {
          goTo(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <ProgressNav
        count={PANEL_COUNT}
        active={active}
        progress={progress}
        onJump={goTo}
      />
      <ScrollCue active={active} />
      <div
        ref={trackRef}
        className="flex flex-col will-change-transform md:h-svh md:flex-row md:flex-nowrap"
      >
        <Hero />
        <ProductBento />
        <AppGallery />
        <HowItWorks />
        <ThesisFooter />
      </div>
    </main>
  );
}
