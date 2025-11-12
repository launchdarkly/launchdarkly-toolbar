import { useFlagFilterOptions, type FlagFilterMode, FILTER_MODES } from './useFlagFilterOptions';
import { ClearButton } from './ClearButton';
import * as styles from './FilterOptions.css';

const FILTER_OPTIONS = [
  { id: FILTER_MODES.ALL, label: 'All' },
  { id: FILTER_MODES.OVERRIDES, label: 'Overrides' },
  { id: FILTER_MODES.STARRED, label: 'Starred' },
] satisfies { id: FlagFilterMode; label: string }[];

export interface FilterOptionsProps {
  totalFlags: number;
  filteredFlags: number;
  totalOverriddenFlags: number;
  starredCount: number;
  onClearOverrides?: () => void;
  onClearStarred?: () => void;
  isLoading?: boolean;
}

export function FilterOptions(props: FilterOptionsProps) {
  const { totalFlags, filteredFlags, totalOverriddenFlags, starredCount, onClearOverrides, onClearStarred, isLoading } =
    props;
  const { activeFilters, onFilterToggle } = useFlagFilterOptions();

  const isAllActive = activeFilters.has(FILTER_MODES.ALL);
  const isOverridesActive = activeFilters.has(FILTER_MODES.OVERRIDES);
  const isStarredActive = activeFilters.has(FILTER_MODES.STARRED);
  const hasMultipleFilters = activeFilters.size > 1;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilters.has(filter.id);
          return (
            <button
              key={filter.id}
              className={`${styles.option} ${isActive ? styles.activeOption : ''}`}
              onClick={() => onFilterToggle(filter.id)}
              data-active={isActive}
              aria-label={`Show ${filter.label.toLowerCase()} flags`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.statusText}>
          {isAllActive && filteredFlags === totalFlags
            ? `Showing all ${totalFlags} flags`
            : `Showing ${filteredFlags} of ${totalFlags} flags`}
        </div>
        {!hasMultipleFilters && isOverridesActive && totalOverriddenFlags > 0 && onClearOverrides && (
          <ClearButton
            label="Overrides"
            count={totalOverriddenFlags}
            onClick={onClearOverrides}
            isLoading={isLoading}
          />
        )}
        {!hasMultipleFilters && isStarredActive && starredCount > 0 && onClearStarred && (
          <ClearButton label="Starred" count={starredCount} onClick={onClearStarred} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
