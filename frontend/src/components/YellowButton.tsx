import { motion } from "framer-motion";
import type { ReactNode } from "react";

type YellowButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Primary call-to-action. Yellow fill, black text. Renders an anchor when
 * `href` is provided, otherwise a button. Subtle press/hover via Framer Motion.
 */
export function YellowButton({
  children,
  href,
  onClick,
  className = "",
}: YellowButtonProps) {
  const classes =
    "inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
    className;

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
