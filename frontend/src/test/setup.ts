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
