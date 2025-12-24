/**
 * Utilities for sharing and loading toolbar state via URL query parameters.
 *
 * State is encoded as a single base64-encoded JSON object in the ldToolbarState parameter.
 * The state includes: flag overrides, contexts, settings, starred flags, etc.
 */

import { LDContext } from 'launchdarkly-js-client-sdk';
import { ToolbarSettings } from '../ui/Toolbar/utils/localStorage';

/** Current version of the shared state format */
export const SHARED_STATE_VERSION = 1;

/** Default query parameter name for shared toolbar state */
export const DEFAULT_STATE_PARAM = 'ldToolbarState';

/** Maximum size of encoded state in characters (warning threshold) */
export const MAX_STATE_SIZE_WARNING = 2000;

/** Maximum size of encoded state in characters (hard limit) */
export const MAX_STATE_SIZE_LIMIT = 8192;

/**
 * Structure of the shared toolbar state
 */
export interface SharedToolbarState {
  /** Version of the state format */
  version: number;
  /** Flag overrides (flag key -> value) */
  overrides: Record<string, any>;
  /** Saved contexts */
  contexts: LDContext[];
  /** Currently active context */
  activeContext: LDContext | null;
  /** Toolbar settings */
  settings: Partial<ToolbarSettings>;
  /** Starred flag keys */
  starredFlags: string[];
}

/**
 * Result of serializing shared state
 */
export interface SerializeStateResult {
  /** The full URL with the state parameter */
  url: string;
  /** Size of the encoded state in characters */
  size: number;
  /** Whether the size exceeds the warning threshold */
  exceedsWarning: boolean;
  /** Whether the size exceeds the hard limit */
  exceedsLimit: boolean;
}

/**
 * Result of parsing shared state from URL
 */
export interface ParseStateResult {
  /** Whether a state parameter was found in the URL */
  found: boolean;
  /** The parsed state (if found and valid) */
  state: SharedToolbarState | null;
  /** Error message if parsing failed */
  error: string | null;
}

/**
 * Encodes state to a base64 string
 */
function encodeState(state: SharedToolbarState): string {
  const json = JSON.stringify(state);
  return btoa(json);
}

/**
 * Decodes a base64 string to state
 */
function decodeState(encoded: string): SharedToolbarState {
  const json = atob(encoded);
  return JSON.parse(json);
}

/**
 * Validates that a decoded state object has the expected structure
 */
function validateState(state: any): { valid: boolean; error: string | null } {
  // Must be an object
  if (!state || typeof state !== 'object') {
    return { valid: false, error: 'State must be an object' };
  }

  // Must have a version
  if (typeof state.version !== 'number') {
    return { valid: false, error: 'State must have a version number' };
  }

  // Warn if version is newer than we support
  if (state.version > SHARED_STATE_VERSION) {
    console.warn(
      `Shared state is from a newer toolbar version (v${state.version}, current: v${SHARED_STATE_VERSION}). Some features may not work correctly.`,
    );
  }

  // Validate structure (allow missing fields for backwards compatibility)
  if (state.overrides && typeof state.overrides !== 'object') {
    return { valid: false, error: 'overrides must be an object' };
  }

  if (state.contexts && !Array.isArray(state.contexts)) {
    return { valid: false, error: 'contexts must be an array' };
  }

  if (state.activeContext && typeof state.activeContext !== 'object') {
    return { valid: false, error: 'activeContext must be an object or null' };
  }

  if (state.settings && typeof state.settings !== 'object') {
    return { valid: false, error: 'settings must be an object' };
  }

  if (state.starredFlags && !Array.isArray(state.starredFlags)) {
    return { valid: false, error: 'starredFlags must be an array' };
  }

  return { valid: true, error: null };
}

/**
 * Serializes toolbar state into a URL with a query parameter
 *
 * @param state - The state to serialize
 * @param baseUrl - The base URL to append the parameter to (defaults to current URL without params)
 * @param paramName - The query parameter name (defaults to 'ldToolbarState')
 * @returns Result containing the URL and size information
 *
 */
export function serializeToolbarState(
  state: SharedToolbarState,
  baseUrl: string = window.location.origin + window.location.pathname,
  paramName: string = DEFAULT_STATE_PARAM,
): SerializeStateResult {
  const url = new URL(baseUrl);

  // Preserve existing query parameters (except the state param)
  const currentParams = new URLSearchParams(window.location.search);
  currentParams.forEach((value, key) => {
    if (key !== paramName) {
      url.searchParams.set(key, value);
    }
  });

  // Encode and add state parameter
  const encoded = encodeState(state);
  url.searchParams.set(paramName, encoded);

  const fullUrl = url.toString();
  const size = encoded.length;

  return {
    url: fullUrl,
    size,
    exceedsWarning: size > MAX_STATE_SIZE_WARNING,
    exceedsLimit: size > MAX_STATE_SIZE_LIMIT,
  };
}

/**
 * Parses toolbar state from a URL query parameter
 *
 * @param url - The URL to parse (defaults to window.location.href)
 * @param paramName - The query parameter name (defaults to 'ldToolbarState')
 * @returns Result containing whether state was found, the parsed state, and any error
 *
 */
