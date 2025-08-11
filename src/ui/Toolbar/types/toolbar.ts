// Main toolbar types
export type TabId = 'flags' | 'settings' | 'login';
export type ActiveTabId = TabId | undefined;

export const TAB_ORDER: readonly TabId[] = ['flags', 'settings', 'login'] as const;

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
