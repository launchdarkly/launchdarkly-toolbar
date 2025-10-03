import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './OverrideIndicator.css';

interface OverrideIndicatorProps {
  onClear?: () => void;
}

export function OverrideIndicator(props: OverrideIndicatorProps) {
  const { onClear } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`${styles.overrideIndicator} ${onClear ? styles.interactive : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClear}
      title={onClear ? 'Click to remove override' : 'Override active'}
      whileHover={onClear ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
      data-testid="override-indicator"
      role={onClear ? 'button' : 'status'}
      aria-label={onClear ? 'Remove flag override' : 'Flag override active'}
    >
      <motion.span
        className={styles.overrideDot}
        animate={
          isHovered && onClear
            ? { backgroundColor: 'var(--lp-color-red-500)' }
            : { backgroundColor: 'var(--lp-color-brand-cyan-base)' }
        }
        transition={{ duration: 0.2 }}
      />
      <div className={styles.overrideTextContainer}>
        <AnimatePresence mode="wait">
          <motion.span
            key={isHovered && onClear ? 'remove' : 'override'}
            className={styles.overrideText}
            initial={{ opacity: 0, y: -2 }}
            animate={{
              opacity: 1,
              y: 0,
              color: isHovered && onClear ? 'var(--lp-color-red-500)' : 'var(--lp-color-brand-cyan-base)',
            }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.15 }}
          >
            {isHovered && onClear ? 'Remove' : 'Override'}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.span>
  );
}
