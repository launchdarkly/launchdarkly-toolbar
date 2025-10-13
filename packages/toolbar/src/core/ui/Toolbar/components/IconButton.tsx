import React from 'react';
import * as styles from './IconButton.css';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function IconButton(props: IconButtonProps) {
  const { icon, label, onClick, disabled = false, className, size = 'large' } = props;

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return styles.large;
    }
  };

  return (
    <button className={`${getSizeClass()} ${className || ''}`} onClick={onClick} disabled={disabled} aria-label={label}>
      {icon}
    </button>
  );
}
