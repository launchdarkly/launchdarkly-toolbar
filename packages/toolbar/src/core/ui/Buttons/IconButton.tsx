import React from 'react';
import * as styles from './IconButton.css';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: (event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  title?: string;
}

export function IconButton(props: IconButtonProps) {
  const { icon, label, onClick, disabled = false, className, size = 'large', title } = props;

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
    <button
      className={`${getSizeClass()} ${className || ''}`}
      onClick={(event) => onClick(event)}
      disabled={disabled}
      aria-label={label}
      title={title}
    >
      {icon}
    </button>
  );
}
