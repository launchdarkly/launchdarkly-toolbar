import React from 'react';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { ProjectSelector } from './ProjectSelector';
import { PositionSelector } from './PositionSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { LogoutButton } from './LogoutButton';
import { useDevServerContext } from '../../../context/DevServerProvider';
import { useToolbarUIContext } from '../../../context/ToolbarUIProvider';
import { useAnalytics } from '../../../context/AnalyticsProvider';
import * as styles from './SettingsContent.module.css';
import { useToolbarState } from '../../../context/ToolbarStateProvider';
import { Switch } from '@launchpad-ui/components';
import * as settingsItemStyles from './SettingsItem.module.css';

export const GeneralSettings: React.FC = () => {
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

  const handleAutoCollapseToggle = () => {
    analytics.trackAutoCollapseToggle(!isAutoCollapseEnabled ? 'enable' : 'disable');
    handleToggleAutoCollapse();
  };

  const handleReloadToggle = () => {
    analytics.trackReloadOnFlagChangeToggle(!reloadOnFlagChangeIsEnabled);
    handleToggleReloadOnFlagChange();
  };

  return (
    <div className={styles.container}>
      {/* Dev Server Configuration (only for dev-server mode) */}
      {mode === 'dev-server' && (
        <SettingsSection title="Dev Server Configuration">
          <SettingsItem label="Project">
            <ProjectSelector />
          </SettingsItem>
          <SettingsItem label="Environment">
            <span className={styles.value}>{state.sourceEnvironmentKey || 'Unknown'}</span>
          </SettingsItem>
          <SettingsItem label="Connection status">
            <ConnectionStatus status={state.connectionStatus} />
          </SettingsItem>
        </SettingsSection>
      )}

      {/* Toolbar Settings */}
      <SettingsSection title="Toolbar Settings">
        {mode === 'sdk' && (
          <SettingsItem label="Project">
            <ProjectSelector />
          </SettingsItem>
        )}
        <SettingsItem label="Position">
          <PositionSelector currentPosition={position} />
        </SettingsItem>
        <SettingsItem label="Auto-collapse" description="Automatically collapses the toolbar when clicking outside.">
          <Switch
            data-theme="dark"
            className={settingsItemStyles.switch_}
            isSelected={isAutoCollapseEnabled}
            onChange={handleAutoCollapseToggle}
            aria-label="Auto-collapse toolbar"
          />
        </SettingsItem>
        <SettingsItem label="Reload on flag change">
          <Switch
            data-theme="dark"
            className={settingsItemStyles.switch_}
            isSelected={reloadOnFlagChangeIsEnabled}
            onChange={handleReloadToggle}
            aria-label="Reload on flag change"
          />
        </SettingsItem>
      </SettingsSection>

      {/* Account Section */}
      <SettingsSection title="Account">
        <SettingsItem label="Log out" description="Sign the Toolbar out of LaunchDarkly">
          <LogoutButton />
        </SettingsItem>
      </SettingsSection>
    </div>
  );
};
