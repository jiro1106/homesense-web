import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  /** The thumbnail that opened the lightbox, so focus can return to it. */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openAt = useCallback((index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

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
      <RevealGroup className="text-center md:text-left">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            See it in action
          </h2>
        </Reveal>
        <Reveal className="mx-auto mt-3 max-w-md md:mx-0">
          <p className="text-ink/60">
            A look at the screens you'll live in every day.
          </p>
        </Reveal>
      </RevealGroup>

      <div className="relative mt-[clamp(2rem,5vh,3rem)]">
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
          className="snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] [&::-webkit-scrollbar]:hidden"
        >
          <RevealGroup className="flex w-max gap-5">
            {screens.map((screen, i) => (
              <Reveal
                key={screen.src}
                className="aspect-9/19 h-[clamp(18rem,52vh,32rem)] shrink-0 snap-start"
              >
                <motion.button
                  type="button"
                  data-card
                  whileHover={hoverLift}
                  transition={liftSpring}
                  onClick={(e) => openAt(i, e.currentTarget)}
                  aria-label={`Enlarge ${screen.alt}`}
                  className="block h-full w-full cursor-pointer rounded-2xl"
                >
                  <img
                    src={screen.src}
                    alt={screen.alt}
                    className="h-full w-full rounded-2xl border border-ink/10 object-cover shadow-lg shadow-ink/10"
                  />
                </motion.button>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            index={activeIndex}
            reduced={!!reduced}
            onClose={close}
            onNavigate={(next) =>
              setActiveIndex((screens.length + next) % screens.length)
            }
          />
        )}
      </AnimatePresence>
    </Panel>
  );
}

type LightboxProps = {
  index: number;
  reduced: boolean;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

/**
 * Fullscreen preview of a single screen. Dark, blurred scrim over the rest of
 * the site; prev/next page through all screens (looping), and the overlay,
 * Esc, or the X button all dismiss it. Locks body scroll and traps initial
 * focus while open.
 *
 * Rendered through a portal to document.body so its `position: fixed` is
 * relative to the viewport. The showcase track is a transformed ancestor
 * (translateX + will-change), which would otherwise become the containing
 * block and push this overlay off-screen.
 */
function Lightbox({ index, reduced, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const screen = screens[index];

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNavigate(index + 1);
      else if (e.key === "ArrowLeft") onNavigate(index - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate]);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Move focus into the dialog on open.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const fade = reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const pop = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      };

  return createPortal(
    <motion.div
      {...fade}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={screen.alt}
      tabIndex={-1}
      onClick={(e) => {
        // Only a click on the scrim itself dismisses; clicks on the image or
        // controls bubble up here but must not close.
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md outline-none"
    >
      <CarouselButton
        label="Previous screen"
        onClick={() => onNavigate(index - 1)}
        className="left-2 sm:left-5"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </CarouselButton>
      <CarouselButton
        label="Next screen"
        onClick={() => onNavigate(index + 1)}
        className="right-2 sm:right-5"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </CarouselButton>

      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-paper/20 bg-paper/10 text-paper transition hover:bg-paper/20 active:scale-95"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <motion.img
        {...pop}
        key={screen.src}
        src={screen.src}
        alt={screen.alt}
        className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl shadow-ink/40"
      />
    </motion.div>,
    document.body
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
