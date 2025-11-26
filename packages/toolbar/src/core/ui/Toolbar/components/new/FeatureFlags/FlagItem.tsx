import React from 'react';
import * as styles from './FlagItem.module.css';
import { Switch } from '@launchpad-ui/components';

interface FlagItemProps {
  name: string;
  value: string;
  enabled: boolean;
  isOverridden?: boolean;
  onToggle: () => void;
}

export const FlagItem: React.FC<FlagItemProps> = ({ name, value, enabled, isOverridden = false, onToggle }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{name}</div>
          {isOverridden && <div className={styles.overrideBadge}>Override</div>}
        </div>
        <div className={styles.value}>{value}</div>
      </div>
      <Switch isSelected={enabled} onChange={onToggle} data-theme="dark" />
    </div>
  );
};
