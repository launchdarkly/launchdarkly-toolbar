import { useMemo } from 'react';
import { useToolbarState } from '../../../../context';
import { useTabSearchContext } from '../../context/TabSearchProvider';
import { GenericHelpText } from '../../../GenericHelpText';
import { SettingsSection } from '../SettingsSection';
import { Switch } from '@launchpad-ui/components';
import { SettingsItem } from '../SettingsItem';
import * as styles from '../SettingsContent.module.css';
import * as settingsItemStyles from '../SettingsItem.module.css';

interface PrivacySettingsItemData {
  id: string;
  label: string;
  description?: string;
  display?: boolean;
  type: 'switch';
  switchValue?: boolean;
  onSwitchChange?: () => void;
}

interface PrivacySettingsSectionData {
  title: string;
  items: PrivacySettingsItemData[];
}

export function PrivacySettings() {
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['privacy'] || '', [searchTerms]);
  const {
    isOptedInToAnalytics,
    isOptedInToEnhancedAnalytics,
    isOptedInToSessionReplay,
    handleToggleAnalyticsOptOut,
    handleToggleEnhancedAnalyticsOptOut,
    handleToggleSessionReplayOptOut,
  } = useToolbarState();

  const getPrivacySettingsSections = (): PrivacySettingsSectionData[] => {
    return [
      {
        title: 'Analytics',
        items: [
          {
            id: 'analytics-opt-out',
            description: 'Opt in/out of anonymous analytics.',
            label: 'Analytics opt-out',
            type: 'switch',
            switchValue: isOptedInToAnalytics,
            onSwitchChange: () => handleToggleAnalyticsOptOut(!isOptedInToAnalytics),
          },
          {
            id: 'enhanced-analytics-opt-out',
            description: 'Opt in/out of enhanced analytics, sending account and member information to LaunchDarkly.',
            label: 'Enhanced analytics opt-out',
            type: 'switch',
            display: isOptedInToAnalytics,
            switchValue: isOptedInToEnhancedAnalytics,
            onSwitchChange: () => handleToggleEnhancedAnalyticsOptOut(!isOptedInToEnhancedAnalytics),
          },
          {
            id: 'session-replay-opt-out',
            description: 'Opt in/out of session replay, recording user interactions with the toolbar.',
            label: 'Session replay opt-out',
            type: 'switch',
            display: isOptedInToAnalytics,
            switchValue: isOptedInToSessionReplay,
            onSwitchChange: () => handleToggleSessionReplayOptOut(!isOptedInToSessionReplay),
          },
        ],
      },
    ];
  };

  const privacySettingsSections = getPrivacySettingsSections();

  // Check if any sections have filtered results
  const hasResults = privacySettingsSections.some((section) =>
    section.items.some(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    ),
  );

  if (!hasResults && searchTerm.trim()) {
    return <GenericHelpText title="No privacy settings found" subtitle="Try adjusting your search" />;
  }

  return (
    <div className={styles.container}>
      {privacySettingsSections.map((section) => {
        const filteredItems = section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        );

        if (filteredItems.length === 0) {
          return null;
        }

        return (
          <SettingsSection key={section.title} title={section.title}>
            {filteredItems.map((item) => {
              // Render control based on item type
              let control: React.ReactNode;

              if (item.display === false) {
                return null;
              }

              switch (item.type) {
                case 'switch':
                  control = (
                    <Switch
                      data-theme="dark"
                      className={settingsItemStyles.switch_}
                      isSelected={item.switchValue ?? false}
                      onChange={item.onSwitchChange}
                      aria-label={item.label}
                    />
                  );
                  break;
                default:
                  control = null;
              }

              return (
                <SettingsItem key={item.id} label={item.label} description={item.description}>
                  {control}
                </SettingsItem>
              );
            })}
          </SettingsSection>
        );
      })}
    </div>
  );
}
