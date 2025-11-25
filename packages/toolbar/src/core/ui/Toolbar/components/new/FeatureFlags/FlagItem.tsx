import React from 'react';
import { Toggle } from '../Toggle';
import * as styles from './FlagItem.module.css';

interface FlagItemProps {
  name: string;
  value: string;
  enabled: boolean;
  onToggle: () => void;
}

export const FlagItem: React.FC<FlagItemProps> = ({ name, value, enabled, onToggle }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <Toggle checked={enabled} onChange={onToggle} />
    </div>
  );
};
