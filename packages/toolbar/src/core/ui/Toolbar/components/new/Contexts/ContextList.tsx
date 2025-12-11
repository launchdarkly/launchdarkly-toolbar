import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useContextsContext } from '../../../context/api/ContextsProvider';
import { useTabSearchContext } from '../context';
import { ContextItem } from './ContextItem';
import { GenericHelpText } from '../../GenericHelpText';
import { AddContextForm } from './AddContextForm';
import { AddIcon } from '../../icons';
import { VIRTUALIZATION } from '../../../constants';
import * as styles from './ContextList.module.css';
import { IconButton } from '../../../../Buttons/IconButton';

export function ContextList() {
  const { contexts, isActiveContext, filter, setFilter } = useContextsContext();
  const { searchTerms } = useTabSearchContext();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Sync the search term from the tab search context to the provider's filter
  const searchTerm = useMemo(() => searchTerms['contexts'] || '', [searchTerms]);

  // Update the provider's filter when the search term changes
  useEffect(() => {
    setFilter(searchTerm);
  }, [searchTerm, setFilter]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getScrollElement = useCallback(() => scrollContainerRef.current, []);

  const virtualizer = useVirtualizer({
    count: contexts.length,
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

  const displayedCount = contexts.length;
  const isFiltered = filter.length > 0;

  const getStatsText = () => {
    if (isFiltered) {
      return `${displayedCount} context${displayedCount !== 1 ? 's' : ''} matching "${filter}"`;
    }
    return `${displayedCount} context${displayedCount !== 1 ? 's' : ''}`;
  };

  if (contexts.length === 0 && !isFiltered) {
    return <GenericHelpText title="No contexts found" subtitle="Add contexts to test different user scenarios" />;
  }

  if (contexts.length === 0 && isFiltered) {
    return (
      <div className={styles.container}>
        <div className={styles.statsHeader}>
          <span className={styles.statsText}>0 contexts matching "{filter}"</span>
        </div>
        <GenericHelpText title="No matching contexts" subtitle="Try adjusting your search" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <span className={styles.statsText}>{getStatsText()}</span>
        <IconButton
          label="Add context"
          onClick={() => setIsAddFormOpen(true)}
          aria-label="Add context"
          icon={<AddIcon />}
        />
      </div>
      <AddContextForm isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)} />
      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div
          className={styles.virtualInner}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const context = contexts[virtualItem.index];
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
                <ContextItem
                  context={context}
                  isActive={isActiveContext(context.kind, context.key)}
                  handleHeightChange={handleHeightChange}
                  index={virtualItem.index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
