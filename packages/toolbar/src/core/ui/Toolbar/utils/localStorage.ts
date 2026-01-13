import type { LDContext } from 'launchdarkly-js-client-sdk';
import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  SETTINGS: 'ld-toolbar-settings',
  DISABLED: 'ld-toolbar-disabled',
  STARRED_FLAGS: 'ld-toolbar-starred-flags',
  MCP_ALERT_DISMISSED: 'ld-toolbar-mcp-alert-dismissed',
  ANALYTICS_CONSENT_SHOWN: 'ld-toolbar-analytics-consent-shown',
  CONTEXTS: 'ld-toolbar-contexts',
  ACTIVE_CONTEXT: 'ld-toolbar-active-context',
} as const;

export type PreferredIde = 'cursor' | 'windsurf' | 'vscode' | 'github-copilot';

export const PREFERRED_IDES: PreferredIde[] = ['cursor', 'windsurf', 'vscode', 'github-copilot'];

export interface ToolbarSettings {
  position: ToolbarPosition;
  reloadOnFlagChange: boolean;
  autoCollapse: boolean;
  preferredIde: PreferredIde;
  isOptedInToAnalytics: boolean;
  isOptedInToEnhancedAnalytics: boolean;
  isOptedInToSessionReplay: boolean;
}

export const DEFAULT_SETTINGS: ToolbarSettings = {
  position: 'bottom-right',
  reloadOnFlagChange: false,
  autoCollapse: false,
  preferredIde: 'cursor',
  isOptedInToAnalytics: false,
  isOptedInToEnhancedAnalytics: false,
  isOptedInToSessionReplay: false,
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

export function loadStarredFlags(): Set<string> {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    }
  } catch (error) {
    console.error('Error reading starred flags from localStorage:', error);
  }
  return new Set();
}

export function saveStarredFlags(starredFlags: Set<string>): void {
  try {
    const value = JSON.stringify(Array.from(starredFlags));
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, value);
  } catch (error) {
    console.error('Error saving starred flags to localStorage:', error);
  }
}

export function savePreferredIde(ide: PreferredIde): void {
  updateSetting('preferredIde', ide);
}

export function loadPreferredIde(): PreferredIde {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.preferredIde;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return parsed.preferredIde && PREFERRED_IDES.includes(parsed.preferredIde)
      ? parsed.preferredIde
      : DEFAULT_SETTINGS.preferredIde;
  } catch (error) {
    console.warn('Failed to load preferred IDE from localStorage:', error);
    return DEFAULT_SETTINGS.preferredIde;
  }
}

export function saveMCPAlertDismissed(dismissed: boolean): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.MCP_ALERT_DISMISSED, JSON.stringify(dismissed));
  } catch (error) {
    console.warn('Failed to save MCP alert dismissed state to localStorage:', error);
  }
}

export function loadMCPAlertDismissed(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.MCP_ALERT_DISMISSED);
    if (!stored) {
      return false;
    }
    return JSON.parse(stored) === true;
  } catch (error) {
    console.warn('Failed to load MCP alert dismissed state from localStorage:', error);
    return false;
  }
}

export function loadContexts(): Array<LDContext> {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.CONTEXTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Error reading contexts from localStorage:', error);
  }
  return [];
}

export function saveContexts(contexts: Array<LDContext>): void {
  try {
    const value = JSON.stringify(contexts);
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.CONTEXTS, value);
  } catch (error) {
    console.error('Error saving contexts to localStorage:', error);
  }
}

export function loadActiveContext(): LDContext | null {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.ACTIVE_CONTEXT);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's a valid LDContext object
      if (parsed && typeof parsed === 'object' && parsed.kind) {
        return parsed as LDContext;
      }
    }
  } catch (error) {
    console.error('Error reading active context from localStorage:', error);
  }
  return null;
}

export function saveActiveContext(context: LDContext | null): void {
  try {
    if (context) {
      const value = JSON.stringify(context);
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.ACTIVE_CONTEXT, value);
    } else {
      localStorage.removeItem(TOOLBAR_STORAGE_KEYS.ACTIVE_CONTEXT);
    }
  } catch (error) {
    console.error('Error saving active context to localStorage:', error);
  }
}

export function saveIsOptedInToAnalytics(isOptedInToAnalytics: boolean): void {
  updateSetting('isOptedInToAnalytics', isOptedInToAnalytics);
}

export function loadIsOptedInToAnalytics(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.isOptedInToAnalytics;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.isOptedInToAnalytics === 'boolean'
      ? parsed.isOptedInToAnalytics
      : DEFAULT_SETTINGS.isOptedInToAnalytics;
  } catch (error) {
    console.warn('Failed to load is opted in to analytics from localStorage:', error);
    return DEFAULT_SETTINGS.isOptedInToAnalytics;
  }
}

export function saveIsOptedInToEnhancedAnalytics(isOptedInToEnhancedAnalytics: boolean): void {
  updateSetting('isOptedInToEnhancedAnalytics', isOptedInToEnhancedAnalytics);
}

export function saveIsOptedInToSessionReplay(isOptedInToSessionReplay: boolean): void {
  updateSetting('isOptedInToSessionReplay', isOptedInToSessionReplay);
}

export function loadIsOptedInToSessionReplay(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.isOptedInToSessionReplay;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.isOptedInToSessionReplay === 'boolean'
      ? parsed.isOptedInToSessionReplay
      : DEFAULT_SETTINGS.isOptedInToSessionReplay;
  } catch (error) {
    console.warn('Failed to load is opted in to session replay from localStorage:', error);
    return DEFAULT_SETTINGS.isOptedInToSessionReplay;
  }
}

export function loadIsOptedInToEnhancedAnalytics(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS.isOptedInToEnhancedAnalytics;
    }

    const parsed = JSON.parse(stored) as Partial<ToolbarSettings>;
    return typeof parsed.isOptedInToEnhancedAnalytics === 'boolean'
      ? parsed.isOptedInToEnhancedAnalytics
      : DEFAULT_SETTINGS.isOptedInToEnhancedAnalytics;
  } catch (error) {
    console.warn('Failed to load is opted in to enhanced analytics from localStorage:', error);
    return DEFAULT_SETTINGS.isOptedInToEnhancedAnalytics;
  }
}

export function saveAnalyticsConsentShown(shown: boolean): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.ANALYTICS_CONSENT_SHOWN, JSON.stringify(shown));
  } catch (error) {
    console.warn('Failed to save analytics consent shown state to localStorage:', error);
  }
}

export function loadAnalyticsConsentShown(): boolean {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.ANALYTICS_CONSENT_SHOWN);
    if (!stored) {
      return false;
    }
    return JSON.parse(stored) === true;
  } catch (error) {
    console.warn('Failed to load analytics consent shown state from localStorage:', error);
    return false;
  }
}

export function loadAllSettings(): Partial<ToolbarSettings> {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as Partial<ToolbarSettings>;
  } catch (error) {
    console.warn('Failed to load all settings from localStorage:', error);
    return {};
  }
}

export function saveAllSettings(settings: Partial<ToolbarSettings>): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save all settings to localStorage:', error);
  }
}
