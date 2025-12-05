import React, { forwardRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

import { useActiveTabContext, useAuthContext, useToolbarState } from '../../context';
import { ToolbarHeader } from './Header/ToolbarHeader';
import { IconBar } from './IconBar/IconBar';
import { TabBar } from './TabBar';
import { ContentRenderer } from './ContentRenderer';
import { ActiveSubtabProvider, TabSearchProvider, FiltersProvider } from './context';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { LoginScreen } from '../LoginScreen/LoginScreen';
import { NEW_TOOLBAR_TABS, TabId } from '../../types/toolbar';
import { ANIMATION_CONFIG } from '../../constants';
import * as styles from './ExpandedToolbarContent.module.css';
import * as toolbarStyles from '../../LaunchDarklyToolbar.css';

interface ExpandedToolbarContentProps {
  onClose?: () => void;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
  defaultActiveTab: TabId;
}

const ExpandedToolbarContentInner = forwardRef<HTMLDivElement, ExpandedToolbarContentProps>(
  ({ onClose, onHeaderMouseDown, defaultActiveTab }, ref) => {
    const { authenticated, authenticating } = useAuthContext();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { handleClose } = useToolbarState();
    const { activeTab, setActiveTab } = useActiveTabContext();

    useEffect(() => {
      if (activeTab && !NEW_TOOLBAR_TABS.includes(activeTab)) {
        setActiveTab(defaultActiveTab);
      }
    }, [activeTab, defaultActiveTab, setActiveTab]);

    // Show login screen if not authenticated
    if (!authenticated || authenticating) {
      return (
        <>
          <AuthenticationModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <motion.div
            ref={ref}
            className={toolbarStyles.toolbarContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={ANIMATION_CONFIG.container}
            tabIndex={-1}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LoginScreen
              onClose={handleClose}
              onLogin={() => setIsAuthModalOpen(true)}
              onMouseDown={onHeaderMouseDown}
            />
          </motion.div>
        </>
      );
    }

    return (
      <>
        <AuthenticationModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
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
            <ContentRenderer />
          </div>
        </motion.div>
      </>
    );
  },
);

export const ExpandedToolbarContent = forwardRef<HTMLDivElement, ExpandedToolbarContentProps>((props, ref) => {
  return (
    <ActiveSubtabProvider>
      <TabSearchProvider>
        <FiltersProvider>
          <ExpandedToolbarContentInner ref={ref} {...props} />
        </FiltersProvider>
      </TabSearchProvider>
    </ActiveSubtabProvider>
  );
});
