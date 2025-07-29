import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { useToolbarContext } from '../context/LaunchDarklyToolbarProvider';
import { EnhancedFlag } from '../../../types/devServer';
import { GenericHelpText } from '../components/GenericHelpText';
import { BooleanFlagControl, MultivariateFlagControl, StringNumberFlagControl } from '../components/FlagControls';
import { OverrideIndicator } from '../components/OverrideIndicator';
import { ActionButtonsContainer } from '../components';

import styles from './FlagTabContent.module.css';
import actionStyles from '../components/ActionButtonsContainer.module.css';

export function FlagTabContent() {
  const { searchTerm } = useSearchContext();
  const { state, setOverride, clearOverride, clearAllOverrides } = useToolbarContext();
  const { flags } = state;

  const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

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

  const renderFlagControl = (flag: EnhancedFlag) => {
    const handleOverride = (value: any) => setOverride(flag.key, value);

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

  const onRemoveAllOverrides = () => {
    clearAllOverrides();
    setShowOverriddenOnly(false);
  };

  const onClearOverride = (flagKey: string) => {
    if (totalOverriddenFlags <= 1) {
      setShowOverriddenOnly(false);
    }
    clearOverride(flagKey);
  };

  const genericHelpTitle = showOverriddenOnly ? 'No overrides found' : 'No flags found';
  const genericHelpSubtitle = showOverriddenOnly ? 'You have not set any overrides yet' : 'Try adjusting your search';

  return (
    <div data-testid="flag-tab-content">
      <>
        <ActionButtonsContainer>
          <button
            className={`${actionStyles.toggleButton} ${showOverriddenOnly ? actionStyles.active : ''}`}
            onClick={() => setShowOverriddenOnly((prev) => !prev)}
            disabled={state.isLoading}
          >
            Show overrides only
          </button>
          <button
            className={actionStyles.actionButton}
            onClick={onRemoveAllOverrides}
            disabled={state.isLoading || totalOverriddenFlags === 0}
          >
            Remove all overrides ({totalOverriddenFlags})
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
                  const [_, flag] = filteredFlags[virtualItem.index];

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
                            {flag.isOverridden && <OverrideIndicator onClear={() => onClearOverride(flag.key)} />}
                          </span>
                          <span className={styles.flagKey}>{flag.key}</span>
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
