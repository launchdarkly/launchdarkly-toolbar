import { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  FlagSdkOverrideProvider,
  LocalFlag,
  useDevServerContext,
  useFlagSdkOverrideContext,
  usePlugins,
  useToolbarState,
  useStarredFlags,
  useAnalytics,
} from '../../../context';
import { useTabSearchContext, useSubtabFilters } from '../context';
import { FlagItem } from './FlagItem';
import { NormalizedFlag } from './types';
import { EnhancedFlag } from '../../../../../types/devServer';
import { GenericHelpText } from '../../GenericHelpText';
import { VIRTUALIZATION } from '../../../constants';
import * as styles from './FlagList.module.css.ts';

// Dev Server Mode Component
function DevServerFlagList() {
  const { state, setOverride, clearOverride } = useDevServerContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);
  const { activeFilters } = useSubtabFilters('flags');
  const { isStarred } = useStarredFlags();
  const analytics = useAnalytics();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Get all flags
  const allFlags = useMemo(() => Object.values(state.flags) as EnhancedFlag[], [state.flags]);

  // Normalize flags from dev server
  const normalizedFlags: NormalizedFlag[] = useMemo(() => {
    return allFlags.map((flag: EnhancedFlag) => ({
      key: flag.key,
      name: flag.name,
      currentValue: flag.currentValue,
      isOverridden: flag.isOverridden,
      type: flag.type,
      availableVariations: flag.availableVariations,
    }));
  }, [allFlags]);

  // Filter flags based on search term and active filters
  const filteredFlagIndices = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const showAll = activeFilters.has('all');
    const showOverrides = activeFilters.has('overrides');
    const showStarred = activeFilters.has('starred');

    // Single pass through the array instead of .map().filter().map()
    const result: number[] = [];
    for (let index = 0; index < normalizedFlags.length; index++) {
      const flag = normalizedFlags[index];
      if (!flag) continue;

      // Apply search filter
      if (searchTerm) {
        const matchesSearch =
          flag.name.toLowerCase().includes(searchLower) || flag.key.toLowerCase().includes(searchLower);
        if (!matchesSearch) continue;
      }

      // Apply category filters
      if (showAll) {
        result.push(index);
        continue;
      }

      // Check if flag matches any active filter
      const matchesOverrides = showOverrides && flag.isOverridden;
      const matchesStarred = showStarred && isStarred(flag.key);

      if (matchesOverrides || matchesStarred) {
        result.push(index);
      }
    }
    return result;
  }, [normalizedFlags, searchTerm, activeFilters, isStarred]);

  const virtualizer = useVirtualizer({
    count: filteredFlagIndices.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  const handleHeightChange = useCallback(
    (index: number, height: number) => {
      if (height > VIRTUALIZATION.ITEM_HEIGHT) {
        virtualizer.resizeItem(index, height);
      } else {
        setTimeout(() => {
          virtualizer.resizeItem(index, height);
        }, 125);
      }
    },
    [virtualizer],
  );

  const handleOverride = useCallback(
    async (flagKey: string, value: any) => {
      await setOverride(flagKey, value);
      analytics.trackFlagOverride(flagKey, value, 'set');
    },
    [setOverride, analytics],
  );

  const handleClearOverride = useCallback(
    async (flagKey: string) => {
      await clearOverride(flagKey);
      analytics.trackFlagOverride(flagKey, null, 'remove');
    },
    [clearOverride, analytics],
  );

  // Calculate stats
  const totalFlags = normalizedFlags.length;
  const filteredCount = filteredFlagIndices.length;
  const isFiltered = searchTerm || !activeFilters.has('all');

  if (filteredFlagIndices.length === 0 && !searchTerm && activeFilters.has('all')) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlagIndices.length === 0 && (searchTerm || !activeFilters.has('all'))) {
    return (
      <div className={styles.container}>
        <div className={styles.statsHeader}>
          <span className={styles.statsText}>0 of {totalFlags} flags</span>
        </div>
        <GenericHelpText title="No matching flags" subtitle="Try adjusting your search or filters" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <span className={styles.statsText}>
          {isFiltered ? `${filteredCount} of ${totalFlags} flags` : `${totalFlags} flags`}
        </span>
      </div>
      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        tabIndex={0}
        role="region"
        aria-label="Feature flags list"
      >
        <div
          className={styles.virtualInner}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const flagIndex = filteredFlagIndices[virtualItem.index];
            if (flagIndex === undefined) return null;

            const normalizedFlag = normalizedFlags[flagIndex];

            if (!normalizedFlag) return null;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <FlagItem
                  flag={normalizedFlag}
                  onOverride={(value: any) => handleOverride(normalizedFlag.key, value)}
                  onClearOverride={() => handleClearOverride(normalizedFlag.key)}
                  handleHeightChange={handleHeightChange}
                  index={virtualItem.index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// SDK Mode Component
function SdkFlagList() {
  const { flags, setOverride, removeOverride } = useFlagSdkOverrideContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);
  const { activeFilters } = useSubtabFilters('flags');
  const { isStarred } = useStarredFlags();
  const analytics = useAnalytics();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Get all flags
  const allFlags = useMemo(() => Object.values(flags) as LocalFlag[], [flags]);

  // Normalize flags from SDK
  const normalizedFlags: NormalizedFlag[] = useMemo(() => {
    return allFlags.map((flag: LocalFlag) => ({
      key: flag.key,
      name: flag.name,
      currentValue: flag.currentValue,
      isOverridden: flag.isOverridden,
      type: flag.type,
      availableVariations: flag.availableVariations,
    }));
  }, [allFlags]);

  // Filter flags based on search term and active filters
  const filteredFlagIndices = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const showAll = activeFilters.has('all');
    const showOverrides = activeFilters.has('overrides');
    const showStarred = activeFilters.has('starred');

    // Single pass through the array instead of .map().filter().map()
    const result: number[] = [];
    for (let index = 0; index < normalizedFlags.length; index++) {
      const flag = normalizedFlags[index];
      if (!flag) continue;

      // Apply search filter
      if (searchTerm) {
        const matchesSearch =
          flag.name.toLowerCase().includes(searchLower) || flag.key.toLowerCase().includes(searchLower);
        if (!matchesSearch) continue;
      }

      // Apply category filters
      if (showAll) {
        result.push(index);
        continue;
      }

      // Check if flag matches any active filter
      const matchesOverrides = showOverrides && flag.isOverridden;
      const matchesStarred = showStarred && isStarred(flag.key);

      if (matchesOverrides || matchesStarred) {
        result.push(index);
      }
    }
    return result;
  }, [normalizedFlags, searchTerm, activeFilters, isStarred]);

  const virtualizer = useVirtualizer({
    count: filteredFlagIndices.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  const handleOverride = useCallback(
    (flagKey: string, value: any) => {
      setOverride(flagKey, value);
      analytics.trackFlagOverride(flagKey, value, 'set');
    },
    [setOverride, analytics],
  );

  const handleClearOverride = useCallback(
    (flagKey: string) => {
      removeOverride(flagKey);
      analytics.trackFlagOverride(flagKey, null, 'remove');
    },
    [removeOverride, analytics],
  );

  const handleHeightChange = useCallback(
    (index: number, height: number) => {
      if (height > VIRTUALIZATION.ITEM_HEIGHT) {
        virtualizer.resizeItem(index, height);
      } else {
        setTimeout(() => {
          virtualizer.resizeItem(index, height);
        }, 125);
      }
    },
    [virtualizer],
  );

  // Calculate stats
  const totalFlags = normalizedFlags.length;
  const filteredCount = filteredFlagIndices.length;
  const isFiltered = searchTerm || !activeFilters.has('all');

  if (filteredFlagIndices.length === 0 && !searchTerm && activeFilters.has('all')) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlagIndices.length === 0 && (searchTerm || !activeFilters.has('all'))) {
    return (
      <div className={styles.container}>
        <div className={styles.statsHeader}>
          <span className={styles.statsText}>0 of {totalFlags} flags</span>
        </div>
        <GenericHelpText title="No matching flags" subtitle="Try adjusting your search or filters" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <span className={styles.statsText}>
          {isFiltered ? `${filteredCount} of ${totalFlags} flags` : `${totalFlags} flags`}
        </span>
      </div>
      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        tabIndex={0}
        role="region"
        aria-label="Feature flags list"
      >
        <div
          className={styles.virtualInner}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const flagIndex = filteredFlagIndices[virtualItem.index];
            if (flagIndex === undefined) return null;

            const normalizedFlag = normalizedFlags[flagIndex];

            if (!normalizedFlag) return null;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <FlagItem
                  flag={normalizedFlag}
                  onOverride={(value: any) => handleOverride(normalizedFlag.key, value)}
                  onClearOverride={() => handleClearOverride(normalizedFlag.key)}
                  handleHeightChange={handleHeightChange}
                  index={virtualItem.index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main component that routes to correct mode
export const FlagList = () => {
  const { mode } = useToolbarState();
  const plugins = usePlugins();

  if (mode === 'dev-server') {
    return <DevServerFlagList />;
  }

  if (mode === 'sdk') {
    if (!plugins.flagOverridePlugin) {
      return (
        <GenericHelpText
          title="Flag override plugin is not available"
          subtitle="To use local flag overrides, ensure the flag override plugin is added to your LaunchDarkly client configuration."
        />
      );
    }

    return (
      <FlagSdkOverrideProvider flagOverridePlugin={plugins.flagOverridePlugin}>
        <SdkFlagList />
      </FlagSdkOverrideProvider>
    );
  }

  return <GenericHelpText title="Mode not detected" subtitle="The toolbar is not running in dev-server or SDK mode" />;
};
