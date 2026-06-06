import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeUpReduced, revealGroup } from "../lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A single element that fades, rises, and unblurs into place. Inside a
 * <RevealGroup> it inherits the group's staggered timing automatically.
 * Honors prefers-reduced-motion by falling back to a fade-only variant.
 */
export function Reveal({ children, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={reduced ? fadeUpReduced : fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Container that reveals its <Reveal> children in a smooth cascade the first
 * time it scrolls into view. Owns the IntersectionObserver trigger.
 */
export function RevealGroup({ children, className }: RevealProps) {
  return (
    <motion.div
      variants={revealGroup}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
