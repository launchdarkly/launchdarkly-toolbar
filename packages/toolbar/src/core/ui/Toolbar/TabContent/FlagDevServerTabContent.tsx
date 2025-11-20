import { useState, useMemo, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { useDevServerContext } from '../context/DevServerProvider';
import { EnhancedFlag } from '../../../types/devServer';
import { GenericHelpText } from '../components/GenericHelpText';
import { BooleanFlagControl, MultivariateFlagControl, StringNumberFlagControl } from '../components/FlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { StarButton } from '../components/StarButton';
import { FlagKeyWithCopy } from '../components/FlagKeyWithCopy';
import { ExternalLinkIcon } from '../components/icons';
import { useStarredFlags } from '../context/StarredFlagsProvider';
import {
  type FlagFilterMode,
  FlagFilterOptionsContext,
  FILTER_MODES,
} from '../components/FilterOptions/useFlagFilterOptions';
import { FilterOptions } from '../components/FilterOptions/FilterOptions';
import { VIRTUALIZATION } from '../constants';
import { LocalObjectFlagControlListItem } from '../components/LocalObjectFlagControlListItem';

import * as styles from './FlagDevServerTabContent.css';
import { useEnvironmentContext } from '../context/EnvironmentProvider';
import { useProjectContext } from '../context/ProjectProvider';

interface FlagDevServerTabContentProps {
  reloadOnFlagChangeIsEnabled: boolean;
}

export function FlagDevServerTabContent(props: FlagDevServerTabContentProps) {
  const { reloadOnFlagChangeIsEnabled } = props;
  const { searchTerm } = useSearchContext();
  const { state, setOverride, clearOverride, clearAllOverrides } = useDevServerContext();
  const { flags } = state;
  const { isStarred, toggleStarred, clearAllStarred, starredCount } = useStarredFlags();
  const { projectKey } = useProjectContext();
  const { environment } = useEnvironmentContext();
  const [activeFilters, setActiveFilters] = useState<Set<FlagFilterMode>>(new Set([FILTER_MODES.ALL]));

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  const handleFilterToggle = useCallback((filter: FlagFilterMode) => {
    setActiveFilters((prev) => {
      // Clicking "All" resets to default state
      if (filter === FILTER_MODES.ALL) {
        return new Set([FILTER_MODES.ALL]);
      }

      const next = new Set(prev);
      next.delete(FILTER_MODES.ALL); // Remove "All" when selecting specific filters

      // Toggle the selected filter
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }

      // Default to "All" if no filters remain
      return next.size === 0 ? new Set([FILTER_MODES.ALL]) : next;
    });
  }, []);

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

  // Count total overridden flags (not just filtered ones)
  const totalOverriddenFlags = useMemo(() => {
    return Object.values(flags).filter((flag) => flag.isOverridden).length;
  }, [flags]);

  const handleSetOverride = (flagKey: string, value: any) => {
    setOverride(flagKey, value);

    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const renderFlagControl = (flag: EnhancedFlag) => {
    const handleOverride = (value: any) => handleSetOverride(flag.key, value);

    switch (flag.type) {
      case 'boolean':
        return <BooleanFlagControl flag={flag} onOverride={handleOverride} disabled={!flag.enabled} />;

      case 'multivariate':
        return <MultivariateFlagControl flag={flag} onOverride={handleOverride} disabled={!flag.enabled} />;

      case 'string':
      case 'number':
        return <StringNumberFlagControl flag={flag} onOverride={handleOverride} disabled={!flag.enabled} />;

      default:
        return <div>Unsupported flag type: {flag.type}</div>;
    }
  };

  const onRemoveAllOverrides = async () => {
    await clearAllOverrides();
    setActiveFilters(new Set([FILTER_MODES.ALL]));
    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const onClearAllStarred = () => {
    clearAllStarred();
    setActiveFilters(new Set([FILTER_MODES.ALL]));
  };

  const onClearOverride = useCallback(
    (flagKey: string) => {
      if (
        totalOverriddenFlags <= 1 &&
        activeFilters.has(FILTER_MODES.OVERRIDES) &&
        !activeFilters.has(FILTER_MODES.STARRED)
      ) {
        setActiveFilters(new Set([FILTER_MODES.ALL]));
      }
      clearOverride(flagKey).then(() => {
        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      });
    },
    [totalOverriddenFlags, activeFilters, clearOverride, reloadOnFlagChangeIsEnabled],
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
      <div data-testid="flag-dev-server-tab-content">
        <>
          <FilterOptions
            totalFlags={flagEntries.length}
            filteredFlags={filteredFlags.length}
            totalOverriddenFlags={totalOverriddenFlags}
            starredCount={starredCount}
            onClearOverrides={onRemoveAllOverrides}
            onClearStarred={onClearAllStarred}
            isLoading={state.isLoading}
          />

          {filteredFlags.length === 0 && (searchTerm.trim() || !activeFilters.has(FILTER_MODES.ALL)) ? (
            <GenericHelpText title={genericHelpTitle} subtitle={genericHelpSubtitle} />
          ) : (
            <div ref={scrollContainerRef} className={styles.virtualContainer}>
              <List>
                <div
                  className={styles.virtualInner}
                  style={{
                    height: virtualizer.getTotalSize(),
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const entry = filteredFlags[virtualItem.index];
                    if (!entry) return null;
                    const [_, flag] = entry;

                    if (flag.type === 'object') {
                      return (
                        <div key={virtualItem.key} className={styles.virtualItem}>
                          <LocalObjectFlagControlListItem
                            flag={flag}
                            size={virtualItem.size}
                            start={virtualItem.start}
                            handleOverride={handleSetOverride}
                            handleClearOverride={onClearOverride}
                            handleHeightChange={(height) => handleHeightChange(virtualItem.index, height)}
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={virtualItem.key}
                        className={styles.virtualItem}
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                          borderBottom: '1px solid var(--lp-color-gray-800)',
                        }}
                      >
                        <ListItem className={styles.flagListItem}>
                          {flag.isOverridden && (
                            <div className={styles.overrideIndicatorContainer}>
                              <OverrideIndicator onClear={() => onClearOverride(flag.key)} />
                            </div>
                          )}
                          <div className={styles.flagHeader}>
                            <span className={styles.flagName}>
                              <span className={styles.flagNameText}>{flag.name}</span>
                            </span>
                            <FlagKeyWithCopy flagKey={flag.key} className={styles.flagKey} />
                            <a href={`https://app.launchdarkly.com/projects/${projectKey}/flags/${flag.key}?env=${environment}&selectedEnv=${environment}`} target="_blank" className={styles.flagLinkContainer}>
                              <span>Open in LaunchDarkly</span>
                              <ExternalLinkIcon size="small" />
                            </a>
                          </div>

                          <div className={styles.flagOptions}>
                            {renderFlagControl(flag)}
                            <StarButton flagKey={flag.key} isStarred={isStarred(flag.key)} onToggle={toggleStarred} />
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
