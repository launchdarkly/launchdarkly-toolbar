import { useState, useMemo, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useAnalytics, useDevServerContext, useSearchContext, useStarredFlags } from '../../../context';
import { List } from '../../../../List/List';
import { ListItem } from '../../../../List/ListItem';
import { EnhancedFlag } from '../../../../../types/devServer';
import { GenericHelpText } from '../../GenericHelpText';
import { BooleanFlagControl, MultivariateFlagControl, StringNumberFlagControl } from '../FlagControls';
import { OverrideIndicator } from '../../OverrideIndicator';
import { StarButton } from '../../../../Buttons/StarButton';
import { type FlagFilterMode, FlagFilterOptionsContext, FILTER_MODES } from '../../FilterOptions/useFlagFilterOptions';
import { FilterOptions } from '../../FilterOptions/FilterOptions';
import { VIRTUALIZATION } from '../../../constants';
import { LocalObjectFlagControlListItem } from '../LocalObjectFlagControlListItem';
import * as styles from './FlagDevServerTabContent.css';
import { CopyableText } from '../../CopyableText';
import { serializeToolbarState, SHARED_STATE_VERSION, MAX_STATE_SIZE_LIMIT } from '../../../../../utils/urlOverrides';
import { loadContexts, loadActiveContext, loadAllSettings, loadStarredFlags } from '../../../utils/localStorage';

interface FlagDevServerTabContentProps {
  reloadOnFlagChangeIsEnabled: boolean;
}

export function FlagDevServerTabContent(props: FlagDevServerTabContentProps) {
  const { reloadOnFlagChangeIsEnabled } = props;
  const { searchTerm } = useSearchContext();
  const analytics = useAnalytics();
  const { state, setOverride, clearOverride, clearAllOverrides } = useDevServerContext();
  const { flags } = state;
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
    analytics.trackFlagOverride(flagKey, value, 'set');

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
    const overrideCount = totalOverriddenFlags;
    await clearAllOverrides();
    analytics.trackFlagOverride('*', { count: overrideCount }, 'clear_all');
    analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
    setActiveFilters(new Set([FILTER_MODES.ALL]));
    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const onClearAllStarred = () => {
    analytics.trackStarredFlag('*', 'clear_all');
    clearAllStarred();
    analytics.trackFilterChange(FILTER_MODES.ALL, 'selected');
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
        analytics.trackFlagOverride(flagKey, null, 'remove');
        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      });
    },
    [totalOverriddenFlags, activeFilters, clearOverride, analytics, reloadOnFlagChangeIsEnabled],
  );

  const handleToggleStarred = useCallback(
    (flagKey: string) => {
      const wasPreviouslyStarred = isStarred(flagKey);
      toggleStarred(flagKey);
      analytics.trackStarredFlag(flagKey, wasPreviouslyStarred ? 'unstar' : 'star');
    },
    [isStarred, toggleStarred, analytics],
  );

  const handleShareUrl = useCallback(() => {
    try {
      // Get all overridden flags from dev server
      const overrides: Record<string, any> = {};
      Object.entries(flags).forEach(([flagKey, flag]) => {
        if (flag.isOverridden) {
          overrides[flagKey] = flag.currentValue;
        }
      });

      // Gather all toolbar state
      const toolbarState = {
        version: SHARED_STATE_VERSION,
        overrides,
        contexts: loadContexts(),
        activeContext: loadActiveContext(),
        settings: loadAllSettings(),
        starredFlags: Array.from(loadStarredFlags()),
      };

      // Serialize the state
      const result = serializeToolbarState(toolbarState);

      // Check size limits
      if (result.exceedsLimit) {
        console.error(
          `Shared state is too large (${result.size} chars, limit: ${MAX_STATE_SIZE_LIMIT}). Cannot create shareable link.`,
        );
        alert(
          `The toolbar state is too large to share (${result.size} characters). Try reducing the number of overrides, contexts, or starred flags.`,
        );
        return;
      }

      if (result.exceedsWarning) {
        console.warn(
          `Shared state is large (${result.size} chars). Some browsers may have issues with URLs this long.`,
        );
      }

      navigator.clipboard
        .writeText(result.url)
        .then(() => {
          console.log('Share URL copied to clipboard:', result.url);
          analytics.trackFlagOverride('*', { count: Object.keys(overrides).length }, 'share_url');
        })
        .catch((error) => {
          console.error('Failed to copy share URL:', error);
          alert('Failed to copy URL to clipboard. Please copy it manually from the console.');
        });
    } catch (error) {
      console.error('Failed to create share URL:', error);
      alert('Failed to create shareable link. Check console for details.');
    }
  }, [flags, analytics]);

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

  const handleCopy = useCallback(
    (text: string) => {
      analytics.trackFlagKeyCopy(text);
    },
    [analytics],
  );

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
            onShareUrl={handleShareUrl}
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
                            onToggleStarred={handleToggleStarred}
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
                          borderBottom: '1px solid var(--lp-color-gray-600);',
                        }}
                      >
                        <ListItem className={styles.flagListItem}>
                          <div className={styles.flagHeader}>
                            <span className={styles.flagName}>
                              <span className={styles.flagNameText}>{flag.name}</span>
                              {flag.isOverridden && <OverrideIndicator onClear={() => onClearOverride(flag.key)} />}
                            </span>
                            <CopyableText text={flag.key} className={styles.flagKey} onCopy={handleCopy} />
                          </div>

                          <div className={styles.flagOptions}>
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
