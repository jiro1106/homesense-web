import { motion } from "framer-motion";

type ProgressNavProps = {
  count: number;
  active: number;
  /** 0..1 overall scroll progress. */
  progress: number;
  onJump: (index: number) => void;
};

/**
 * Fixed top progress bar (yellow fill) plus a row of clickable panel dots.
 * Hidden on mobile where the page scrolls vertically.
 */
export function ProgressNav({ count, active, progress, onJump }: ProgressNavProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden md:block">
      <div className="h-1 w-full bg-ink/10">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="pointer-events-auto mt-4 flex justify-center gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to panel ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => onJump(i)}
            className={
              "h-2.5 rounded-full transition-all " +
              (i === active ? "w-8 bg-accent" : "w-2.5 bg-ink/25 hover:bg-ink/50")
            }
          />
        ))}
      </div>
    </div>
  );
}
