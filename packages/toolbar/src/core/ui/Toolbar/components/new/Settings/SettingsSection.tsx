import React from 'react';
import * as styles from './SettingsSection.module.css';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
