// Subtab types for each main tab
export type FlagsSubtab = 'flags' | 'context';
export type MonitoringSubtab = 'overview' | 'events';
export type SettingsSubtab = 'general';
export type InteractiveSubtab = 'click-tracking';

export type SubTab = FlagsSubtab | MonitoringSubtab | SettingsSubtab | InteractiveSubtab;

// Tab configuration
export interface TabConfig {
  id: string;
  label: string;
}

// Map of main tabs to their available subtabs
export const TAB_SUBTABS_MAP = {
  flags: [{ id: 'flags', label: 'Flags' }, { id: 'context', label: 'Context' }] as TabConfig[],
  monitoring: [{ id: 'events', label: 'Events' }] as TabConfig[],
  settings: [{ id: 'general', label: 'General' }] as TabConfig[],
  interactive: [{ id: 'click-tracking', label: 'Click Tracking' }] as TabConfig[],
} as const;

// Get default subtab for a given main tab
export function getDefaultSubtab(mainTab: string): SubTab {
  const subtabs = TAB_SUBTABS_MAP[mainTab as keyof typeof TAB_SUBTABS_MAP];
  return (subtabs?.[0]?.id as SubTab) || 'flags';
}
