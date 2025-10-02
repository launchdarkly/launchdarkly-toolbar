import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  SETTINGS: 'ld-toolbar-settings',
  DISABLED: 'ld-toolbar-disabled',
  PROJECT: 'ld-toolbar-project',
  PINNED_FLAGS: 'ld-toolbar-pinned-flags',
} as const;

export interface ToolbarSettings {
  position: ToolbarPosition;
  pinned: boolean;
}

export const DEFAULT_SETTINGS: ToolbarSettings = {
  position: 'bottom-right',
  pinned: false,
};

/**
 * Update a single setting in the shared localStorage object
 * Only merges with existing saved values, doesn't use defaults for unsaved properties
 */
function updateSetting<K extends keyof ToolbarSettings>(key: K, value: ToolbarSettings[K]): void {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    let currentSettings: Partial<ToolbarSettings> = {};

    if (stored) {
      currentSettings = JSON.parse(stored) as Partial<ToolbarSettings>;
    }

    const newSettings = { ...currentSettings, [key]: value };
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  } catch (error) {
    console.warn(`Failed to save toolbar ${key} to localStorage:`, error);
  }
}

export function saveToolbarPosition(position: ToolbarPosition): void {
  updateSetting('position', position);
}

export function loadToolbarPosition(): ToolbarPosition | null {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return null; // No saved settings, let user use their value if provided
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    if (!parsed.position) {
      return null;
    }
    return TOOLBAR_POSITIONS.includes(parsed.position) ? parsed.position : null;
  } catch (error) {
    console.warn('Failed to load toolbar position from localStorage:', error);
    return null;
  }
}

export function saveToolbarPinned(isPinned: boolean): void {
  updateSetting('pinned', isPinned);
}

export function loadToolbarPinned(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.pinned;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.pinned === 'boolean' ? parsed.pinned : DEFAULT_SETTINGS.pinned;
  } catch (error) {
    console.warn('Failed to load toolbar pinned state from localStorage:', error);
    return false;
  }
}

export function loadPinnedFlags(): Set<string> {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.PINNED_FLAGS);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Failed to load pinned flags from localStorage:', error);
  }
  return new Set();
}

export function savePinnedFlags(flags: Set<string>): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.PINNED_FLAGS, JSON.stringify(Array.from(flags)));
  } catch (error) {
    console.error('Failed to save pinned flags to localStorage:', error);
  }
}
