import React from 'react';
import * as styles from './ToolbarHeader.module.css';
import { LaunchDarklyIcon } from '../../icons/LaunchDarklyIcon';
import { useToolbarUIContext } from '../../../context/ToolbarUIProvider';
import { ChevronUpIcon, ChevronDownIcon } from '../../icons';

interface ToolbarHeaderProps {
  onClose?: () => void;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
}

export function ToolbarHeader({ onClose, onHeaderMouseDown }: ToolbarHeaderProps) {
  const { position } = useToolbarUIContext();

  return (
    <div className={styles.header}>
      <div className={styles.leftSection} onMouseDown={onHeaderMouseDown}>
        <LaunchDarklyIcon className={styles.logo} />
        <span className={styles.title}>LaunchDarkly</span>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} onClick={onClose} aria-label="Collapse toolbar">
          {position.startsWith('top-') ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
    </div>
  );
}
