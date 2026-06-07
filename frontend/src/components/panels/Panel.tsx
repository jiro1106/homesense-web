import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * One full-viewport panel. On desktop it is exactly one screen wide and sits in
 * the horizontal track; on mobile it becomes a normal full-height stacked
 * section (the parent flex-row switches to flex-col below md).
 */
export function Panel({ children, className = "" }: PanelProps) {
  return (
    <section
      className={
        "flex min-h-svh w-full shrink-0 flex-col justify-center px-6 pb-16 pt-28 md:h-svh md:w-screen md:px-16 md:pb-[clamp(2.5rem,6vh,4rem)] md:pt-[clamp(6rem,11vh,9rem)] lg:px-24 " +
        className
      }
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
