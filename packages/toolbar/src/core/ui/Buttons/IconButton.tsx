import React from 'react';
import * as styles from './IconButton.css';

export type IconButtonSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
export type IconButtonVariant = 'default' | 'ghost' | 'subtle' | 'danger' | 'primary';
export type IconButtonRadius = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  /** The icon element to render */
  icon: React.ReactNode;
  /** Accessible label for screen readers */
  label: string;
  /** Click handler */
  onClick: (event: React.MouseEvent) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Button size - xs (24px), small (30px), medium (36px), large (40px), xl (44px) */
  size?: IconButtonSize;
  /** Color variant - determines hover behavior */
  variant?: IconButtonVariant;
  /** Border radius - sm (4px), md (6px), lg (8px) */
  radius?: IconButtonRadius;
  /** Whether the button is in an active/selected state */
  isActive?: boolean;
  /** Whether the button is in selected/highlighted mode (blue theme) */
  isSelected?: boolean;
  /** Tooltip text shown on hover */
  title?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * Unified icon button component with size, variant, and state support.
 *
 * @example
 * // Basic usage
 * <IconButton icon={<SearchIcon />} label="Search" onClick={handleSearch} />
 *
 * @example
 * // With variants
 * <IconButton icon={<DeleteIcon />} label="Delete" onClick={handleDelete} variant="danger" />
 *
 * @example
 * // With size and state
 * <IconButton icon={<GearIcon />} label="Settings" onClick={handleSettings} size="xl" isActive />
 */
export function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  className,
  size = 'large',
  variant = 'default',
  radius = 'sm',
  isActive = false,
  isSelected = false,
  title,
  'data-testid': testId,
}: IconButtonProps) {
  // Build class list
  const classNames = [
    styles.iconButton,
    styles.sizes[size],
    styles.variants[variant],
    styles.radii[radius],
    isActive && styles.active,
    isSelected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      data-testid={testId}
    >
      {icon}
    </button>
  );
}
