import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useRef, useEffect } from 'react';

import {
  SearchProvider,
  useSearchContext,
  AnalyticsProvider,
  useAnalytics,
  StarredFlagsProvider,
  ActiveTabProvider,
  useActiveTabContext,
  ToolbarStateProvider,
  useToolbarState,
} from './context';
import { CircleLogo } from './components';
import { ExpandedToolbarContentLegacy } from './components/legacy';
import { useToolbarAnimations, useToolbarVisibility, useToolbarDrag } from './hooks';
import { ToolbarUIProvider, useToolbarUIContext } from './context';
import { ToolbarMode, ToolbarPosition, getToolbarMode, getDefaultActiveTab } from './types/toolbar';

import * as styles from './LaunchDarklyToolbar.css';
import { DevServerProvider } from './context';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../../types';
import { AuthProvider } from './context/AuthProvider';
import { ApiProvider } from './context/ApiProvider';
import { IFrameProvider } from './context/IFrameProvider';
import { ProjectProvider } from './context/ProjectProvider';
import { FlagsProvider } from './context/FlagsProvider';
import { AuthenticationModal } from './components/AuthenticationModal';
import { InternalClientProvider } from './context/InternalClientProvider';
import { useNewToolbarDesign } from '../../../flags/toolbarFlags';
import { ExpandedToolbarContent } from './components/new/ExpandedToolbarContent';

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
  const { activeTab, setActiveTab } = useActiveTabContext();

  const defaultActiveTab = getDefaultActiveTab(mode, !!flagOverridePlugin, !!eventInterceptionPlugin);

  const toolbarState = useToolbarState();
  const circleButtonRef = useRef<HTMLButtonElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);

  const {
    slideDirection,
    searchIsExpanded,
    isExpanded,
    toolbarRef,
    handleTabChange,
    handleClose,
    handleSearch,
    handleToggleReloadOnFlagChange,
    handleCircleClick,
    reloadOnFlagChangeIsEnabled,
    handleToggleAutoCollapse,
    isAutoCollapseEnabled,
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
    (centerX: number, centerY: number) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // centerX and centerY now represent the center of the toolbar content
      // (calculated in useToolbarDrag before resetting styles)
      const isLeft = centerX < screenWidth / 2;
      const isTop = centerY < screenHeight / 2;

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

      // Update position immediately
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

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [activeTab, setActiveTab, defaultActiveTab]);

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

  const newToolbarDesign = useNewToolbarDesign();
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
      data-theme="dark"
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
        {isExpanded && !newToolbarDesign && (
          <ExpandedToolbarContentLegacy
            ref={expandedContentRef}
            activeTab={activeTab}
            slideDirection={slideDirection}
            searchTerm={searchTerm}
            searchIsExpanded={searchIsExpanded}
            onSearch={handleSearch}
            onClose={handleClose}
            onToggleAutoCollapse={handleToggleAutoCollapse}
            isAutoCollapseEnabled={isAutoCollapseEnabled}
            onTabChange={handleTabChange}
            setSearchIsExpanded={setSearchIsExpanded}
            flagOverridePlugin={flagOverridePlugin}
            eventInterceptionPlugin={eventInterceptionPlugin}
            mode={mode}
            baseUrl={baseUrl}
            defaultActiveTab={defaultActiveTab}
            onHeaderMouseDown={handleMouseDown}
            reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
            onToggleReloadOnFlagChange={handleToggleReloadOnFlagChange}
          />
        )}
        {isExpanded && newToolbarDesign && (
          <ExpandedToolbarContent onClose={handleClose} onHeaderMouseDown={handleMouseDown} />
        )}
      </AnimatePresence>
      <AuthenticationModal isOpen={false} onClose={() => {}} />
    </motion.div>
  );
}

export interface LaunchDarklyToolbarProps {
  baseUrl?: string; // Optional - will default to https://app.launchdarkly.com
  authUrl?: string; // Optional - will default to https://integrations.launchdarkly.com
  devServerUrl?: string; // Optional - will default to dev server mode if provided
  projectKey?: string; // Optional - will auto-detect the first available project if this and clientSideId are not provided
  flagOverridePlugin?: IFlagOverridePlugin; // Optional - for flag override functionality
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Optional - for event tracking
  pollIntervalInMs?: number; // Optional - will default to 5000ms
  position?: ToolbarPosition; // Optional - will default to 'bottom-right'
  domId: string;
  clientSideId?: string; // Optional - will auto-detect the first available project if this and projectKey are not provided
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const {
    baseUrl = 'https://app.launchdarkly.com',
    authUrl = 'https://integrations.launchdarkly.com',
    projectKey,
    position,
    devServerUrl,
    pollIntervalInMs = 5000,
    flagOverridePlugin,
    eventInterceptionPlugin,
    domId,
    clientSideId,
  } = props;

  const internalClientConfig = useMemo(
    () => ({
      clientSideId: import.meta.env.TOOLBAR_INTERNAL_CLIENT_ID,
      baseUrl: import.meta.env.TOOLBAR_INTERNAL_BASE_URL,
      streamUrl: import.meta.env.TOOLBAR_INTERNAL_STREAM_URL,
      eventsUrl: import.meta.env.TOOLBAR_INTERNAL_EVENTS_URL,
    }),
    [],
  );

  const isVisible = useToolbarVisibility();

  // Don't render anything if visibility check fails
  if (!isVisible) {
    return null;
  }

  const mode = getToolbarMode(devServerUrl);

  return (
    <ToolbarUIProvider initialPosition={position}>
      <InternalClientProvider
        clientSideId={internalClientConfig.clientSideId}
        baseUrl={internalClientConfig.baseUrl}
        streamUrl={internalClientConfig.streamUrl}
        eventsUrl={internalClientConfig.eventsUrl}
      >
        <AnalyticsProvider mode={mode}>
          <ToolbarStateProvider domId={domId}>
            <IFrameProvider authUrl={authUrl}>
              <AuthProvider>
                <SearchProvider>
                  <ApiProvider>
                    <ProjectProvider clientSideId={clientSideId} providedProjectKey={projectKey}>
                      <ActiveTabProvider>
                        <FlagsProvider>
                          <DevServerProvider
                            config={{
                              projectKey,
                              devServerUrl,
                              pollIntervalInMs,
                            }}
                          >
                            <StarredFlagsProvider>
                              <LdToolbar
                                mode={mode}
                                baseUrl={baseUrl}
                                flagOverridePlugin={flagOverridePlugin}
                                eventInterceptionPlugin={eventInterceptionPlugin}
                              />
                            </StarredFlagsProvider>
                          </DevServerProvider>
                        </FlagsProvider>
                      </ActiveTabProvider>
                    </ProjectProvider>
                  </ApiProvider>
                </SearchProvider>
              </AuthProvider>
            </IFrameProvider>
          </ToolbarStateProvider>
        </AnalyticsProvider>
      </InternalClientProvider>
    </ToolbarUIProvider>
  );
}
