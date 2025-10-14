import React from 'react';
import * as styles from './IconButton.css';

export interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function IconLinkButton(props: IconButtonProps) {
  const { icon, label, href, target = '_blank', className, size = 'large', onClick } = props;

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
    <a className={`${getSizeClass()} ${className || ''}`} target={target} href={href} aria-label={label} onClick={onClick}>
      {icon}
    </a>
  );
}
