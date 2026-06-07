import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  /** Accessible label describing the icon's meaning. */
  label: string;
  /** Visual size. `sm` is the compact bento variant; `md` is the default. */
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: { tile: "h-10 w-10 rounded-xl", icon: "h-5 w-5" },
  md: { tile: "h-14 w-14 rounded-2xl", icon: "h-7 w-7" },
} as const;

/**
 * A pastel-yellow rounded tile holding a darker-yellow lucide icon. The tile is
 * labeled for assistive tech; the icon itself is decorative.
 */
export function IconTile({
  icon: Icon,
  label,
  size = "md",
  className = "",
}: IconTileProps) {
  const s = SIZES[size];
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex items-center justify-center bg-icon-tile " + s.tile + " " + className
      }
    >
      <Icon className={s.icon + " text-icon-stroke"} strokeWidth={2.25} aria-hidden />
    </div>
  );
}
