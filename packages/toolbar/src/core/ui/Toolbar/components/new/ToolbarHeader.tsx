import React from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import * as styles from './ToolbarHeader.module.css';
import { LaunchDarklyIcon } from '../icons/LaunchDarklyIcon';

interface ToolbarHeaderProps {
  onClose?: () => void;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
}

export const ToolbarHeader: React.FC<ToolbarHeaderProps> = ({ onClose, onHeaderMouseDown }) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection} onMouseDown={onHeaderMouseDown}>
        <LaunchDarklyIcon className={styles.logo} />
        <span className={styles.title}>LaunchDarkly</span>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} onClick={onClose} aria-label="Collapse toolbar">
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
};
