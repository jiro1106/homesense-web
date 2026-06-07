import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type ScrollCueProps = {
  /** Desktop active panel index; the cue retires once you leave the first panel. */
  active: number;
};

/** Thin chevron drawn with the current text color. */
function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/**
 * First-run wayfinding nudge for the showcase. Because the page scrolls
 * horizontally on desktop and vertically on mobile, the cue is direction-aware:
 * a rightward chevron pinned to the right edge on desktop, a downward chevron
 * at the bottom on mobile. A gentle loop draws the eye, then the cue dismisses
 * itself the first time the user actually moves. The looping nudge is a pure
 * transform, so the global `MotionConfig reducedMotion="user"` flattens it for
 * users who opt out of motion while the fade in/out stays.
 */
export function ScrollCue({ active }: ScrollCueProps) {
  const [scrolled, setScrolled] = useState(false);

  // Mobile scrolls natively, so `active` never advances there; watch the window
  // scroll position to retire the cue once the user has started moving.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismissed = scrolled || active > 0;

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <>
          {/* Desktop: right edge, nudging toward the next panel. */}
          <motion.div
            key="scroll-cue-desktop"
            {...fade}
            className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 text-ink/40 md:block lg:right-10"
          >
            <motion.span
              className="block"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            >
              <Chevron className="h-7 w-7" />
            </motion.span>
          </motion.div>

          {/* Mobile: bottom center, nudging down the stack. */}
          <motion.div
            key="scroll-cue-mobile"
            {...fade}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center text-ink/40 md:hidden"
          >
            <motion.span
              className="block"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            >
              <Chevron className="h-7 w-7 rotate-90" />
            </motion.span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
