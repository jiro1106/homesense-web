type PlaceholderProps = {
  /** Asset filename hint shown in the box, e.g. "app-dashboard.png". */
  name: string;
  className?: string;
};

/**
 * A labeled stand-in for an image the user will supply later. Dashed border,
 * light fill, filename hint centered. Swap by dropping in the named asset.
 */
export function Placeholder({ name, className = "" }: PlaceholderProps) {
  return (
    <div
      className={
        "flex items-center justify-center rounded-2xl border border-dashed border-ink/30 bg-ink/5 text-ink/40 " +
        className
      }
    >
      <span className="px-3 text-center font-mono text-xs sm:text-sm">
        {name}
      </span>
    </div>
  );
}
