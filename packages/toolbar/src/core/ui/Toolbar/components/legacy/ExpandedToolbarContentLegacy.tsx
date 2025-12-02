import React, { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusScope } from '@react-aria/focus';

import { useAuthContext, useDevServerContext } from '../../context';
import { Tabs } from '../../../Tabs/Tabs';
import { TabButton } from '../../../Tabs/TabButton';
import { TabContentRenderer } from './TabContentRenderer';
import { ANIMATION_CONFIG, EASING } from '../../constants';
import { ActiveTabId, ToolbarMode, getTabsForMode, TAB_ORDER } from '../../types';
import { LoginScreen } from '../LoginScreen/LoginScreen';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { GearIcon, SyncIcon, ToggleOffIcon } from '../icons';
import { ErrorMessage } from '../ErrorMessage';
import { Header } from './Header/Header';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../../../../types';
import * as styles from '../../LaunchDarklyToolbar.css';

interface ExpandedToolbarContentProps {
  activeTab: ActiveTabId;
  slideDirection: number;
  searchTerm: string;
  searchIsExpanded: boolean;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  onToggleAutoCollapse: () => void;
  isAutoCollapseEnabled: boolean;
  onTabChange: (tabId: string) => void;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  mode: ToolbarMode;
  baseUrl: string;
  defaultActiveTab: ActiveTabId;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
  reloadOnFlagChangeIsEnabled: boolean;
  onToggleReloadOnFlagChange: () => void;
}

export const ExpandedToolbarContentLegacy = React.forwardRef<HTMLDivElement, ExpandedToolbarContentProps>(
  (props, ref) => {
    const {
      activeTab,
      slideDirection,
      searchTerm,
      searchIsExpanded,
      onSearch,
      onClose,
      onToggleAutoCollapse,
      isAutoCollapseEnabled,
      onTabChange,
      setSearchIsExpanded,
      mode,
      flagOverridePlugin,
      eventInterceptionPlugin,
      baseUrl,
      defaultActiveTab,
      onHeaderMouseDown,
      reloadOnFlagChangeIsEnabled,
      onToggleReloadOnFlagChange,
    } = props;

    const { authenticated, authenticating } = useAuthContext();
    const { state } = useDevServerContext();
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

    const { error } = state;

    const availableTabs = getTabsForMode(mode, !!flagOverridePlugin, !!eventInterceptionPlugin);

    const shouldShowError =
      error && mode === 'dev-server' && state.connectionStatus === 'error' && activeTab !== 'settings';

    // Show login screen if not authenticated
    if (!authenticated || authenticating) {
      return (
        <>
          <AuthenticationModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <motion.div
            ref={ref}
            className={styles.toolbarContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={ANIMATION_CONFIG.container}
            tabIndex={-1}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LoginScreen onClose={onClose} onLogin={() => setIsAuthModalOpen(true)} onMouseDown={onHeaderMouseDown} />
          </motion.div>
        </>
      );
    }

    // Show normal toolbar content if authenticated
    return (
      <>
        <AuthenticationModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <FocusScope restoreFocus>
          <motion.div
            ref={ref}
            key="toolbar-content"
            className={styles.toolbarContent}
            tabIndex={0}
            role="group"
            aria-label="LaunchDarkly developer toolbar content"
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            transition={ANIMATION_CONFIG.toolbarContent}
          >
            <motion.div
              className={styles.tabsContainer}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={ANIMATION_CONFIG.tabsContainer}
            >
              <Tabs defaultActiveTab={defaultActiveTab} activeTab={activeTab} onTabChange={onTabChange}>
                {TAB_ORDER.filter((tabId) => availableTabs.includes(tabId)).map((tabId) => {
                  switch (tabId) {
                    case 'flag-dev-server':
                      return <TabButton key={tabId} id={tabId} label="Flags" icon={ToggleOffIcon} />;
                    case 'flag-sdk':
                      return <TabButton key={tabId} id={tabId} label="Flags" icon={ToggleOffIcon} />;
                    case 'events':
                      return <TabButton key={tabId} id={tabId} label="Events" icon={SyncIcon} />;
                    case 'settings':
                      return <TabButton key={tabId} id={tabId} label="Settings" icon={GearIcon} />;
                    default:
                      return null;
                  }
                })}
              </Tabs>
            </motion.div>

            {/* Expandable content area */}
            <motion.div
              className={styles.contentArea}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={ANIMATION_CONFIG.contentArea}
            >
              <Header
                onSearch={onSearch}
                searchTerm={searchTerm}
                onClose={onClose}
                searchIsExpanded={searchIsExpanded}
                setSearchIsExpanded={setSearchIsExpanded}
                mode={mode}
                onMouseDown={onHeaderMouseDown}
              />
              {shouldShowError && <ErrorMessage error={error} />}
              {!shouldShowError && (
                <motion.div
                  className={styles.scrollableContent}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASING.smooth, delay: 0.05 }}
                >
                  <AnimatePresence mode="wait">
                    {activeTab && (
                      <TabContentRenderer
                        activeTab={activeTab}
                        baseUrl={baseUrl}
                        slideDirection={slideDirection}
                        mode={mode}
                        flagOverridePlugin={flagOverridePlugin}
                        eventInterceptionPlugin={eventInterceptionPlugin}
                        reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
                        onToggleReloadOnFlagChange={onToggleReloadOnFlagChange}
                        isAutoCollapseEnabled={isAutoCollapseEnabled}
                        onToggleAutoCollapse={onToggleAutoCollapse}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </FocusScope>
      </>
    );
  },
);
