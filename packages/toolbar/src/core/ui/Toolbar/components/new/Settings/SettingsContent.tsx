import React from 'react';
import { ToolbarMode } from '../../../types/toolbar';
import { GeneralSettings } from './GeneralSettings';
import { AdvancedSettings } from './AdvancedSettings';
import { SubTab } from '../types';

interface SettingsContentProps {
  activeSubtab: SubTab | undefined;
  mode: ToolbarMode;
  reloadOnFlagChangeIsEnabled: boolean;
  onToggleReloadOnFlagChange: () => void;
  isAutoCollapseEnabled: boolean;
  onToggleAutoCollapse: () => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  activeSubtab,
  mode,
  reloadOnFlagChangeIsEnabled,
  onToggleReloadOnFlagChange,
  isAutoCollapseEnabled,
  onToggleAutoCollapse,
}) => {
  if (activeSubtab === 'general') {
    return (
      <GeneralSettings
        mode={mode}
        reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
        onToggleReloadOnFlagChange={onToggleReloadOnFlagChange}
        isAutoCollapseEnabled={isAutoCollapseEnabled}
        onToggleAutoCollapse={onToggleAutoCollapse}
      />
    );
  }

  if (activeSubtab === 'advanced') {
    return <AdvancedSettings />;
  }

  return <GeneralSettings mode={mode} reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled} onToggleReloadOnFlagChange={onToggleReloadOnFlagChange} isAutoCollapseEnabled={isAutoCollapseEnabled} onToggleAutoCollapse={onToggleAutoCollapse} />;
};

