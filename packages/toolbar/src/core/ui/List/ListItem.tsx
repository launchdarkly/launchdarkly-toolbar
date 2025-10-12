import { motion } from 'motion/react';
import * as styles from './List.css';

export interface ListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem(props: ListItemProps) {
  const { children, onClick, className } = props;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`${styles.listItem} ${className || ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      whileHover={{ backgroundColor: onClick ? 'var(--lp-color-gray-850)' : undefined }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
