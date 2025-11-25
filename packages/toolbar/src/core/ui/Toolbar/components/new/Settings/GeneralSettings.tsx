import React from 'react';
import { ToolbarMode } from '../../../types/toolbar';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { ProjectSelector } from './ProjectSelector';
import { PositionSelector } from './PositionSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { Toggle } from '../Toggle';
import { LogoutButton } from './LogoutButton';
import { useDevServerContext } from '../../../context/DevServerProvider';
import { useToolbarUIContext } from '../../../context/ToolbarUIProvider';
import { useAnalytics } from '../../../context/AnalyticsProvider';
import * as styles from './SettingsContent.module.css';

interface GeneralSettingsProps {
  mode: ToolbarMode;
  reloadOnFlagChangeIsEnabled: boolean;
  onToggleReloadOnFlagChange: () => void;
  isAutoCollapseEnabled: boolean;
  onToggleAutoCollapse: () => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  mode,
  reloadOnFlagChangeIsEnabled,
  onToggleReloadOnFlagChange,
  isAutoCollapseEnabled,
  onToggleAutoCollapse,
}) => {
  const { state } = useDevServerContext();
  const { position } = useToolbarUIContext();
  const analytics = useAnalytics();

  const handleAutoCollapseToggle = () => {
    analytics.trackAutoCollapseToggle(!isAutoCollapseEnabled ? 'enable' : 'disable');
    onToggleAutoCollapse();
  };

  const handleReloadToggle = () => {
    analytics.trackReloadOnFlagChangeToggle(!reloadOnFlagChangeIsEnabled);
    onToggleReloadOnFlagChange();
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
        <SettingsItem
          label="Auto-collapse"
          description="Automatically collapses the toolbar when clicking outside."
        >
          <Toggle checked={isAutoCollapseEnabled} onChange={handleAutoCollapseToggle} />
        </SettingsItem>
        <SettingsItem label="Reload on flag change">
          <Toggle checked={reloadOnFlagChangeIsEnabled} onChange={handleReloadToggle} />
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

