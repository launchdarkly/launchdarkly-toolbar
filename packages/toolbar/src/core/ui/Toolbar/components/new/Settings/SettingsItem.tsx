import React from 'react';
import * as styles from './SettingsItem.module.css';

interface SettingsItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ label, description, children }) => {
  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.label}>{label}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <div className={styles.control}>{children}</div>
    </div>
  );
};
