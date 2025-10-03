/**
 * LaunchDarkly Toolbar window API interface
 */
interface LdToolbarAPI {
  /** Disable the toolbar and save preference to localStorage */
  disable: () => void;
  /** Enable the toolbar and remove preference from localStorage */
  enable: () => void;
  /** Check current toolbar status and log to console */
  status: () => boolean;
  /** Toggle toolbar enabled/disabled state */
  toggle: () => void;
}

declare global {
  interface Window {
    ldToolbar?: LdToolbarAPI;
  }
}

// This empty export makes this file a module, ensuring the global declarations are processed
export {};
