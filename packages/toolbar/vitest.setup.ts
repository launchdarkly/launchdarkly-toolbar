import '@testing-library/jest-dom/vitest';
import '@vanilla-extract/css/disableRuntimeStyles';
import { vi } from 'vitest';

// =============================================================================
// Global Provider Mocks
// =============================================================================
// These mocks are applied globally to all tests. If a test file needs to test
// the REAL implementation, add `vi.unmock('...')` at the top of that test file.
// =============================================================================

// Mock AnalyticsPreferencesProvider globally (used by AnalyticsProvider)
// To test the real implementation, add: vi.unmock('./src/core/ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider')
vi.mock('./src/core/ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
  const { createAnalyticsPreferencesProviderMock } = await import('./src/core/tests/mocks/providers');
  return createAnalyticsPreferencesProviderMock();
});

// Mock localStorage with actual storage behavior
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => storage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }),
  key: vi.fn((index: number) => {
    const keys = Object.keys(storage);
    return keys[index] || null;
  }),
  get length() {
    return Object.keys(storage).length;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

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

// Mock window.matchMedia (not implemented in jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but still used
    removeListener: vi.fn(), // Deprecated but still used
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
