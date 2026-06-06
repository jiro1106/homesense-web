import "@testing-library/jest-dom";

// framer-motion's whileInView / viewport feature requires IntersectionObserver,
// which jsdom does not implement. Provide a minimal no-op stub so tests pass.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

// framer-motion's useReducedMotion calls window.matchMedia, which jsdom does
// not implement. Provide a stub that reports "no preference".
if (typeof window.matchMedia === "undefined") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
