/** Right-angle PCB trace path, horizontal (viewBox 0 0 100 40). */
const H_PATH = "M0,20 H30 V10 H50 V30 H70 V20 H100";
/** Right-angle PCB trace path, vertical (viewBox 0 0 40 60). */
const V_PATH = "M20,0 V18 H30 V42 H10 V60";

type WireProps = {
  /** Milliseconds to delay the charge pulse, for propagation stagger. */
  delay?: number;
};

/**
 * Decorative connector between two pipeline steps. Draws a static circuit
 * trace plus an accent-yellow charge that glides along it (CSS `.wire-charge`).
 * Horizontal variant fills the row gap on desktop; vertical variant connects
 * the stacked nodes on mobile.
 */
export function Wire({ delay = 0 }: WireProps) {
  const style = { animationDelay: `${delay}ms` };
  return (
    <div
      aria-hidden
      className="flex items-center justify-center py-1 md:flex-1 md:py-0"
    >
      {/* Desktop: horizontal trace */}
      <svg
        className="hidden h-10 w-full md:block"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d={H_PATH}
          className="fill-none stroke-ink/15"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={H_PATH}
          className="wire-charge fill-none stroke-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={style}
        />
      </svg>

      {/* Mobile: vertical trace */}
      <svg
        className="h-12 w-10 md:hidden"
        viewBox="0 0 40 60"
        preserveAspectRatio="none"
      >
        <path
          d={V_PATH}
          className="fill-none stroke-ink/15"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={V_PATH}
          className="wire-charge fill-none stroke-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={style}
        />
      </svg>
    </div>
  );
}
