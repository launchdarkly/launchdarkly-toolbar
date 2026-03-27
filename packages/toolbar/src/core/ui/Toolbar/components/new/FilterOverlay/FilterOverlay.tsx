import { useRef, useEffect, memo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useFilters, FilterOption } from '../context/FiltersProvider';
import { useActiveSubtabContext } from '../context/ActiveSubtabProvider';
import { SubTab } from '../types';
import { IconButton } from '../../../../Buttons/IconButton';
import { CheckIcon, FilterTuneIcon } from '../../icons';
import { useAnalytics, useToolbarState } from '../../../context';
import * as styles from './FilterOverlay.module.css';

const FLAG_LIFECYCLE_DEPRECATED: FilterOption = {
  id: 'lifecycle_deprecated',
  label: 'Include deprecated',
  description: 'Show deprecated flags',
};

const FLAG_LIFECYCLE_ARCHIVED: FilterOption = {
  id: 'lifecycle_archived',
  label: 'Include archived',
  description: 'Show archived flags',
};

interface FilterOptionItemProps {
  option: FilterOption;
  isActive: boolean;
  onToggle: () => void;
}

const FilterOptionItem = memo(function FilterOptionItem({ option, isActive, onToggle }: FilterOptionItemProps) {
  return (
    <button
      className={`${styles.filterOption} ${isActive ? styles.filterOptionActive : ''}`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isActive}
      aria-label={option.description || option.label}
    >
      <div className={`${styles.checkbox} ${isActive ? styles.checkboxChecked : ''}`}>
        {isActive && <CheckIcon className={styles.checkmark} />}
      </div>
      <div className={styles.filterLabel}>
        <span className={styles.filterName}>{option.label}</span>
        {option.description ? <span className={styles.filterDescription}>{option.description}</span> : null}
      </div>
    </button>
  );
});

interface FilterOverlayContentProps {
  subtab: SubTab;
  onClose: () => void;
}

const FilterOverlayContent = memo(function FilterOverlayContent({ subtab, onClose }: FilterOverlayContentProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { getActiveFilters, getFilterConfig, toggleFilter, resetFilters, hasActiveNonDefaultFilters } = useFilters();
  const analytics = useAnalytics();
  const {
    includeDeprecatedFlags,
    includeArchivedFlags,
    handleToggleIncludeDeprecatedFlags,
    handleToggleIncludeArchivedFlags,
    resetFlagLifecycleFilters,
  } = useToolbarState();

  const config = getFilterConfig(subtab);
  const activeFilters = getActiveFilters(subtab);
  const hasChipNonDefaultFilters = hasActiveNonDefaultFilters(subtab);
  const hasLifecycleNonDefault = subtab === 'flags' && (includeDeprecatedFlags || includeArchivedFlags);
  const hasNonDefaultFilters = hasChipNonDefaultFilters || hasLifecycleNonDefault;

  const handleToggle = useCallback(
    (optionId: string) => {
      const wasActive = activeFilters.has(optionId);
      toggleFilter(subtab, optionId);
      analytics.trackFilterChange(optionId as 'all' | 'overrides' | 'starred', wasActive ? 'deselected' : 'selected');
    },
    [subtab, toggleFilter, activeFilters, analytics],
  );

  const handleReset = useCallback(() => {
    resetFilters(subtab);
    if (subtab === 'flags') {
      resetFlagLifecycleFilters();
    }
  }, [subtab, resetFilters, resetFlagLifecycleFilters]);

  const handleToggleDeprecated = useCallback(() => {
    const next = !includeDeprecatedFlags;
    handleToggleIncludeDeprecatedFlags();
    analytics.trackFlagLifecycleFilterChange('deprecated', next);
  }, [includeDeprecatedFlags, handleToggleIncludeDeprecatedFlags, analytics]);

  const handleToggleArchived = useCallback(() => {
    const next = !includeArchivedFlags;
    handleToggleIncludeArchivedFlags();
    analytics.trackFlagLifecycleFilterChange('archived', next);
  }, [includeArchivedFlags, handleToggleIncludeArchivedFlags, analytics]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAnimationComplete = useCallback(() => {
    if (overlayRef.current) {
      const firstButton = overlayRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, []);

  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.04, ease: 'easeOut' }}
      onAnimationComplete={(definition) => {
        if (definition === 'animate') {
          handleAnimationComplete();
        }
      }}
      style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, pointerEvents: 'none' }}
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" style={{ pointerEvents: 'auto' }} />

      <div
        ref={overlayRef}
        className={subtab === 'flags' ? styles.overlayFlags : styles.overlay}
        role="dialog"
        aria-label="Filter options"
        style={{ pointerEvents: 'auto' }}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            disabled={!hasNonDefaultFilters}
            aria-label="Reset filters to default"
          >
            Reset
          </button>
        </div>

        <div className={styles.content} role="group" aria-label="Available filters">
          {config.options.map((option) => (
            <FilterOptionItem
              key={option.id}
              option={option}
              isActive={activeFilters.has(option.id)}
              onToggle={() => handleToggle(option.id)}
            />
          ))}
          {subtab === 'flags' ? (
            <>
              <p className={styles.sectionLabel}>Flag lifecycle</p>
              <FilterOptionItem
                option={FLAG_LIFECYCLE_DEPRECATED}
                isActive={includeDeprecatedFlags}
                onToggle={handleToggleDeprecated}
              />
              <FilterOptionItem
                option={FLAG_LIFECYCLE_ARCHIVED}
                isActive={includeArchivedFlags}
                onToggle={handleToggleArchived}
              />
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
});

export interface FilterButtonProps {
  className?: string;
}

export function FilterButton({ className }: FilterButtonProps) {
  const { activeSubtab } = useActiveSubtabContext();
  const {
    hasFilters,
    hasActiveNonDefaultFilters,
    getActiveFilters,
    isFilterOverlayOpen,
    toggleFilterOverlay,
    closeFilterOverlay,
  } = useFilters();
  const { includeDeprecatedFlags, includeArchivedFlags } = useToolbarState();

  const subtab = activeSubtab as SubTab;

  // Don't render if this subtab doesn't have filters
  if (!hasFilters(subtab)) {
    return null;
  }

  const activeFilters = getActiveFilters(subtab);
  const chipCount = activeFilters.has('all') ? 0 : activeFilters.size;
  const lifecycleCount = subtab === 'flags' ? (includeDeprecatedFlags ? 1 : 0) + (includeArchivedFlags ? 1 : 0) : 0;
  const filterCount = chipCount + lifecycleCount;
  const hasAnyNonDefaultFilters =
    hasActiveNonDefaultFilters(subtab) || (subtab === 'flags' && (includeDeprecatedFlags || includeArchivedFlags));

  return (
    <div className={styles.container}>
      <IconButton icon={<FilterTuneIcon />} label="Filter" onClick={toggleFilterOverlay} className={className} />
      {hasAnyNonDefaultFilters && filterCount > 0 ? (
        <div className={styles.filterCount} aria-label={`${filterCount} filters active`}>
          {filterCount}
        </div>
      ) : null}

      <AnimatePresence>
        {isFilterOverlayOpen ? (
          <FilterOverlayContent key="filter-overlay" subtab={subtab} onClose={closeFilterOverlay} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export { FilterOverlayContent };
