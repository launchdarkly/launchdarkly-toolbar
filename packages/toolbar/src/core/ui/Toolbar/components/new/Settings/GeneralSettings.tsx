import React, { useMemo } from 'react';
import { Switch } from '@launchpad-ui/components';

import { useAnalytics, useDevServerContext, useToolbarState, useToolbarUIContext } from '../../../context';
import { useTabSearchContext } from '../context/TabSearchProvider';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { ProjectSelector } from './ProjectSelector';
import { PositionSelector } from './PositionSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { LogoutButton } from './LogoutButton';
import { GenericHelpText } from '../../GenericHelpText';
import * as styles from './SettingsContent.module.css';
import * as settingsItemStyles from './SettingsItem.module.css';
import { EnvironmentSelector } from './EnvironmentSelector';

interface SettingItemData {
  id: string;
  label: string;
  description?: string;
  type: 'project' | 'position' | 'switch' | 'status' | 'button' | 'text' | 'environment';
  switchValue?: boolean;
  onSwitchChange?: () => void;
}

interface SettingsSectionData {
  title: string;
  items: SettingItemData[];
}

export function GeneralSettings() {
  const { state } = useDevServerContext();
  const {
    isAutoCollapseEnabled,
    reloadOnFlagChangeIsEnabled,
    mode,
    handleToggleAutoCollapse,
    handleToggleReloadOnFlagChange,
  } = useToolbarState();
  const { position } = useToolbarUIContext();
  const analytics = useAnalytics();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['settings'] || '', [searchTerms]);

  const handleAutoCollapseToggle = () => {
    analytics.trackAutoCollapseToggle(!isAutoCollapseEnabled ? 'enable' : 'disable');
    handleToggleAutoCollapse();
  };

  const handleReloadToggle = () => {
    analytics.trackReloadOnFlagChangeToggle(!reloadOnFlagChangeIsEnabled);
    handleToggleReloadOnFlagChange();
  };

  // Build settings structure based on mode
  const getSettingsSections = (): SettingsSectionData[] => {
    if (mode === 'dev-server') {
      return [
        {
          title: 'Dev Server Configuration',
          items: [
            {
              id: 'project',
              label: 'Project',
              type: 'project',
            },
            {
              id: 'environment',
              label: 'Environment',
              type: 'text',
            },
            {
              id: 'connection',
              label: 'Connection status',
              type: 'status',
            },
          ],
        },
        {
          title: 'Toolbar Settings',
          items: [
            {
              id: 'position',
              label: 'Position',
              type: 'position',
            },
            {
              id: 'auto-collapse',
              label: 'Auto-collapse',
              description: 'Automatically collapses the toolbar when clicking outside.',
              type: 'switch',
              switchValue: isAutoCollapseEnabled,
              onSwitchChange: handleAutoCollapseToggle,
            },
            {
              id: 'reload-on-flag-change',
              label: 'Reload on flag change',
              type: 'switch',
              switchValue: reloadOnFlagChangeIsEnabled,
              onSwitchChange: handleReloadToggle,
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              id: 'logout',
              label: 'Log out',
              description: 'Sign the Toolbar out of LaunchDarkly',
              type: 'button',
            },
          ],
        },
      ];
    } else {
      // SDK Mode
      return [
        {
          title: 'Toolbar Settings',
          items: [
            {
              id: 'project',
              label: 'Project',
              type: 'project',
            },
            {
              id: 'environment',
              label: 'Environment',
              type: 'environment',
            },
            {
              id: 'position',
              label: 'Position',
              type: 'position',
            },
            {
              id: 'auto-collapse',
              label: 'Auto-collapse',
              description: 'Automatically collapses the toolbar when clicking outside.',
              type: 'switch',
              switchValue: isAutoCollapseEnabled,
              onSwitchChange: handleAutoCollapseToggle,
            },
            {
              id: 'reload-on-flag-change',
              label: 'Reload on flag change',
              type: 'switch',
              switchValue: reloadOnFlagChangeIsEnabled,
              onSwitchChange: handleReloadToggle,
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              id: 'logout',
              label: 'Log out',
              description: 'Sign the Toolbar out of LaunchDarkly',
              type: 'button',
            },
          ],
        },
      ];
    }
  };

  const settingsSections = getSettingsSections();

  // Check if any sections have filtered results
  const hasResults = settingsSections.some((section) =>
    section.items.some(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    ),
  );

  if (!hasResults && searchTerm.trim()) {
    return <GenericHelpText title="No settings found" subtitle="Try adjusting your search" />;
  }

  return (
    <div className={styles.container}>
      {settingsSections.map((section) => {
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

              switch (item.type) {
                case 'project':
                  control = <ProjectSelector />;
                  break;
                case 'position':
                  control = <PositionSelector currentPosition={position} />;
                  break;
                case 'status':
                  control = <ConnectionStatus status={state.connectionStatus} />;
                  break;
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
                case 'button':
                  control = <LogoutButton />;
                  break;
                case 'text':
                  control = <span className={styles.value}>{state.sourceEnvironmentKey || 'Unknown'}</span>;
                  break;
                case 'environment':
                  control = <EnvironmentSelector />;
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
