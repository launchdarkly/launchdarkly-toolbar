import { useRef, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext, useAnalytics, usePinnedFlags } from '../context';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../context';
import { GenericHelpText } from '../components/GenericHelpText';
import {
  LocalBooleanFlagControl,
  LocalStringNumberFlagControl,
  LocalObjectFlagControl,
} from '../components/LocalFlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { ActionButtonsContainer, PinButton } from '../components';
import { VIRTUALIZATION } from '../constants';
import type { IFlagOverridePlugin } from '../../../types/plugin';
import type { LocalFlag } from '../context';

import * as sharedStyles from './FlagDevServerTabContent.css';
import * as actionStyles from '../components/ActionButtonsContainer.css';

interface FlagSdkOverrideTabContentInnerProps {
  flagOverridePlugin: IFlagOverridePlugin;
}

function FlagSdkOverrideTabContentInner(props: FlagSdkOverrideTabContentInnerProps) {
  const { flagOverridePlugin } = props;
  const { searchTerm } = useSearchContext();
  const analytics = useAnalytics();
  const { flags, isLoading } = useFlagSdkOverrideContext();
  const { isPinned, togglePin } = usePinnedFlags();
  const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleClearOverride = useCallback(
    (flagKey: string) => {
      if (flagOverridePlugin) {
        flagOverridePlugin.removeOverride(flagKey);
        analytics.trackFlagOverride(flagKey, null, 'remove');
      }
    },
    [flagOverridePlugin, analytics],
  );

  // Count total overridden flags (not just filtered ones)
  const totalOverriddenFlags = useMemo(() => {
    return Object.values(flags).filter((flag) => flag.isOverridden).length;
  }, [flags]);

  const showOverridesOnlyChanged = (enabled: boolean) => {
    setShowOverriddenOnly(enabled);
    analytics.trackShowOverridesOnlyClick(enabled);
  };

  // Prepare data for virtualizer with pinned/unpinned separation
  const flagEntries = Object.entries(flags);

  const { pinnedFlags, unpinnedFlags } = useMemo(() => {
    const pinned: [string, LocalFlag][] = [];
    const unpinned: [string, LocalFlag][] = [];

    flagEntries.forEach(([flagKey, flag]) => {
      // Apply search filter
      const matchesSearch =
        flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flagKey.toLowerCase().includes(searchTerm.trim().toLowerCase());

      // Apply override filter if enabled
      const matchesOverrideFilter = showOverriddenOnly ? flag.isOverridden : true;

      if (matchesSearch && matchesOverrideFilter) {
        if (isPinned(flagKey)) {
          pinned.push([flagKey, flag]);
        } else {
          unpinned.push([flagKey, flag]);
        }
      }
    });

    return { pinnedFlags: pinned, unpinnedFlags: unpinned };
  }, [flagEntries, searchTerm, showOverriddenOnly, isPinned]);

  const filteredFlags = [...pinnedFlags, ...unpinnedFlags];

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
  };

  const handleClearAllOverrides = () => {
    const currentOverrides = flagOverridePlugin.getAllOverrides();
    const overrideCount = Object.keys(currentOverrides).length;

    flagOverridePlugin.clearAllOverrides();
    analytics.trackFlagOverride('*', { count: overrideCount }, 'clear_all');
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
            onClick={() => showOverridesOnlyChanged(!showOverriddenOnly)}
            data-testid="show-overrides-only-button"
            aria-label={showOverriddenOnly ? 'Show all flags' : 'Show only overridden flags'}
          >
            Show overrides only
          </button>
          <button
            className={actionStyles.actionButton}
            onClick={handleClearAllOverrides}
            disabled={totalOverriddenFlags === 0}
            data-testid="clear-all-overrides-button"
            aria-label={`Clear all ${totalOverriddenFlags} flag overrides`}
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
                  const flagIsPinned = isPinned(flagKey);
                  const isPinnedSection = virtualItem.index < pinnedFlags.length;

                  return (
                    <div
                      key={virtualItem.key}
                      className={sharedStyles.virtualItem}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                        borderBottom:
                          isPinnedSection && virtualItem.index === pinnedFlags.length - 1
                            ? '2px solid var(--lp-color-gray-700)'
                            : '1px solid var(--lp-color-gray-800)',
                      }}
                      data-testid={`flag-row-${flagKey}`}
                    >
                      <ListItem className={sharedStyles.flagListItem}>
                        <div className={sharedStyles.flagHeader}>
                          <span className={sharedStyles.flagName}>
                            <PinButton
                              isPinned={flagIsPinned}
                              onClick={() => togglePin(flagKey)}
                              data-testid={`pin-button-${flagKey}`}
                            />
                            <span className={sharedStyles.flagNameText} data-testid={`flag-name-${flagKey}`}>
                              {flag.name}
                            </span>
                            {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flagKey)} />}
                          </span>
                          <span className={sharedStyles.flagKey} data-testid={`flag-key-${flagKey}`}>
                            {flagKey}
                          </span>
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

interface FlagSdkOverrideTabContentProps {
  flagOverridePlugin?: IFlagOverridePlugin;
}

export function FlagSdkOverrideTabContent(props: FlagSdkOverrideTabContentProps) {
  if (!props.flagOverridePlugin) {
    return (
      <GenericHelpText
        title="Flag override plugin is not available"
        subtitle="To use local flag overrides, ensure the flag override plugin is added to your LaunchDarkly client configuration."
      />
    );
  }

  return (
    <FlagSdkOverrideProvider flagOverridePlugin={props.flagOverridePlugin}>
      <FlagSdkOverrideTabContentInner flagOverridePlugin={props.flagOverridePlugin} />
    </FlagSdkOverrideProvider>
  );
}
