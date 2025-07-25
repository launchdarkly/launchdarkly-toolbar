import { AnimatePresence, motion } from 'motion/react';

import { SearchProvider, useSearchContext } from './context/SearchContext';
import { CircleLogo, ExpandedToolbarContent } from './components';
import { useToolbarState, useToolbarAnimations } from './hooks';

import styles from './LaunchDarklyToolbar.module.css';
import { LaunchDarklyToolbarProvider } from './context/LaunchDarklyToolbarProvider';

export interface LdToolbarProps {
  position?: 'left' | 'right';
}

export function LdToolbar(props: LdToolbarProps) {
  const { position = 'right' } = props;
  const { searchTerm } = useSearchContext();

  const toolbarState = useToolbarState();

  const {
    isExpanded,
    activeTab,
    slideDirection,
    searchIsExpanded,
    showFullToolbar,
    hasBeenExpanded,
    toolbarRef,
    handleTabChange,
    handleMouseEnter,
    handleMouseLeave,
    handleClose,
    handleSearch,
    setSearchIsExpanded,
    setIsAnimating,
  } = toolbarState;

  const toolbarAnimations = useToolbarAnimations({
    showFullToolbar,
    isHovered: toolbarState.isHovered,
    setIsAnimating,
  });
  const { containerAnimations, animationConfig, handleAnimationStart, handleAnimationComplete } = toolbarAnimations;

  return (
    <motion.div
      ref={toolbarRef}
      className={`${styles.toolbarContainer} ${position === 'left' ? styles.positionLeft : styles.positionRight} ${showFullToolbar ? styles.toolbarExpanded : styles.toolbarCircle}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={false}
      animate={containerAnimations}
      transition={animationConfig}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
    >
      <AnimatePresence>{!showFullToolbar && <CircleLogo hasBeenExpanded={hasBeenExpanded} />}</AnimatePresence>

      <AnimatePresence>
        {showFullToolbar && (
          <ExpandedToolbarContent
            isExpanded={isExpanded}
            activeTab={activeTab}
            slideDirection={slideDirection}
            searchTerm={searchTerm}
            searchIsExpanded={searchIsExpanded}
            onSearch={handleSearch}
            onClose={handleClose}
            onTabChange={handleTabChange}
            setSearchIsExpanded={setSearchIsExpanded}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export interface LaunchDarklyToolbarProps extends LdToolbarProps {
  devServerUrl?: string; // Optional - will default to http://localhost:8765
  projectKey?: string; // Optional - will auto-detect first available project if not provided
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const { projectKey, position, devServerUrl = 'http://localhost:8765' } = props;

  return (
    <LaunchDarklyToolbarProvider
      config={{
        projectKey,
        devServerUrl,
        pollIntervalInMs: 5000,
      }}
    >
      <SearchProvider>
        <LdToolbar position={position} />
      </SearchProvider>
    </LaunchDarklyToolbarProvider>
  );
}
