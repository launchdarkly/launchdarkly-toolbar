import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Header } from '../Header/Header';
import { Tabs } from '../../Tabs/Tabs';
import { TabButton } from '../../Tabs/TabButton';
import { TabContentRenderer } from './TabContentRenderer';
import { ANIMATION_CONFIG, EASING } from '../constants';
import { ActiveTabId } from '../types';
import { useToolbarContext } from '../context/LaunchDarklyToolbarProvider';

import styles from '../LaunchDarklyToolbar.module.css';
import { ErrorMessage } from './ErrorMessage';
import { GearIcon, ToggleOffIcon } from './icons';

interface ExpandedToolbarContentProps {
  isExpanded: boolean;
  activeTab: ActiveTabId;
  slideDirection: number;
  searchTerm: string;
  searchIsExpanded: boolean;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  onTabChange: (tabId: string) => void;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

function getHeaderLabel(currentProjectKey: string | null, sourceEnvironmentKey: string | null) {
  let label = '';
  if (currentProjectKey && sourceEnvironmentKey) {
    label = `${currentProjectKey} - ${sourceEnvironmentKey}`;
  }
  return label;
}

export function ExpandedToolbarContent(props: ExpandedToolbarContentProps) {
  const {
    isExpanded,
    activeTab,
    slideDirection,
    searchTerm,
    searchIsExpanded,
    onSearch,
    onClose,
    onTabChange,
    setSearchIsExpanded,
  } = props;

  const { state } = useToolbarContext();

  const headerLabel = getHeaderLabel(state.currentProjectKey, state.sourceEnvironmentKey);
  const { error } = state;

  return (
    <motion.div
      key="toolbar-content"
      className={styles.toolbarContent}
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
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.contentArea}
            initial={{
              opacity: 0,
              maxHeight: 0,
            }}
            animate={{
              opacity: 1,
              maxHeight: 600,
            }}
            exit={{
              opacity: 0,
              maxHeight: 0,
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
            />
            {error && <ErrorMessage error={error} />}
            {!error && (
              <motion.div
                className={styles.scrollableContent}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: EASING.elastic,
                  delay: 0.1,
                }}
              >
                <AnimatePresence mode="wait">
                  {activeTab && <TabContentRenderer activeTab={activeTab} slideDirection={slideDirection} />}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
        <Tabs activeTab={activeTab || undefined} onTabChange={onTabChange}>
          <TabButton id="flags" label="Flags" icon={ToggleOffIcon} />
          {/* <TabButton id="events" label="Events" icon="chart-line" /> */}
          <TabButton id="settings" label="Settings" icon={GearIcon} />
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
