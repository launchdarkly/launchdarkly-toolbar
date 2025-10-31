import { useRef, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext, useAnalytics } from '../context';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../context';
import { GenericHelpText } from '../components/GenericHelpText';
import {
  LocalBooleanFlagControl,
  LocalStringNumberFlagControl,
  LocalObjectFlagControl,
} from '../components/LocalFlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { StarButton } from '../components/StarButton';
import { useStarredFlags } from '../context/StarredFlagsProvider';
import { type FlagFilterMode, FlagFilterOptionsContext } from '../components/FilterOptions/useFlagFilterOptions';
import { FilterOptions } from '../components/FilterOptions/FilterOptions';
import { VIRTUALIZATION } from '../constants';
import type { LocalFlag } from '../context';

import * as sharedStyles from './FlagDevServerTabContent.css';
import { IFlagOverridePlugin } from '../../../../types';

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
  const [activeFilter, setActiveFilter] = useState<FlagFilterMode>('all');
  const parentRef = useRef<HTMLDivElement>(null);

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

      // Apply active filter
      let matchesFilter = true;
      if (activeFilter === 'overrides') {
        matchesFilter = flag.isOverridden;
      } else if (activeFilter === 'starred') {
        matchesFilter = isStarred(flagKey);
      }

      return matchesSearch && matchesFilter;
    });
  }, [flagEntries, searchTerm, activeFilter, isStarred]);

  const virtualizer = useVirtualizer({
    count: filteredFlags.length,
    getScrollElement: () => parentRef.current,
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
    setActiveFilter('all');

    if (reloadOnFlagChangeIsEnabled) {
      window.location.reload();
    }
  };

  const renderFlagControl = (flag: LocalFlag) => {
    const handleOverride = (value: any) => handleSetOverride(flag.key, value);

    switch (flag.type) {
      case 'boolean':
        return <LocalBooleanFlagControl flag={flag} onOverride={handleOverride} />;

      case 'string':
      case 'number':
        return <LocalStringNumberFlagControl flag={flag} onOverride={handleOverride} />;

      case 'object':
        return <LocalObjectFlagControl flag={flag} onOverride={handleOverride} />;

      default:
        return <LocalObjectFlagControl flag={flag} onOverride={handleOverride} />;
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
    if (activeFilter === 'overrides' && totalOverriddenFlags === 0) {
      return { title: 'No overridden flags found', subtitle: 'You have not set any overrides yet' };
    }
    if (activeFilter === 'starred' && starredCount === 0) {
      return { title: 'No starred flags found', subtitle: 'Star flags to see them here' };
    }
    return { title: 'No flags found', subtitle: 'Try adjusting your search' };
  };

  const { title: genericHelpTitle, subtitle: genericHelpSubtitle } = getGenericHelpText();

  return (
    <FlagFilterOptionsContext.Provider value={{ activeFilter, onFilterChange: setActiveFilter }}>
      <div data-testid="flag-sdk-tab-content">
        <>
          <FilterOptions
            totalFlags={flagEntries.length}
            filteredFlags={filteredFlags.length}
            totalOverriddenFlags={totalOverriddenFlags}
            starredCount={starredCount}
            onClearOverrides={handleClearAllOverrides}
            onClearStarred={clearAllStarred}
            isLoading={isLoading}
          />

          {filteredFlags.length === 0 && (searchTerm.trim() || activeFilter !== 'all') ? (
            <GenericHelpText title={genericHelpTitle} subtitle={genericHelpSubtitle} />
          ) : (
            <div ref={parentRef} className={sharedStyles.virtualContainer}>
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
                            <span className={sharedStyles.flagKey} data-testid={`flag-key-${flagKey}`}>
                              {flagKey}
                            </span>
                          </div>

                          <div className={sharedStyles.flagOptions}>
                            {renderFlagControl(flag)}
                            <StarButton flagKey={flagKey} isStarred={isStarred(flagKey)} onToggle={toggleStarred} />
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
