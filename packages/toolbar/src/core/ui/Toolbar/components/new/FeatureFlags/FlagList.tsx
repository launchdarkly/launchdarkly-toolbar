import { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FlagItem } from './FlagItem';
import * as styles from './FlagList.module.css.ts';
import { VIRTUALIZATION } from '../../../constants';
import { useToolbarState } from '../../../context/ToolbarStateProvider';
import { useDevServerContext } from '../../../context/DevServerProvider';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../../../context/FlagSdkOverrideProvider';
import { useTabSearchContext } from '../context/TabSearchProvider';
import { EnhancedFlag, Variation } from '../../../../../types/devServer';
import { LocalFlag } from '../../../context/FlagSdkOverrideProvider';
import { GenericHelpText } from '../../GenericHelpText';
import { usePlugins } from '../../../context/PluginsProvider.tsx';

export interface NormalizedFlag {
  key: string;
  name: string;
  enabled: boolean;
  isOverridden: boolean;
  type: 'boolean' | 'multivariate' | 'string' | 'number' | 'object';
  currentValue: any;
  availableVariations: Variation[];
}

// Dev Server Mode Component
function DevServerFlagList() {
  const { state, setOverride, clearOverride } = useDevServerContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

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
      value: formatValue(flag.currentValue),
      enabled: flag.enabled,
      isOverridden: flag.isOverridden,
      type: flag.type,
      availableVariations: flag.availableVariations,
    }));
  }, [allFlags]);

  // Filter flags based on search term
  const filteredFlagIndices = useMemo(() => {
    if (!searchTerm) return allFlags.map((_, index) => index);

    const searchLower = searchTerm.toLowerCase();
    return normalizedFlags
      .map((flag, index) => ({ flag, index }))
      .filter(
        ({ flag }) =>
          flag.name.toLowerCase().includes(searchLower) ||
          flag.key.toLowerCase().includes(searchLower) ||
          flag.currentValue.toLowerCase().includes(searchLower),
      )
      .map(({ index }) => index);
  }, [normalizedFlags, searchTerm, allFlags]);

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
    },
    [setOverride],
  );

  const handleClearOverride = useCallback(
    async (flagKey: string) => {
      await clearOverride(flagKey);
    },
    [clearOverride],
  );

  if (filteredFlagIndices.length === 0 && !searchTerm) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlagIndices.length === 0 && searchTerm) {
    return <GenericHelpText title="No matching flags" subtitle="Try adjusting your search" />;
  }

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer}>
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
  );
}

// SDK Mode Component
function SdkFlagList() {
  const { flags, setOverride, removeOverride } = useFlagSdkOverrideContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

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
      enabled: true, // SDK flags are always enabled
      isOverridden: flag.isOverridden,
      type: flag.type,
      availableVariations: [],
    }));
  }, [allFlags]);

  // Filter flags based on search term
  const filteredFlagIndices = useMemo(() => {
    if (!searchTerm) return allFlags.map((_, index) => index);

    const searchLower = searchTerm.toLowerCase();
    return normalizedFlags
      .map((flag, index) => ({ flag, index }))
      .filter(
        ({ flag }) =>
          flag.name.toLowerCase().includes(searchLower) ||
          flag.key.toLowerCase().includes(searchLower) ||
          flag.currentValue.toLowerCase().includes(searchLower),
      )
      .map(({ index }) => index);
  }, [normalizedFlags, searchTerm, allFlags]);

  const virtualizer = useVirtualizer({
    count: filteredFlagIndices.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  const handleOverride = useCallback(
    (flagKey: string, value: any) => {
      setOverride(flagKey, value);
    },
    [setOverride],
  );

  const handleClearOverride = useCallback(
    (flagKey: string) => {
      removeOverride(flagKey);
    },
    [removeOverride],
  );

  const handleHeightChange = useCallback(
    (index: number, height: number) => {
      console.log('handleHeightChange', index, height);
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

  if (filteredFlagIndices.length === 0 && !searchTerm) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlagIndices.length === 0 && searchTerm) {
    return <GenericHelpText title="No matching flags" subtitle="Try adjusting your search" />;
  }

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer}>
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

// Helper function to format flag values for display
function formatValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
