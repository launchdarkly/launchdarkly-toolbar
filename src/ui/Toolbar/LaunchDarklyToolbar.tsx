import { AnimatePresence, motion } from 'motion/react';
import { useState, useCallback } from 'react';

import { SearchProvider, useSearchContext } from './context/SearchProvider';
import { CircleLogo, ExpandedToolbarContent } from './components';
import { useToolbarState, useToolbarAnimations, useToolbarVisibility, useToolbarDrag } from './hooks';

import * as styles from './LaunchDarklyToolbar.css';
import { LaunchDarklyToolbarProvider } from './context/LaunchDarklyToolbarProvider';

export interface LdToolbarProps {
  position?: 'left' | 'right';
}

export function LdToolbar(props: LdToolbarProps) {
  const { position: initialPosition = 'right' } = props;
  const [position, setPosition] = useState<'left' | 'right'>(initialPosition);
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
    isHovered,
    isDragModifierPressed,
  } = toolbarState;

  const toolbarAnimations = useToolbarAnimations({
    showFullToolbar,
    isHovered,
    setIsAnimating,
  });
  const { containerAnimations, animationConfig, handleAnimationStart, handleAnimationComplete } = toolbarAnimations;

  const isDragEnabled = !showFullToolbar && isHovered && isDragModifierPressed;

  const handleDragEnd = useCallback((clientX: number) => {
    const screenWidth = window.innerWidth;
    const newPosition = clientX < screenWidth / 2 ? 'left' : 'right';
    setPosition(newPosition);
  }, []);

  const { handleMouseDown } = useToolbarDrag({
    enabled: isDragEnabled,
    onDragEnd: handleDragEnd,
    elementRef: toolbarRef,
  });

  return (
    <motion.div
      ref={toolbarRef}
      className={`${styles.toolbarContainer} ${position === 'left' ? styles.positionLeft : styles.positionRight} ${showFullToolbar ? styles.toolbarExpanded : styles.toolbarCircle}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      initial={false}
      animate={containerAnimations}
      transition={animationConfig}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      data-testid="launchdarkly-toolbar"
      role="toolbar"
      aria-label="LaunchDarkly Developer Toolbar"
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
  pollIntervalInMs?: number; // Optional - will default to 5000ms
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const { projectKey, position, devServerUrl = 'http://localhost:8765', pollIntervalInMs = 5000 } = props;
  const isVisible = useToolbarVisibility();

  // Don't render anything if visibility check fails
  if (!isVisible) {
    return null;
  }

  return (
    <LaunchDarklyToolbarProvider
      config={{
        projectKey,
        devServerUrl,
        pollIntervalInMs,
      }}
    >
      <SearchProvider>
        <LdToolbar position={position} />
      </SearchProvider>
    </LaunchDarklyToolbarProvider>
  );
}
