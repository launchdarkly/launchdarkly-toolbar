import { motion } from 'motion/react';
import * as styles from './OverrideIndicator.css';

interface OverrideIndicatorProps {
  onClear?: () => void;
}

export function OverrideIndicator(props: OverrideIndicatorProps) {
  const { onClear } = props;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClear && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      onClear();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  return (
    <motion.span
      className={`${styles.overrideDot} ${onClear ? styles.interactive : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClear ? 0 : undefined}
      title={onClear ? 'Remove override' : 'Flag is overridden'}
      whileHover={onClear ? { scale: 1.2, backgroundColor: 'var(--lp-color-red-500)' } : {}}
      transition={{ duration: 0.2 }}
      data-testid="override-indicator"
      role={onClear ? 'button' : 'status'}
      aria-label={onClear ? 'Remove flag override' : 'Flag override active'}
    />
  );
}
