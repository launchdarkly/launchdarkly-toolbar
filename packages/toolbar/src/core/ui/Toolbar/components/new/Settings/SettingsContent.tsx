import React from 'react';
import { GeneralSettings } from './GeneralSettings';
import { AdvancedSettings } from './AdvancedSettings';
import { SubTab } from '../types';

interface SettingsContentProps {
  activeSubtab: SubTab | undefined;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ activeSubtab }) => {
  if (activeSubtab === 'general') {
    return <GeneralSettings />;
  }

  if (activeSubtab === 'advanced') {
    return <AdvancedSettings />;
  }

  return <GeneralSettings />;
};