export function parseToolbarState(
  url: string = window.location.href,
  paramName: string = DEFAULT_STATE_PARAM,
): ParseStateResult {
  try {
    const urlObj = new URL(url);
    const encoded = urlObj.searchParams.get(paramName);

    if (!encoded) {
      return { found: false, state: null, error: null };
    }

    // Decode the state
    let decoded: any;
    try {
      decoded = decodeState(encoded);
    } catch (error) {
      return {
        found: true,
        state: null,
        error: 'Failed to decode state: ' + (error instanceof Error ? error.message : String(error)),
      };
    }

    // Validate the state
    const validation = validateState(decoded);
    if (!validation.valid) {
      return {
        found: true,
        state: null,
        error: validation.error,
      };
    }

    return {
      found: true,
      state: decoded as SharedToolbarState,
      error: null,
    };
  } catch (error) {
    return {
      found: false,
      state: null,
      error: 'Failed to parse URL: ' + (error instanceof Error ? error.message : String(error)),
    };
  }
}

/**
 * Checks if the current URL contains a toolbar state parameter
 *
 * @param url - The URL to check (defaults to window.location.href)
 * @param paramName - The query parameter name (defaults to 'ldToolbarState')
 * @returns True if the URL contains a state parameter
 */
export function hasToolbarState(url: string = window.location.href, paramName: string = DEFAULT_STATE_PARAM): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.has(paramName);
  } catch (error) {
    console.error('Failed to check for toolbar state:', error);
    return false;
  }
}

/**
 * Removes the toolbar state parameter from the current URL
 * Uses history.replaceState to avoid affecting browser history
 *
 * @param paramName - The query parameter name (defaults to 'ldToolbarState')
 */
export function clearToolbarStateFromUrl(paramName: string = DEFAULT_STATE_PARAM): void {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(paramName)) {
      url.searchParams.delete(paramName);
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    console.error('Failed to clear toolbar state from URL:', error);
  }
}

/**
 * Loads shared toolbar state from URL and applies it to localStorage
 * Should be called during toolbar initialization, before any components render
 *
 * @param paramName - The query parameter name (defaults to 'ldToolbarState')
 * @param flagOverrideStorageNamespace - The storage namespace for flag overrides (defaults to 'ld-flag-override')
 * @param flagOverridePlugin - Optional flag override plugin to apply overrides to directly
 * @returns Object indicating whether state was loaded and if there were any errors
 *
 */
export function loadSharedStateFromUrl(
  paramName: string = DEFAULT_STATE_PARAM,
  flagOverrideStorageNamespace: string = 'ld-flag-override',
  flagOverridePlugin?: any,
): { loaded: boolean; error: string | null } {
  try {
    // Parse the state from URL
    const result = parseToolbarState(window.location.href, paramName);

    if (!result.found) {
      return { loaded: false, error: null };
    }

    if (result.error || !result.state) {
      console.error('Failed to parse shared toolbar state from URL:', result.error);
      return { loaded: false, error: result.error };
    }

    const state = result.state;

    // Apply flag overrides to localStorage
    if (state.overrides && typeof state.overrides === 'object') {
      const storage = window.localStorage;
      Object.entries(state.overrides).forEach(([flagKey, value]) => {
        try {
          const storageKey = `${flagOverrideStorageNamespace}:${flagKey}`;
          storage.setItem(storageKey, JSON.stringify(value));
        } catch (error) {
          console.error(`Failed to save override for flag ${flagKey}:`, error);
        }
      });
      console.log('Loaded flag overrides from shared state:', Object.keys(state.overrides));

      // If a flag override plugin is provided, apply overrides directly to it
      // This handles the case where the plugin has already initialized and loaded from localStorage
      if (flagOverridePlugin && typeof flagOverridePlugin.setOverride === 'function') {
        Object.entries(state.overrides).forEach(([flagKey, value]) => {
          try {
            flagOverridePlugin.setOverride(flagKey, value);
          } catch (error) {
            console.error(`Failed to set override on plugin for flag ${flagKey}:`, error);
          }
        });
        console.log('Applied overrides directly to FlagOverridePlugin');
      }
    }

    // Apply contexts to localStorage
    if (state.contexts && Array.isArray(state.contexts)) {
      try {
        window.localStorage.setItem('ld-toolbar-contexts', JSON.stringify(state.contexts));
        console.log('Loaded contexts from shared state:', state.contexts.length);
      } catch (error) {
        console.error('Failed to save contexts:', error);
      }
    }

    // Apply active context to localStorage
    if (state.activeContext) {
      try {
        window.localStorage.setItem('ld-toolbar-active-context', JSON.stringify(state.activeContext));
        console.log('Loaded active context from shared state');
      } catch (error) {
        console.error('Failed to save active context:', error);
      }
    }

    // Apply settings to localStorage
    if (state.settings && typeof state.settings === 'object') {
      try {
        window.localStorage.setItem('ld-toolbar-settings', JSON.stringify(state.settings));
        console.log('Loaded settings from shared state');
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }

    // Apply starred flags to localStorage
    if (state.starredFlags && Array.isArray(state.starredFlags)) {
      try {
        window.localStorage.setItem('ld-toolbar-starred-flags', JSON.stringify(state.starredFlags));
        console.log('Loaded starred flags from shared state:', state.starredFlags.length);
      } catch (error) {
        console.error('Failed to save starred flags:', error);
      }
    }

    // Clear the URL parameter now that state has been loaded
    clearToolbarStateFromUrl(paramName);

    console.log('Successfully loaded shared toolbar state from URL');
    return { loaded: true, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to load shared state from URL:', error);
    return { loaded: false, error: errorMessage };
  }
}
