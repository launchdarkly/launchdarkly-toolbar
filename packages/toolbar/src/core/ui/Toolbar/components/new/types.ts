// Subtab types for each main tab
export type FlagsSubtab = 'flags' | 'contexts';
export type MonitoringSubtab = 'events';
export type SettingsSubtab = 'general' | 'privacy';
export type InteractiveSubtab = 'workflows';

export type SubTab = FlagsSubtab | MonitoringSubtab | SettingsSubtab | InteractiveSubtab;

// Tab configuration
export interface TabConfig {
  id: string;
  label: string;
}

// Map of main tabs to their available subtabs
export const TAB_SUBTABS_MAP = {
  flags: [
    { id: 'flags', label: 'Flags' },
    { id: 'contexts', label: 'Contexts' },
  ] as TabConfig[],
  monitoring: [{ id: 'events', label: 'Events' }] as TabConfig[],
  settings: [
    { id: 'general', label: 'General' },
    { id: 'privacy', label: 'Privacy' },
  ] as TabConfig[],
  interactive: [{ id: 'workflows', label: 'Workflows' }] as TabConfig[],
} as const;

// Get default subtab for a given main tab
export function getDefaultSubtab(mainTab: string): SubTab {
  const subtabs = TAB_SUBTABS_MAP[mainTab as keyof typeof TAB_SUBTABS_MAP];
  return (subtabs?.[0]?.id as SubTab) || 'flags';
}
