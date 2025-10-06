import React, { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Header } from '../Header/Header';
import { Tabs } from '../../Tabs/Tabs';
import { TabButton } from '../../Tabs/TabButton';
import { TabContentRenderer } from './TabContentRenderer';
import { ANIMATION_CONFIG, EASING } from '../constants';
import { ActiveTabId, ToolbarMode, getTabsForMode, TAB_ORDER } from '../types';
import { useDevServerContext } from '../context/DevServerProvider';

import * as styles from '../LaunchDarklyToolbar.css';
import { GearIcon, SyncIcon, ToggleOffIcon } from './icons';
import { ErrorMessage } from './ErrorMessage';
import { FocusScope } from '@react-aria/focus';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '@launchdarkly/toolbar-types';

interface ExpandedToolbarContentProps {
  activeTab: ActiveTabId;
  slideDirection: number;
  searchTerm: string;
  searchIsExpanded: boolean;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  onTogglePin: () => void;
  isPinned: boolean;
  onTabChange: (tabId: string) => void;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  mode: ToolbarMode;
  baseUrl: string;
  defaultActiveTab: ActiveTabId;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
  onHeaderMouseDown?: (event: React.MouseEvent) => void;
}

function getHeaderLabel(currentProjectKey: string | null, sourceEnvironmentKey: string | null) {
  let label = '';
  if (currentProjectKey && sourceEnvironmentKey) {
    label = `${currentProjectKey} - ${sourceEnvironmentKey}`;
  }
  return label;
}

export const ExpandedToolbarContent = React.forwardRef<HTMLDivElement, ExpandedToolbarContentProps>((props, ref) => {
  const {
    activeTab,
    slideDirection,
    searchTerm,
    searchIsExpanded,
    onSearch,
    onClose,
    onTogglePin,
    isPinned,
    onTabChange,
    setSearchIsExpanded,
    mode,
    flagOverridePlugin,
    eventInterceptionPlugin,
    baseUrl,
    defaultActiveTab,
    onHeaderMouseDown,
  } = props;

  const { state } = useDevServerContext();

  const headerLabel = getHeaderLabel(state.currentProjectKey, state.sourceEnvironmentKey);
  const { error } = state;

  const availableTabs = getTabsForMode(mode, !!flagOverridePlugin, !!eventInterceptionPlugin);

  const shouldShowError = error && mode === 'dev-server' && state.connectionStatus === 'error';

  return (
    <FocusScope>
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
            label={headerLabel}
            mode={mode}
            onMouseDown={onHeaderMouseDown}
          />
          {shouldShowError && <ErrorMessage error={error} />}
          {!shouldShowError && (
            <motion.div
              className={styles.scrollableContent}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                ease: EASING.smooth,
                delay: 0.05,
              }}
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
                    isPinned={isPinned}
                    onTogglePin={onTogglePin}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

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
      </motion.div>
    </FocusScope>
  );
});
