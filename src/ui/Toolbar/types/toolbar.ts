// Main toolbar types
export type TabId = 'flag-sdk' | 'flag-dev-server' | 'settings';
export type ActiveTabId = TabId | undefined;

export const TAB_ORDER: readonly TabId[] = ['flag-sdk', 'flag-dev-server', 'settings'] as const;

export type ToolbarMode = 'dev-server' | 'sdk';

export const DEV_SERVER_TABS: readonly TabId[] = ['flag-dev-server', 'settings'] as const;
export const SDK_MODE_TABS: readonly TabId[] = ['flag-sdk', 'settings'] as const;

export function getToolbarMode(devServerUrl?: string): ToolbarMode {
  return devServerUrl ? 'dev-server' : 'sdk';
}

export function getTabsForMode(mode: ToolbarMode, hasDebugOverridePlugin: boolean): readonly TabId[] {
  if (mode === 'dev-server') {
    return DEV_SERVER_TABS;
  }
  // SDK mode only shows flag-sdk if flag override plugin is available
  return hasDebugOverridePlugin ? SDK_MODE_TABS : (['settings'] as const);
}

export function getDefaultActiveTab(mode: ToolbarMode): TabId {
  if (mode === 'dev-server') {
    return 'flag-dev-server';
  }

  if (mode === 'sdk') {
    return 'flag-sdk';
  }

  return 'settings';
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
