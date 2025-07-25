import React from 'react';
import styles from './IconButton.module.css';

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

  return (
    <button
      className={`${styles.iconButton} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
