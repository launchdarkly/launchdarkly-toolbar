import { AnimatePresence, motion } from 'motion/react';
import { useCallback } from 'react';

import { SearchProvider, useSearchContext } from './context';
import { CircleLogo, ExpandedToolbarContent } from './components';
import { useToolbarAnimations, useToolbarVisibility, useToolbarDrag, useToolbarState } from './hooks';
import { useDevServerContext } from './context';
import { ToolbarMode, ToolbarPosition, getToolbarMode } from './types/toolbar';

import * as styles from './LaunchDarklyToolbar.css';
import { DevServerProvider } from './context';
import type { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../types/plugin';

export interface LdToolbarProps {
  mode: ToolbarMode;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}

export function LdToolbar(props: LdToolbarProps) {
  const { mode, flagOverridePlugin, eventInterceptionPlugin } = props;
  const { searchTerm } = useSearchContext();
  const { state, handlePositionChange } = useDevServerContext();
  const toolbarState = useToolbarState();
  const position = state.position;

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

  const handleDragEnd = useCallback(
    (clientX: number) => {
      const screenWidth = window.innerWidth;
      const newPosition: ToolbarPosition = clientX < screenWidth / 2 ? 'left' : 'right';
      handlePositionChange(newPosition);
    },
    [handlePositionChange],
  );

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
            flagOverridePlugin={flagOverridePlugin}
            mode={mode}
            flagOverridePlugin={flagOverridePlugin}
            eventInterceptionPlugin={eventInterceptionPlugin}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export interface LaunchDarklyToolbarProps {
  devServerUrl?: string; // Optional - will default to http://localhost:8765
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  flagOverridePlugin?: IFlagOverridePlugin; // Optional - for flag override functionality
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Optional - for event tracking
  pollIntervalInMs?: number; // Optional - will default to 5000ms
  position?: ToolbarPosition; // Optional - will default to 'right'
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const {
    projectKey,
    position,
    devServerUrl,
    pollIntervalInMs = 5000,
    flagOverridePlugin,
    eventInterceptionPlugin,
  } = props;
  const isVisible = useToolbarVisibility();

  // Don't render anything if visibility check fails
  if (!isVisible) {
    return null;
  }

  const mode = getToolbarMode(devServerUrl);

  return (
    <DevServerProvider
      config={{
        projectKey,
        devServerUrl,
        pollIntervalInMs,
      }}
      initialPosition={position}
    >
      <SearchProvider>
        <LdToolbar
          mode={mode}
          flagOverridePlugin={flagOverridePlugin}
          eventInterceptionPlugin={eventInterceptionPlugin}
        />
      </SearchProvider>
    </DevServerProvider>
  );
}
