// Main toolbar types
export type TabId = 'flag-sdk' | 'flag-dev-server' | 'events' | 'settings';
export type ActiveTabId = TabId | undefined;

export const TAB_ORDER: readonly TabId[] = ['flag-sdk', 'flag-dev-server', 'events', 'settings'] as const;

export type ToolbarMode = 'dev-server' | 'sdk';

export const DEV_SERVER_TABS: readonly TabId[] = ['flag-dev-server', 'settings'] as const;
export const SDK_MODE_TABS: readonly TabId[] = ['flag-sdk', 'events', 'settings'] as const;

export function getToolbarMode(devServerUrl?: string): ToolbarMode {
  return devServerUrl ? 'dev-server' : 'sdk';
}

export function getTabsForMode(
  mode: ToolbarMode,
  hasFlagOverridePlugin: boolean,
  hasEventInterceptionPlugin: boolean,
): readonly TabId[] {
  if (mode === 'dev-server') {
    // Dev-server mode: always show flag-dev-server, conditionally show events
    const tabs: TabId[] = ['flag-dev-server'];

    tabs.push('settings');
    return tabs as readonly TabId[];
  }

  // SDK mode: conditionally show tabs based on available plugins
  const tabs: TabId[] = [];

  if (hasFlagOverridePlugin) {
    tabs.push('flag-sdk');
  }

  if (hasEventInterceptionPlugin) {
    tabs.push('events');
  }

  tabs.push('settings');

  return tabs as readonly TabId[];
}

export function getDefaultActiveTab(
  mode: ToolbarMode,
  hasFlagOverridePlugin?: boolean,
  hasEventInterceptionPlugin?: boolean,
): TabId {
  if (mode === 'dev-server') {
    return 'flag-dev-server';
  }

  if (mode === 'sdk') {
    // In SDK mode, prefer flag-sdk if available, then events, then settings
    if (hasFlagOverridePlugin) {
      return 'flag-sdk';
    }
    if (hasEventInterceptionPlugin) {
      return 'events';
    }
    return 'settings';
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
