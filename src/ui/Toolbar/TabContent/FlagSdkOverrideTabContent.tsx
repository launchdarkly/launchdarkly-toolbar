import { useRef, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../context';
import { GenericHelpText } from '../components/GenericHelpText';
import {
  LocalBooleanFlagControl,
  LocalStringNumberFlagControl,
  LocalObjectFlagControl,
} from '../components/LocalFlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { ActionButtonsContainer } from '../components';
import { VIRTUALIZATION } from '../constants';
import type { IFlagOverridePlugin } from '../../../types/plugin';
import type { LocalFlag } from '../context';

import * as sharedStyles from './FlagDevServerTabContent.css';
import * as actionStyles from '../components/ActionButtonsContainer.css';

interface FlagSdkOverrideTabContentProps {
  flagOverridePlugin?: IFlagOverridePlugin;
}

function FlagSdkOverrideTabContentInner(props: FlagSdkOverrideTabContentProps) {
  const { flagOverridePlugin } = props;
  const { searchTerm } = useSearchContext();
  const { flags, isLoading } = useFlagSdkOverrideContext();
  const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleClearOverride = useCallback(
    (flagKey: string) => {
      if (flagOverridePlugin) {
        flagOverridePlugin.removeOverride(flagKey);
      }
    },
    [flagOverridePlugin],
  );

  // Count total overridden flags (not just filtered ones)
  const totalOverriddenFlags = useMemo(() => {
    return Object.values(flags).filter((flag) => flag.isOverridden).length;
  }, [flags]);

  // Prepare data for virtualizer (must be done before useVirtualizer hook)
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
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  // Early returns after all hooks have been called
  const ldClient = flagOverridePlugin?.getClient();

  if (!ldClient || !flagOverridePlugin) {
    return (
      <GenericHelpText
        title="LaunchDarkly client is not available"
        subtitle="To use local flag overrides, ensure the flag override plugin is added to your LaunchDarkly client configuration."
      />
    );
  }

  if (isLoading) {
    return <GenericHelpText title="Loading flags..." subtitle="Please wait while we load your feature flags" />;
  }

  // Override operations
  const handleSetOverride = (flagKey: string, value: any) => {
    flagOverridePlugin.setOverride(flagKey, value);
  };

  const handleClearAllOverrides = () => {
    flagOverridePlugin.clearAllOverrides();
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
    <div data-testid="flag-sdk-tab-content">
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
          <div ref={parentRef} className={sharedStyles.virtualContainer}>
            <List>
              <div
                className={sharedStyles.virtualInner}
                style={{
                  height: virtualizer.getTotalSize(),
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const [flagKey, flag] = filteredFlags[virtualItem.index];

                  return (
                    <div
                      key={virtualItem.key}
                      className={sharedStyles.virtualItem}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                        borderBottom: '1px solid var(--lp-color-gray-800)',
                      }}
                    >
                      <ListItem>
                        <div className={sharedStyles.flagHeader}>
                          <span className={sharedStyles.flagName}>
                            <span className={sharedStyles.flagNameText}>{flag.name}</span>
                            {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flagKey)} />}
                          </span>
                          <span className={sharedStyles.flagKey}>{flagKey}</span>
                        </div>

                        <div className={sharedStyles.flagOptions}>{renderFlagControl(flag)}</div>
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

export function FlagSdkOverrideTabContent(props: FlagSdkOverrideTabContentProps) {
  if (!props.flagOverridePlugin) {
    return <div>No flag override plugin available</div>;
  }

  return (
    <FlagSdkOverrideProvider flagOverridePlugin={props.flagOverridePlugin}>
      <FlagSdkOverrideTabContentInner {...props} />
    </FlagSdkOverrideProvider>
  );
}
