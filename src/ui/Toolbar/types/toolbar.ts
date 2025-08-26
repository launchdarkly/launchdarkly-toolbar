// Main toolbar types
export type TabId = 'local-overrides' | 'flags' | 'settings';
export type ActiveTabId = TabId | undefined;

export const TAB_ORDER: readonly TabId[] = ['local-overrides', 'flags', 'settings'] as const;

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
