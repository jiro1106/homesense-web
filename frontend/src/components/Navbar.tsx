import { YellowButton } from "./YellowButton";
import { DOWNLOAD_APK_URL } from "../lib/links";
import logoBulb from "../assets/logo.png";

/** Android robot glyph, sized to sit inline before the button label. */
function AndroidIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.6 9.48 19 7.05a.5.5 0 0 0-.18-.68.5.5 0 0 0-.68.18l-1.42 2.46A8.7 8.7 0 0 0 12 8a8.7 8.7 0 0 0-4.72 1.01L5.86 6.55a.5.5 0 0 0-.68-.18.5.5 0 0 0-.18.68l1.4 2.43A8.06 8.06 0 0 0 3 16h18a8.06 8.06 0 0 0-3.4-6.52ZM8 13.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  );
}

type NavbarProps = {
  /** Jump back to the hero section from anywhere in the showcase. */
  onHome?: () => void;
};

/**
 * Fixed top navbar that stays put while the showcase scrolls. Left side is the
 * HomeSense wordmark built from the bulb logo as the "o"; right side is the
 * Android-only Download APK call to action. Horizontal padding matches Panel so
 * the bar lines up with the page margins.
 */
export function Navbar({ onHome }: NavbarProps = {}) {
  const handleHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onHome) return;
    e.preventDefault();
    onHome();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-4 backdrop-blur-sm md:px-16 lg:px-24">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <a
          href="#"
          onClick={handleHome}
          aria-label="HomeSense home"
          className="flex cursor-pointer items-center font-display text-2xl font-extrabold tracking-tight text-ink"
        >
          <span>H</span>
          <img
            src={logoBulb}
            alt="HomeSense"
            className="mx-px h-7 w-7 object-contain"
          />
          <span>meSense</span>
        </a>

        <YellowButton
          href={DOWNLOAD_APK_URL}
          target="_blank"
          className="gap-1.5 px-3 py-1.5 text-xs sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <AndroidIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Download APK
        </YellowButton>
      </nav>
    </header>
  );
}
