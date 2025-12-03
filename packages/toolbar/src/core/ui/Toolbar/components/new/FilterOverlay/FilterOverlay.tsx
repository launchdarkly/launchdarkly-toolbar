import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useFilters, FilterOption } from '../context/FiltersProvider';
import { useActiveSubtabContext } from '../context/ActiveSubtabProvider';
import { SubTab } from '../types';
import { IconButton } from '../../../../Buttons/IconButton';
import { CheckIcon, FilterTuneIcon } from '../../icons';
import * as styles from './FilterOverlay.module.css';

interface FilterOptionItemProps {
  option: FilterOption;
  isActive: boolean;
  onToggle: () => void;
}

function FilterOptionItem({ option, isActive, onToggle }: FilterOptionItemProps) {
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
        {option.description && <span className={styles.filterDescription}>{option.description}</span>}
      </div>
    </button>
  );
}

interface FilterOverlayContentProps {
  subtab: SubTab;
  onClose: () => void;
}

function FilterOverlayContent({ subtab, onClose }: FilterOverlayContentProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { getActiveFilters, getFilterConfig, toggleFilter, resetFilters, hasActiveNonDefaultFilters } = useFilters();

  const config = getFilterConfig(subtab);
  const activeFilters = getActiveFilters(subtab);
  const hasNonDefaultFilters = hasActiveNonDefaultFilters(subtab);

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

  // Focus trap and auto-focus first option
  useEffect(() => {
    if (overlayRef.current) {
      const firstButton = overlayRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, []);

  if (!config) return null;

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={overlayRef}
        className={styles.overlay}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        role="dialog"
        aria-label="Filter options"
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          <button
            className={styles.resetButton}
            onClick={() => resetFilters(subtab)}
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
              onToggle={() => toggleFilter(subtab, option.id)}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}

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

  const subtab = activeSubtab as SubTab;

  // Don't render if this subtab doesn't have filters
  if (!hasFilters(subtab)) {
    return null;
  }

  const hasActiveFilters = hasActiveNonDefaultFilters(subtab);
  const activeFilters = getActiveFilters(subtab);
  // Count filters, excluding 'all' since it's the default
  const filterCount = activeFilters.has('all') ? 0 : activeFilters.size;

  return (
    <div className={styles.container}>
      <IconButton
        icon={<FilterTuneIcon />}
        label="Filter"
        onClick={toggleFilterOverlay}
        className={className}
        aria-expanded={isFilterOverlayOpen}
        aria-haspopup="dialog"
      />
      {hasActiveFilters && filterCount > 0 && (
        <div className={styles.filterCount} aria-label={`${filterCount} filters active`}>
          {filterCount}
        </div>
      )}

      <AnimatePresence>
        {isFilterOverlayOpen && <FilterOverlayContent subtab={subtab} onClose={closeFilterOverlay} />}
      </AnimatePresence>
    </div>
  );
}

export { FilterOverlayContent };
