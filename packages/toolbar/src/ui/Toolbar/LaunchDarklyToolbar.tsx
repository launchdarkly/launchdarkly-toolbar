import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef } from 'react';

import { SearchProvider, useSearchContext, AnalyticsProvider, useAnalytics } from './context';
import { CircleLogo, ExpandedToolbarContent } from './components';
import { useToolbarAnimations, useToolbarVisibility, useToolbarDrag, useToolbarState } from './hooks';
import { ToolbarUIProvider, useToolbarUIContext } from './context';
import { ToolbarMode, ToolbarPosition, getToolbarMode, getDefaultActiveTab } from './types/toolbar';

import * as styles from './LaunchDarklyToolbar.css';
import { DevServerProvider } from './context';
import type { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../types/plugin';

export interface LdToolbarProps {
  mode: ToolbarMode;
  baseUrl: string;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}

export function LdToolbar(props: LdToolbarProps) {
  const { mode, flagOverridePlugin, eventInterceptionPlugin, baseUrl } = props;
  const { searchTerm } = useSearchContext();
  const { position, handlePositionChange } = useToolbarUIContext();
  const analytics = useAnalytics();

  const defaultActiveTab = getDefaultActiveTab(mode, !!flagOverridePlugin, !!eventInterceptionPlugin);

  const toolbarState = useToolbarState({ defaultActiveTab });
  const circleButtonRef = useRef<HTMLButtonElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);

  const {
    activeTab,
    slideDirection,
    searchIsExpanded,
    isExpanded,
    toolbarRef,
    handleTabChange,
    handleClose,
    handleSearch,
    handleTogglePin,
    handleCircleClick,
    isPinned,
    setSearchIsExpanded,
    setIsAnimating,
  } = toolbarState;

  // Focus management for expand/collapse
  const focusExpandedToolbar = useCallback(() => {
    if (expandedContentRef.current) {
      expandedContentRef.current.focus();
    }
  }, [expandedContentRef]);

  const focusCollapsedToolbar = useCallback(() => {
    if (circleButtonRef.current) {
      circleButtonRef.current.focus();
    }
  }, [circleButtonRef]);

  const handleDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const isLeft = clientX < screenWidth / 2;
      const isTop = clientY < screenHeight / 2;

      const newPosition: ToolbarPosition = isTop
        ? isLeft
          ? 'top-left'
          : 'top-right'
        : isLeft
          ? 'bottom-left'
          : 'bottom-right';

      // Track position change
      if (newPosition !== position) {
        analytics.trackPositionChange(position, newPosition, 'drag');
      }

      handlePositionChange(newPosition);
    },
    [handlePositionChange, position, analytics],
  );

  const { handleMouseDown, isDragging } = useToolbarDrag({
    enabled: true,
    onDragEnd: handleDragEnd,
    elementRef: toolbarRef,
  });

  const { containerAnimations, animationConfig, handleAnimationStart, handleAnimationComplete } = useToolbarAnimations({
    isExpanded,
    setIsAnimating,
    onExpandComplete: focusExpandedToolbar,
    onCollapseComplete: focusCollapsedToolbar,
  });

  // Prevent clicks from expanding toolbar if user was dragging
  const handleCircleClickWithDragCheck = useCallback(() => {
    if (!isDragging()) {
      handleCircleClick();
    }
  }, [handleCircleClick, isDragging]);

  // Map ToolbarPosition to css class for consistent mapping
  const positionClassMap: Record<ToolbarPosition, string> = {
    'bottom-left': styles.positionBottomLeft,
    'bottom-right': styles.positionBottomRight,
    'top-left': styles.positionTopLeft,
    'top-right': styles.positionTopRight,
  };

  return (
    <motion.div
      ref={toolbarRef}
      className={`${styles.toolbarContainer} ${positionClassMap[position]} ${
        isExpanded ? styles.toolbarExpanded : styles.toolbarCircle
      }`}
      initial={false}
      animate={containerAnimations}
      transition={animationConfig}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      onKeyDown={(e) => {
        if (isExpanded) {
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCircleClickWithDragCheck();
        }
      }}
      data-testid="launchdarkly-toolbar"
      role={isExpanded ? 'toolbar' : 'button'}
      aria-label={isExpanded ? 'LaunchDarkly toolbar' : 'Open LaunchDarkly toolbar'}
      tabIndex={isExpanded ? -1 : 0}
    >
      <AnimatePresence>
        {!isExpanded && (
          <CircleLogo ref={circleButtonRef} onClick={handleCircleClickWithDragCheck} onMouseDown={handleMouseDown} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isExpanded && (
          <ExpandedToolbarContent
            ref={expandedContentRef}
            activeTab={activeTab}
            slideDirection={slideDirection}
            searchTerm={searchTerm}
            searchIsExpanded={searchIsExpanded}
            onSearch={handleSearch}
            onClose={handleClose}
            onTogglePin={handleTogglePin}
            isPinned={isPinned}
            onTabChange={handleTabChange}
            setSearchIsExpanded={setSearchIsExpanded}
            flagOverridePlugin={flagOverridePlugin}
            eventInterceptionPlugin={eventInterceptionPlugin}
            mode={mode}
            baseUrl={baseUrl}
            defaultActiveTab={defaultActiveTab}
            onHeaderMouseDown={handleMouseDown}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export interface LaunchDarklyToolbarProps {
  baseUrl?: string; // Optional - will default to https://app.launchdarkly.com
  devServerUrl?: string; // Optional - will default to dev server mode if provided
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  flagOverridePlugin?: IFlagOverridePlugin; // Optional - for flag override functionality
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Optional - for event tracking
  pollIntervalInMs?: number; // Optional - will default to 5000ms
  position?: ToolbarPosition; // Optional - will default to 'bottom-right'
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const {
    baseUrl = 'https://app.launchdarkly.com',
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
    <ToolbarUIProvider initialPosition={position}>
      <DevServerProvider
        config={{
          projectKey,
          devServerUrl,
          pollIntervalInMs,
        }}
      >
        <AnalyticsProvider ldClient={flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient()}>
          <SearchProvider>
            <LdToolbar
              mode={mode}
              baseUrl={baseUrl}
              flagOverridePlugin={flagOverridePlugin}
              eventInterceptionPlugin={eventInterceptionPlugin}
            />
          </SearchProvider>
        </AnalyticsProvider>
      </DevServerProvider>
    </ToolbarUIProvider>
  );
}
