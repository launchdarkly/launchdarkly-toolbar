import { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FlagItem } from './FlagItem';
import * as styles from './FlagList.module.css.ts';
import { VIRTUALIZATION } from '../../../constants';
import { useToolbarState } from '../../../context/ToolbarStateProvider';
import { useDevServerContext } from '../../../context/DevServerProvider';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../../../context/FlagSdkOverrideProvider';
import { useTabSearchContext } from '../context/TabSearchProvider';
import { EnhancedFlag } from '../../../../../types/devServer';
import { LocalFlag } from '../../../context/FlagSdkOverrideProvider';
import { GenericHelpText } from '../../GenericHelpText';
import { usePlugins } from '../../../context/PluginsProvider.tsx';

interface NormalizedFlag {
  key: string;
  name: string;
  value: string;
  enabled: boolean;
  isOverridden: boolean;
}

// Dev Server Mode Component
function DevServerFlagList() {
  const { state, setOverride } = useDevServerContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Normalize flags from dev server
  const normalizedFlags: NormalizedFlag[] = useMemo(() => {
    return Object.values(state.flags).map((flag: EnhancedFlag) => ({
      key: flag.key,
      name: flag.name,
      value: formatValue(flag.currentValue),
      enabled: flag.enabled,
      isOverridden: flag.isOverridden,
    }));
  }, [state.flags]);

  // Filter flags based on search term
  const filteredFlags = useMemo(() => {
    if (!searchTerm) return normalizedFlags;

    const searchLower = searchTerm.toLowerCase();
    return normalizedFlags.filter(
      (flag) =>
        flag.name.toLowerCase().includes(searchLower) ||
        flag.key.toLowerCase().includes(searchLower) ||
        flag.value.toLowerCase().includes(searchLower),
    );
  }, [normalizedFlags, searchTerm]);

  const GAP = 12;

  const virtualizer = useVirtualizer({
    count: filteredFlags.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  const handleToggle = useCallback(
    async (flagKey: string) => {
      const flag = state.flags[flagKey];
      if (flag && flag.type === 'boolean') {
        await setOverride(flagKey, !flag.currentValue);
      }
    },
    [state.flags, setOverride],
  );

  if (filteredFlags.length === 0 && !searchTerm) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlags.length === 0 && searchTerm) {
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
          const flag = filteredFlags[virtualItem.index];
          if (!flag) return null;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${VIRTUALIZATION.ITEM_HEIGHT}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <FlagItem
                name={flag.name}
                value={flag.value}
                enabled={flag.enabled}
                isOverridden={flag.isOverridden}
                onToggle={() => handleToggle(flag.key)}
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
  const { flags } = useFlagSdkOverrideContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Normalize flags from SDK
  const normalizedFlags: NormalizedFlag[] = useMemo(() => {
    return Object.values(flags).map((flag: LocalFlag) => ({
      key: flag.key,
      name: flag.name,
      value: formatValue(flag.currentValue),
      enabled: true, // SDK flags are always enabled
      isOverridden: flag.isOverridden,
    }));
  }, [flags]);

  // Filter flags based on search term
  const filteredFlags = useMemo(() => {
    if (!searchTerm) return normalizedFlags;

    const searchLower = searchTerm.toLowerCase();
    return normalizedFlags.filter(
      (flag) =>
        flag.name.toLowerCase().includes(searchLower) ||
        flag.key.toLowerCase().includes(searchLower) ||
        flag.value.toLowerCase().includes(searchLower),
    );
  }, [normalizedFlags, searchTerm]);

  const GAP = 12;

  const virtualizer = useVirtualizer({
    count: filteredFlags.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  if (filteredFlags.length === 0 && !searchTerm) {
    return (
      <GenericHelpText
        title="No feature flags found"
        subtitle="Make sure you have feature flags set up in your project"
      />
    );
  }

  if (filteredFlags.length === 0 && searchTerm) {
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
          const flag = filteredFlags[virtualItem.index];
          if (!flag) return null;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${VIRTUALIZATION.ITEM_HEIGHT}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <FlagItem
                name={flag.name}
                value={flag.value}
                enabled={flag.enabled}
                isOverridden={flag.isOverridden}
                onToggle={() => {
                  console.log('SDK toggle not yet implemented');
                }}
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
