// Main toolbar types
export type TabId = 'local-overrides' | 'flags' | 'settings';
export type ActiveTabId = TabId | undefined;

export const TAB_ORDER: readonly TabId[] = ['local-overrides', 'flags', 'settings'] as const;

export type ToolbarMode = 'dev-server' | 'sdk';

export const DEV_SERVER_TABS: readonly TabId[] = ['flags', 'settings'] as const;
export const SDK_MODE_TABS: readonly TabId[] = ['local-overrides', 'settings'] as const;

export function getToolbarMode(devServerUrl?: string): ToolbarMode {
  return devServerUrl ? 'dev-server' : 'sdk';
}

export function getTabsForMode(mode: ToolbarMode, hasFlagOverridePlugin: boolean): readonly TabId[] {
  if (mode === 'dev-server') {
    return DEV_SERVER_TABS;
  }
  // SDK mode only shows local-overrides if flag override plugin is available
  return hasFlagOverridePlugin ? SDK_MODE_TABS : (['settings'] as const);
}

// Feature flag types
export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  custom: boolean;
  description?: string;
  lastModified?: Date;
  environment?: string;
}

export const TOOLBAR_POSITIONS = ['left', 'right'] as const;
export type ToolbarPosition = (typeof TOOLBAR_POSITIONS)[number];
