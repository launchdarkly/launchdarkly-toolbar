import { useState, useMemo, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext, useAnalytics } from '../context';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../context';
import { GenericHelpText } from '../components/GenericHelpText';
import { LocalBooleanFlagControl, LocalStringNumberFlagControl } from '../components/LocalFlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { StarButton } from '../components/StarButton';
import { FlagKeyWithCopy } from '../components/FlagKeyWithCopy';
import { useStarredFlags } from '../context/StarredFlagsProvider';
import {
  type FlagFilterMode,
  FlagFilterOptionsContext,
  FILTER_MODES,
} from '../components/FilterOptions/useFlagFilterOptions';
import { FilterOptions } from '../components/FilterOptions/FilterOptions';
import { VIRTUALIZATION } from '../constants';
import { EASING } from '../constants/animations';
import type { LocalFlag } from '../context';

import * as sharedStyles from './FlagDevServerTabContent.css';
import { IFlagOverridePlugin } from '../../../../types';
import { LocalObjectFlagControlListItem } from '../components/LocalObjectFlagControlListItem';

interface FlagSdkOverrideTabContentInnerProps {
  flagOverridePlugin: IFlagOverridePlugin;
  reloadOnFlagChangeIsEnabled: boolean;
}

function FlagSdkOverrideTabContentInner(props: FlagSdkOverrideTabContentInnerProps) {
  const { flagOverridePlugin, reloadOnFlagChangeIsEnabled } = props;
  const { searchTerm } = useSearchContext();
  const analytics = useAnalytics();
  const { flags, isLoading } = useFlagSdkOverrideContext();
  const { isStarred, toggleStarred, clearAllStarred, starredCount } = useStarredFlags();
  const [activeFilters, setActiveFilters] = useState<Set<FlagFilterMode>>(new Set([FILTER_MODES.ALL]));

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  const handleFilterToggle = useCallback(
    (filter: FlagFilterMode) => {
      setActiveFilters((prev) => {
        // Clicking "All" resets to default state
        if (filter === FILTER_MODES.ALL) {
          analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
          return new Set([FILTER_MODES.ALL]);
        }

        const next = new Set(prev);
        next.delete(FILTER_MODES.ALL); // Remove "All" when selecting specific filters

        // Toggle the selected filter
        const wasActive = next.has(filter);
        if (wasActive) {
          next.delete(filter);
          analytics.trackFilterChange(filter, 'deselected');
        } else {
          next.add(filter);
          analytics.trackFilterChange(filter, 'selected');
        }

        // Default to "All" if no filters remain
        if (next.size === 0) {
          analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
          return new Set([FILTER_MODES.ALL]);
        }

        return next;
      });
    },
    [analytics],
  );

  const handleClearOverride = useCallback(
    (flagKey: string) => {
      if (flagOverridePlugin) {
        flagOverridePlugin.removeOverride(flagKey);
        analytics.trackFlagOverride(flagKey, null, 'remove');

        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      }
    },
    [flagOverridePlugin, analytics, reloadOnFlagChangeIsEnabled],
  );

  // Count total overridden flags (not just filtered ones)
  const totalOverriddenFlags = useMemo(() => {
    return Object.values(flags).filter((flag) => flag.isOverridden).length;
  }, [flags]);

  // Prepare data for virtualizer (must be done before useVirtualizer hook)
  const flagEntries = Object.entries(flags);
  const filteredFlags = useMemo(() => {
    return flagEntries.filter(([flagKey, flag]) => {
      // Apply search filter
      const matchesSearch =
        flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flagKey.toLowerCase().includes(searchTerm.trim().toLowerCase());

      // Apply active filters (OR logic)
      let matchesFilter = true;
      if (activeFilters.has(FILTER_MODES.ALL)) {
        matchesFilter = true;
      } else {
        matchesFilter =
          (activeFilters.has(FILTER_MODES.OVERRIDES) && flag.isOverridden) ||
          (activeFilters.has(FILTER_MODES.STARRED) && isStarred(flagKey));
      }

      return matchesSearch && matchesFilter;
    });
  }, [flagEntries, searchTerm, activeFilters, isStarred]);

  const virtualizer = useVirtualizer({
    count: filteredFlags.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  if (!flagOverridePlugin) {
    return (
      <GenericHelpText
        title="Flag override plugin is not available"
        subtitle="To use local flag overrides, ensure the flag override plugin is added to your LaunchDarkly client configuration."
      />
    );
  }

  const ldClient = flagOverridePlugin.getClient();

  // Override operations
  const handleSetOverride = (flagKey: string, value: any) => {
    flagOverridePlugin.setOverride(flagKey, value);
    analytics.trackFlagOverride(flagKey, value, 'set');

    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const handleClearAllOverrides = () => {
    const currentOverrides = flagOverridePlugin.getAllOverrides();
    const overrideCount = Object.keys(currentOverrides).length;

    flagOverridePlugin.clearAllOverrides();
    analytics.trackFlagOverride('*', { count: overrideCount }, 'clear_all');
    analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
    setActiveFilters(new Set([FILTER_MODES.ALL]));

    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const handleClearAllStarred = () => {
    analytics.trackStarredFlag('*', 'clear_all');
    clearAllStarred();
    analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
    setActiveFilters(new Set([FILTER_MODES.ALL]));
  };

  const handleToggleStarred = useCallback(
    (flagKey: string) => {
      const wasPreviouslyStarred = isStarred(flagKey);
      toggleStarred(flagKey);
      analytics.trackStarredFlag(flagKey, wasPreviouslyStarred ? 'unstar' : 'star');
    },
    [isStarred, toggleStarred, analytics],
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

  const renderFlagControl = (flag: LocalFlag) => {
    const handleOverride = (value: any) => handleSetOverride(flag.key, value);

    switch (flag.type) {
      case 'boolean':
        return <LocalBooleanFlagControl flag={flag} onOverride={handleOverride} />;

      case 'string':
      case 'number':
        return <LocalStringNumberFlagControl flag={flag} onOverride={handleOverride} />;
    }
  };

  if (!ldClient) {
    return (
      <GenericHelpText
        title="LaunchDarkly client is not available"
        subtitle="To use local flag overrides, ensure your LaunchDarkly client is properly initialized."
      />
    );
  }

  if (isLoading) {
    return <GenericHelpText title="Loading flags..." subtitle="Please wait while we load your feature flags" />;
  }

  if (flagEntries.length === 0) {
    return (
      <GenericHelpText
        title="No flags available"
        subtitle="Make sure your LaunchDarkly client is properly initialized with flags"
      />
    );
  }

  const getGenericHelpText = () => {
    if (
      activeFilters.has(FILTER_MODES.OVERRIDES) &&
      !activeFilters.has(FILTER_MODES.STARRED) &&
      totalOverriddenFlags === 0
    ) {
      return { title: 'No overridden flags found', subtitle: 'You have not set any overrides yet' };
    }
    if (activeFilters.has(FILTER_MODES.STARRED) && !activeFilters.has(FILTER_MODES.OVERRIDES) && starredCount === 0) {
      return { title: 'No starred flags found', subtitle: 'Star flags to see them here' };
    }
    return { title: 'No flags found', subtitle: 'Try adjusting your search' };
  };

  const { title: genericHelpTitle, subtitle: genericHelpSubtitle } = getGenericHelpText();

  return (
    <FlagFilterOptionsContext.Provider value={{ activeFilters, onFilterToggle: handleFilterToggle }}>
      <div data-testid="flag-sdk-tab-content">
        <>
          <FilterOptions
            totalFlags={flagEntries.length}
            filteredFlags={filteredFlags.length}
            totalOverriddenFlags={totalOverriddenFlags}
            starredCount={starredCount}
            onClearOverrides={handleClearAllOverrides}
            onClearStarred={handleClearAllStarred}
            isLoading={isLoading}
          />

          {filteredFlags.length === 0 && (searchTerm.trim() || !activeFilters.has(FILTER_MODES.ALL)) ? (
            <GenericHelpText title={genericHelpTitle} subtitle={genericHelpSubtitle} />
          ) : (
            <div ref={scrollContainerRef} className={sharedStyles.virtualContainer}>
              <List>
                <div
                  className={sharedStyles.virtualInner}
                  style={{
                    height: virtualizer.getTotalSize(),
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const entry = filteredFlags[virtualItem.index];
                    if (!entry) return null;
                    const [flagKey, flag] = entry;

                    if (flag.type === 'object') {
                      return (
                        <motion.div
                          key={virtualItem.key}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{
                            duration: 0.2,
                            ease: EASING.smooth,
                            layout: {
                              duration: 0.25,
                              ease: EASING.smooth,
                            },
                          }}
                        >
                          <LocalObjectFlagControlListItem
                            handleHeightChange={(height) => handleHeightChange(virtualItem.index, height)}
                            flag={flag}
                            key={virtualItem.key}
                            start={virtualItem.start}
                            size={virtualItem.size}
                            handleClearOverride={handleClearOverride}
                            handleOverride={handleSetOverride}
                            onToggleStarred={handleToggleStarred}
                          />
                        </motion.div>
                      );
                    }

                    return (
                      <div
                        key={virtualItem.key}
                        className={sharedStyles.virtualItem}
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                          borderBottom: '1px solid var(--lp-color-gray-800)',
                        }}
                        data-testid={`flag-row-${flagKey}`}
                      >
                        <ListItem className={sharedStyles.flagListItem}>
                          <div className={sharedStyles.flagHeader}>
                            <span className={sharedStyles.flagName}>
                              <span className={sharedStyles.flagNameText} data-testid={`flag-name-${flagKey}`}>
                                {flag.name}
                              </span>
                              {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flagKey)} />}
                            </span>
                            <FlagKeyWithCopy flagKey={flagKey} className={sharedStyles.flagKey} />
                          </div>

                          <div className={sharedStyles.flagOptions}>
                            {renderFlagControl(flag)}
                            <StarButton
                              flagKey={flag.key}
                              isStarred={isStarred(flag.key)}
                              onToggle={handleToggleStarred}
                            />
                          </div>
                        </ListItem>
                      </div>
                    );
                  })}
                </div>
              </List>
            </div>
          )}
        </>
      </div>
    </FlagFilterOptionsContext.Provider>
  );
}

interface FlagSdkOverrideTabContentProps {
  flagOverridePlugin?: IFlagOverridePlugin;
  reloadOnFlagChangeIsEnabled: boolean;
}

export function FlagSdkOverrideTabContent(props: FlagSdkOverrideTabContentProps) {
  const { flagOverridePlugin, reloadOnFlagChangeIsEnabled } = props;

  if (!flagOverridePlugin) {
    return (
      <GenericHelpText
        title="Flag override plugin is not available"
        subtitle="To use local flag overrides, ensure the flag override plugin is added to your LaunchDarkly client configuration."
      />
    );
  }

  return (
    <FlagSdkOverrideProvider flagOverridePlugin={flagOverridePlugin}>
      <FlagSdkOverrideTabContentInner
        flagOverridePlugin={flagOverridePlugin}
        reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
      />
    </FlagSdkOverrideProvider>
  );
}
