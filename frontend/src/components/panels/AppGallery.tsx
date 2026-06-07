import { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Panel } from "./Panel";
import { Reveal, RevealGroup } from "../Reveal";
import screen1 from "../../assets/bare-app-screen-1.png";
import screen2 from "../../assets/bare-app-screen-2.png";
import screen3 from "../../assets/bare-app-screen-3.png";
import screen4 from "../../assets/bare-app-screen-4.png";
import screen5 from "../../assets/bare-app-screen-5.png";
import screen6 from "../../assets/bare-app-screen-6.png";

const hoverLift = { y: -6 };
const liftSpring = { type: "spring", stiffness: 300, damping: 24 } as const;

/** Flex gap between screens, in px. Mirrors the `gap-5` on the track. */
const GAP = 20;

const screens = [
  { src: screen1, alt: "Appliance records screen" },
  { src: screen2, alt: "Usage history screen" },
  { src: screen3, alt: "Cost estimate screen" },
  { src: screen4, alt: "Bill prediction screen" },
  { src: screen5, alt: "Recommendations screen" },
  { src: screen6, alt: "Alerts screen" },
];

/**
 * Panel 3. A filmstrip of bare app screens inside a fixed-size viewport. When
 * the screens overflow the viewport, prev/next buttons appear that page the
 * strip one screen at a time and loop around at either end (no autoplay). On
 * mobile the strip is also free to scroll/swipe. Honors reduced-motion by
 * jumping instead of smooth-scrolling.
 */
export function AppGallery() {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);

  const page = useCallback(
    (dir: 1 | -1) => {
      const el = viewportRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + GAP : el.clientWidth;
      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      const atStart = el.scrollLeft <= 1;

      if (dir > 0) {
        if (atEnd) el.scrollTo({ left: 0, behavior });
        else el.scrollBy({ left: step, behavior });
      } else {
        if (atStart) el.scrollTo({ left: el.scrollWidth, behavior });
        else el.scrollBy({ left: -step, behavior });
      }
    },
    [reduced]
  );

  return (
    <Panel>
      <RevealGroup>
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            See it in action
          </h2>
        </Reveal>
        <Reveal className="mt-3 max-w-md">
          <p className="text-ink/60">
            A look at the screens you'll live in every day.
          </p>
        </Reveal>
      </RevealGroup>

      <div className="relative mt-12">
        <CarouselButton
          label="Previous screen"
          onClick={() => page(-1)}
          className="-left-1 sm:-left-5"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </CarouselButton>
        <CarouselButton
          label="Next screen"
          onClick={() => page(1)}
          className="-right-1 sm:-right-5"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </CarouselButton>
        <div
          ref={viewportRef}
          className="snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [&::-webkit-scrollbar]:hidden"
        >
          <RevealGroup className="flex w-max gap-5">
            {screens.map((screen) => (
              <Reveal
                key={screen.src}
                className="aspect-9/19 h-[clamp(18rem,52vh,32rem)] shrink-0 snap-start"
              >
                <motion.img
                  data-card
                  whileHover={hoverLift}
                  transition={liftSpring}
                  src={screen.src}
                  alt={screen.alt}
                  className="h-full w-full rounded-2xl border border-ink/10 object-cover shadow-lg shadow-ink/10"
                />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Panel>
  );
}

type CarouselButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

/** Round prev/next control overlaying the faded edges of the carousel. */
function CarouselButton({
  label,
  onClick,
  className = "",
  children,
}: CarouselButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-paper text-ink/70 shadow-md shadow-ink/10 transition hover:scale-105 hover:text-ink active:scale-95 " +
        className
      }
    >
      {children}
    </button>
  );
}
