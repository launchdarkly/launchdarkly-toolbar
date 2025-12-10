import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useContextsContext } from '../../../context/api/ContextsProvider';
import { useTabSearchContext } from '../context';
import { ContextItem } from './ContextItem';
import { GenericHelpText } from '../../GenericHelpText';
import { VIRTUALIZATION } from '../../../constants';
import * as styles from './ContextList.module.css';
import { ApiContext } from '../../../types/ldApi';

const SCROLL_THRESHOLD = 200; // pixels from bottom to trigger load more

export function ContextList() {
  const { contexts, loading, loadingMore, hasMore, totalCount, loadMore, isActiveContext } = useContextsContext();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['flags'] || '', [searchTerms]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  const filteredContexts = useMemo(() => {
    const sortedContexts = [...contexts].sort((a, b) => {
      const aIsActive = isActiveContext(a.kind, a.key);
      const bIsActive = isActiveContext(b.kind, b.key);
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });

    if (!searchTerm) {
      return sortedContexts;
    }

    const searchLower = searchTerm.toLowerCase();
    return sortedContexts.filter((context: ApiContext) => {
      const matchesKey = context.key.toLowerCase().includes(searchLower);
      const matchesName = context.name?.toLowerCase().includes(searchLower);
      const matchesKind = context.kind.toLowerCase().includes(searchLower);
      return matchesKey || matchesName || matchesKind;
    });
  }, [contexts, searchTerm, isActiveContext]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || loadingMore || !hasMore || searchTerm) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < SCROLL_THRESHOLD) {
      loadMore();
    }
  }, [loadMore, loadingMore, hasMore, searchTerm]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const virtualizer = useVirtualizer({
    count: filteredContexts.length + (loadingMore ? 1 : 0), // Add 1 for loading indicator
    getScrollElement,
    estimateSize: (index) => {
      // Loading indicator is smaller
      if (index === filteredContexts.length) return 48;
      return VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP;
    },
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  // Calculate stats
  const displayedCount = filteredContexts.length;
  const isFiltered = searchTerm.length > 0;

  // Format stats text
  const getStatsText = () => {
    if (isFiltered) {
      return `${displayedCount} of ${contexts.length} contexts`;
    }
    if (totalCount !== undefined && totalCount > contexts.length) {
      return `${contexts.length} of ${totalCount} contexts`;
    }
    if (hasMore) {
      return `${contexts.length}+ contexts`;
    }
    return `${contexts.length} contexts`;
  };

  if (loading) {
    return <GenericHelpText title="Loading contexts..." subtitle="Fetching context data from your environment" />;
  }

  if (contexts.length === 0) {
    return (
      <GenericHelpText
        title="No contexts found"
        subtitle="Contexts will appear here once users interact with your application"
      />
    );
  }

  if (filteredContexts.length === 0 && searchTerm) {
    return (
      <div className={styles.container}>
        <div className={styles.statsHeader}>
          <span className={styles.statsText}>0 of {contexts.length} contexts</span>
        </div>
        <GenericHelpText title="No matching contexts" subtitle="Try adjusting your search" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <span className={styles.statsText}>{getStatsText()}</span>
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
            // Render loading indicator as last item
            if (virtualItem.index === filteredContexts.length) {
              return (
                <div
                  key="loading-more"
                  className={styles.loadingMore}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <span className={styles.loadingMoreText}>Loading more contexts...</span>
                </div>
              );
            }

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
                <ContextItem context={context} isActive={isActiveContext(context.kind, context.key)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
