import React from 'react';
import * as styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.checked : ''}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.thumb} />
    </button>
  );
};

