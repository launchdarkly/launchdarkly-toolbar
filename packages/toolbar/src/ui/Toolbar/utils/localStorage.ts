import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  SETTINGS: 'ld-toolbar-settings',
  DISABLED: 'ld-toolbar-disabled',
  PROJECT: 'ld-toolbar-project',
} as const;

export interface ToolbarSettings {
  position: ToolbarPosition;
  reloadOnFlagChange: boolean;
  autoCollapse: boolean;
}

export const DEFAULT_SETTINGS: ToolbarSettings = {
  position: 'bottom-right',
  reloadOnFlagChange: false,
  autoCollapse: false,
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

export function saveToolbarAutoCollapse(autoCollapse: boolean): void {
  updateSetting('autoCollapse', autoCollapse);
}

export function loadToolbarAutoCollapse(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.autoCollapse;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.autoCollapse === 'boolean' ? parsed.autoCollapse : DEFAULT_SETTINGS.autoCollapse;
  } catch (error) {
    console.warn('Failed to load toolbar auto-collapse state from localStorage:', error);
    return false;
  }
}

export function saveReloadOnFlagChange(isReloadOnFlagChange: boolean): void {
  updateSetting('reloadOnFlagChange', isReloadOnFlagChange);
}

export function loadReloadOnFlagChange(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.reloadOnFlagChange;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.reloadOnFlagChange === 'boolean'
      ? parsed.reloadOnFlagChange
      : DEFAULT_SETTINGS.reloadOnFlagChange;
  } catch (error) {
    console.warn('Failed to load reload on flag change from localStorage:', error);
    return DEFAULT_SETTINGS.reloadOnFlagChange;
  }
}
