import { AnimatePresence, motion } from 'motion/react';

import { SearchProvider, useSearchContext } from './context/SearchProvider';
import { CircleLogo, ExpandedToolbarContent } from './components';
import { useToolbarState, useToolbarAnimations, useToolbarVisibility } from './hooks';
import { useEffect } from 'react';

import * as styles from './LaunchDarklyToolbar.css';
import { LaunchDarklyToolbarProvider } from './context/LaunchDarklyToolbarProvider';
import { ToolbarPlugin } from '../../../demo/plugins/ToolbarPlugin';
import { Button } from '@launchpad-ui/components';

export interface LdToolbarProps {
  position?: 'left' | 'right';
  toolbarPlugin?: ToolbarPlugin;
}

export function LdToolbar(props: LdToolbarProps) {
  const { position = 'right', toolbarPlugin } = props;
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

  useEffect(() => {
    async function logFlags() {
      try {
        const flags = await toolbarPlugin?.listFlags();
        console.log(flags, 'I AM HERE IN TOOLBAR');
      } catch (err) {
        console.error('Failed to list flags', err);
      }
    }

    logFlags();
  }, [toolbarPlugin]);

  const toolbarAnimations = useToolbarAnimations({
    showFullToolbar,
    isHovered: toolbarState.isHovered,
    setIsAnimating,
  });
  const { containerAnimations, animationConfig, handleAnimationStart, handleAnimationComplete } = toolbarAnimations;

  return (
    <>
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
        data-testid="launchdarkly-toolbar"
        role="toolbar"
        aria-label="LaunchDarkly Developer Toolbar"
      >
        <AnimatePresence>{!showFullToolbar && <CircleLogo hasBeenExpanded={hasBeenExpanded} />}</AnimatePresence>
        <AnimatePresence>
          {showFullToolbar && (
            <>
              <Button
                onClick={async () => {
                  const flags = await toolbarPlugin?.listFlags();
                  const currentValue =
                    toolbarPlugin?.getOverride('test-flag-by-pranjal') ?? flags?.['test-flag-by-pranjal'];
                  toolbarPlugin?.setOverride('test-flag-by-pranjal', !currentValue);
                }}
              >
                Toggle Test Flag By Pranjal
              </Button>
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
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export interface LaunchDarklyToolbarProps extends LdToolbarProps {
  devServerUrl?: string; // Optional - will default to http://localhost:8765
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  pollIntervalInMs?: number; // Optional - will default to 5000ms
}

export function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps) {
  const {
    projectKey,
    position,
    devServerUrl = 'http://localhost:8765',
    pollIntervalInMs = 5000,
    toolbarPlugin,
  } = props;
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
        <LdToolbar position={position} toolbarPlugin={toolbarPlugin} />
      </SearchProvider>
    </LaunchDarklyToolbarProvider>
  );
}
