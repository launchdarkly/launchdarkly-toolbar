import React, { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FlagItem } from './FlagItem';
import * as styles from './FlagList.module.css.ts';
import { VIRTUALIZATION } from '../../../constants';

export const FlagList = () => {
  const [flags, setFlags] = React.useState([
    { id: 'new-dashboard-ui', name: 'new-dashboard-ui', value: 'true', enabled: true },
    { id: 'enable-analytics', name: 'enable-analytics', value: 'false', enabled: false },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
  ]);

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Gap between items
  const GAP = 12;

  // Setup virtualizer with gap included in size
  const virtualizer = useVirtualizer({
    count: flags.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  const handleToggle = (id: string) => {
    setFlags((prevFlags) => prevFlags.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag)));
  };

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
          const flag = flags[virtualItem.index];
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
                onToggle={() => handleToggle(flag.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
