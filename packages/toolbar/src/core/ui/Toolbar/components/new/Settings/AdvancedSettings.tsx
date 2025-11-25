import React from 'react';
import { SettingsSection } from './SettingsSection';
import { Feedback } from './Feedback';
import * as styles from './SettingsContent.module.css';

export const AdvancedSettings: React.FC = () => {
  return (
    <div className={styles.container}>
      <SettingsSection title="Feedback">
        <Feedback />
      </SettingsSection>
      <SettingsSection title="Debug">
        <div className={styles.placeholder}>Advanced settings and debug options will go here</div>
      </SettingsSection>
    </div>
  );
};

