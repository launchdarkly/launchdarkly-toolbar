import React from 'react';
import { motion } from 'motion/react';
import { ToolbarHeader } from './Header/ToolbarHeader';
import { IconBar } from './IconBar';
import { TabBar } from './TabBar';
import { FlagList } from './FeatureFlags/FlagList';
import * as styles from './ExpandedToolbarContent.module.css';
import { NewActiveTabId } from '../../types/toolbar';

interface ExpandedToolbarContentProps {
  onClose?: () => void;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
  defaultActiveTab: NewActiveTabId;
}

export const ExpandedToolbarContent = React.forwardRef<HTMLDivElement, ExpandedToolbarContentProps>(
  ({ onClose, onHeaderMouseDown, defaultActiveTab }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={styles.container}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <ToolbarHeader onClose={onClose} onHeaderMouseDown={onHeaderMouseDown} />
        <IconBar defaultActiveTab={defaultActiveTab} />
        <TabBar />
        <div className={styles.content}>
          <FlagList />
        </div>
      </motion.div>
    );
  },
);
