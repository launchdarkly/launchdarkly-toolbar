import '@testing-library/jest-dom/vitest';
import '@vanilla-extract/css/disableRuntimeStyles';

// Mock browser APIs that aren't implemented in JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

Object.defineProperty(window, 'scroll', {
  value: () => {},
  writable: true,
});

Object.defineProperty(window, 'scrollBy', {
  value: () => {},
  writable: true,
});

// Mock ResizeObserver
globalThis.ResizeObserver =
  globalThis.ResizeObserver ||
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
