import { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useContextsContext } from '../../../context/api/ContextsProvider';
import { useTabSearchContext } from '../context';
import { ContextItem } from './ContextItem';
import { GenericHelpText } from '../../GenericHelpText';
import { VIRTUALIZATION } from '../../../constants';
import * as styles from './ContextList.module.css';
import { ApiContext } from '../../../types/ldApi';

export function ContextList() {
  const { contexts, loading } = useContextsContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  // Filter contexts based on search term
  const filteredContexts = useMemo(() => {
    if (!searchTerm) {
      return contexts;
    }

    const searchLower = searchTerm.toLowerCase();
    return contexts.filter((context: ApiContext) => {
      const matchesKey = context.key.toLowerCase().includes(searchLower);
      const matchesName = context.name?.toLowerCase().includes(searchLower);
      const matchesKind = context.kind.toLowerCase().includes(searchLower);
      return matchesKey || matchesName || matchesKind;
    });
  }, [contexts, searchTerm]);

  const virtualizer = useVirtualizer({
    count: filteredContexts.length,
    getScrollElement,
    estimateSize: () => VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  // Calculate stats
  const totalContexts = contexts.length;
  const filteredCount = filteredContexts.length;
  const isFiltered = searchTerm.length > 0;

  // Loading state
  if (loading) {
    return <GenericHelpText title="Loading contexts..." subtitle="Fetching context data from your environment" />;
  }

  // Empty state - no contexts at all
  if (contexts.length === 0) {
    return (
      <GenericHelpText
        title="No contexts found"
        subtitle="Contexts will appear here once users interact with your application"
      />
    );
  }

  // Empty state - no matching contexts
  if (filteredContexts.length === 0 && searchTerm) {
    return (
      <div className={styles.container}>
        <div className={styles.statsHeader}>
          <span className={styles.statsText}>0 of {totalContexts} contexts</span>
        </div>
        <GenericHelpText title="No matching contexts" subtitle="Try adjusting your search" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <span className={styles.statsText}>
          {isFiltered ? `${filteredCount} of ${totalContexts} contexts` : `${totalContexts} contexts`}
        </span>
      </div>
      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div
          className={styles.virtualInner}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const context = filteredContexts[virtualItem.index];
            if (!context) return null;

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
                <ContextItem context={context} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
