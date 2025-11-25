import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { ToolbarHeader } from './Header/ToolbarHeader';
import { IconBar } from './IconBar';
import { TabBar } from './TabBar';
import { ContentRenderer } from './ContentRenderer';
import { ActiveSubtabProvider } from './context/ActiveSubtabProvider';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import * as styles from './ExpandedToolbarContent.module.css';
import { NEW_TOOLBAR_TABS, TabId } from '../../types/toolbar';
import { useEffect } from 'react';

interface ExpandedToolbarContentProps {
  onClose?: () => void;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
  defaultActiveTab: TabId;
}

const ExpandedToolbarContentInner = forwardRef<HTMLDivElement, ExpandedToolbarContentProps>(
  ({ onClose, onHeaderMouseDown, defaultActiveTab }, ref) => {
    const { activeTab, setActiveTab } = useActiveTabContext();
    const { activeSubtab } = useActiveSubtabContext();

    useEffect(() => {
      if (activeTab && !NEW_TOOLBAR_TABS.includes(activeTab)) {
        setActiveTab(defaultActiveTab);
      }
    }, [activeTab, defaultActiveTab, setActiveTab]);

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
          <ContentRenderer activeTab={activeTab} activeSubtab={activeSubtab} />
        </div>
      </motion.div>
    );
  },
);

export const ExpandedToolbarContent = forwardRef<HTMLDivElement, ExpandedToolbarContentProps>((props, ref) => {
  return (
    <ActiveSubtabProvider>
      <ExpandedToolbarContentInner ref={ref} {...props} />
    </ActiveSubtabProvider>
  );
});
