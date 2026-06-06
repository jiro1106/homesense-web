import type { Variants } from "framer-motion";

/** Smooth expo-style deceleration curve shared by every reveal. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** A single element fading and rising into place with a light blur-in. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/** Reduced-motion fallback: fade only, no movement or blur. */
export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** Container that cascades its `fadeUp` children when it scrolls into view. */
export const revealGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
