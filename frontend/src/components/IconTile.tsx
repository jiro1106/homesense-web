import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  /** Accessible label describing the icon's meaning. */
  label: string;
  className?: string;
};

/**
 * A pastel-yellow rounded tile holding a darker-yellow lucide icon. The tile is
 * labeled for assistive tech; the icon itself is decorative.
 */
export function IconTile({ icon: Icon, label, className = "" }: IconTileProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex h-14 w-14 items-center justify-center rounded-2xl bg-icon-tile " +
        className
      }
    >
      <Icon className="h-7 w-7 text-icon-stroke" strokeWidth={2.25} aria-hidden />
    </div>
  );
}
