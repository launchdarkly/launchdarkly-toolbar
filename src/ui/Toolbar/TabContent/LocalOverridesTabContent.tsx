import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { GenericHelpText } from '../components/GenericHelpText';
import {
  LocalBooleanFlagControl,
  LocalStringNumberFlagControl,
  LocalObjectFlagControl,
} from '../components/LocalFlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { ActionButtonsContainer } from '../components';
import type { IDebugOverridePlugin } from '../../../types/plugin';

import * as styles from './FlagTabContent.css';
import * as actionStyles from '../components/ActionButtonsContainer.css';

interface LocalFlag {
  key: string;
  name: string;
  currentValue: any;
  isOverridden: boolean;
  type: 'boolean' | 'string' | 'number' | 'object';
}

interface LocalOverridesTabContentProps {
  debugOverridePlugin: IDebugOverridePlugin;
}

export function LocalOverridesTabContent(props: LocalOverridesTabContentProps) {
  const { debugOverridePlugin } = props;
  const { searchTerm } = useSearchContext();
  const ldClient = debugOverridePlugin.getClient();

  const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const formatFlagName = (flagKey: string): string => {
    return flagKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const inferFlagType = (value: any): 'boolean' | 'string' | 'number' | 'object' => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    return 'object';
  };

  // Get flags directly from LDClient (includes overrides automatically)
  const getFlags = (): Record<string, LocalFlag> => {
    if (!ldClient) return {};

    const allFlags = ldClient.allFlags();
    const overrides = debugOverridePlugin.getAllOverrides();
    const result: Record<string, LocalFlag> = {};

    Object.keys(allFlags)
      .sort()
      .forEach((flagKey) => {
        const currentValue = allFlags[flagKey];
        result[flagKey] = {
          key: flagKey,
          name: formatFlagName(flagKey),
          currentValue,
          isOverridden: flagKey in overrides,
          type: inferFlagType(currentValue),
        };
      });

    return result;
  };

  console.log('DebugOverridePlugin: getAllOverrides', debugOverridePlugin.getAllOverrides());
  const flags = getFlags();

  // Override operations - simple direct calls
  const handleSetOverride = (flagKey: string, value: any) => {
    debugOverridePlugin.setOverride(flagKey, value);
  };

  const handleClearOverride = (flagKey: string) => {
    debugOverridePlugin.removeOverride(flagKey);
  };

  const handleClearAllOverrides = () => {
    debugOverridePlugin.clearAllOverrides();
  };

  if (!ldClient) {
    return <GenericHelpText title="LaunchDarkly client not available" subtitle="Make sure the client is initialized" />;
  }

  const flagEntries = Object.entries(flags);
  const filteredFlags = flagEntries.filter(([flagKey, flag]) => {
    // Apply search filter
    const matchesSearch =
      flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flagKey.toLowerCase().includes(searchTerm.trim().toLowerCase());

    // Apply override filter if enabled
    const matchesOverrideFilter = showOverriddenOnly ? flag.isOverridden : true;
    return matchesSearch && matchesOverrideFilter;
  });

  const virtualizer = useVirtualizer({
    count: filteredFlags.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 85, // Estimate item height
    overscan: 5,
  });

  // Count total overridden flags (not just filtered ones)
  const totalOverriddenFlags = Object.values(flags).filter((flag) => flag.isOverridden).length;

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

  // Handle no flags case
  if (flagEntries.length === 0) {
    return (
      <GenericHelpText
        title="No flags available"
        subtitle="Make sure your LaunchDarkly client is properly initialized with flags"
      />
    );
  }

  // Generate help text based on current state
  const genericHelpTitle = showOverriddenOnly ? 'No overridden flags found' : 'No results found';
  const genericHelpSubtitle = showOverriddenOnly
    ? 'No overridden flags match your search'
    : 'Try adjusting your search or check if flags are available';

  return (
    <div data-testid="local-overrides-tab-content">
      <>
        <ActionButtonsContainer>
          <button
            className={`${actionStyles.toggleButton} ${showOverriddenOnly ? actionStyles.active : ''}`}
            onClick={() => setShowOverriddenOnly((prev) => !prev)}
          >
            Show overrides only
          </button>
          <button
            className={actionStyles.actionButton}
            onClick={handleClearAllOverrides}
            disabled={totalOverriddenFlags === 0}
          >
            Clear all overrides ({totalOverriddenFlags})
          </button>
        </ActionButtonsContainer>

        {filteredFlags.length === 0 && (searchTerm.trim() || showOverriddenOnly) ? (
          <GenericHelpText title={genericHelpTitle} subtitle={genericHelpSubtitle} />
        ) : (
          <div ref={parentRef} className={styles.virtualContainer}>
            <List>
              <div
                className={styles.virtualInner}
                style={{
                  height: virtualizer.getTotalSize(),
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const [flagKey, flag] = filteredFlags[virtualItem.index];

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
                      <ListItem>
                        <div className={styles.flagHeader}>
                          <span className={styles.flagName}>
                            <span className={styles.flagNameText}>{flag.name}</span>
                            {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flagKey)} />}
                          </span>
                          <span className={styles.flagKey}>{flagKey}</span>
                        </div>

                        <div className={styles.flagOptions}>{renderFlagControl(flag)}</div>
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
  );
}
