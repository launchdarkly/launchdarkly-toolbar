import { ButtonGroup, Button } from '@launchpad-ui/components';
import { useFlagFilterOptions, type FlagFilterMode, FILTER_MODES } from './useFlagFilterOptions';
import { ClearButton } from './ClearButton';
import { ShareUrlButton } from './ShareUrlButton';
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
  onShareUrl?: () => void;
  isLoading?: boolean;
}

export function FilterOptions(props: FilterOptionsProps) {
  const {
    totalFlags,
    filteredFlags,
    totalOverriddenFlags,
    starredCount,
    onClearOverrides,
    onClearStarred,
    onShareUrl,
    isLoading,
  } = props;
  const { activeFilters, onFilterToggle } = useFlagFilterOptions();

  const isAllActive = activeFilters.has(FILTER_MODES.ALL);
  const isOverridesActive = activeFilters.has(FILTER_MODES.OVERRIDES);
  const isStarredActive = activeFilters.has(FILTER_MODES.STARRED);
  const hasMultipleFilters = activeFilters.size > 1;

  return (
    <div className={styles.container}>
      <ButtonGroup>
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilters.has(filter.id);
          return (
            <Button
              key={filter.id}
              className={styles.filterButton}
              onPress={() => onFilterToggle(filter.id)}
              aria-label={`Show ${filter.label.toLowerCase()} flags`}
              aria-pressed={isActive}
            >
              {filter.label}
            </Button>
          );
        })}
      </ButtonGroup>

      <div className={styles.bottomRow}>
        <div className={styles.statusText}>
          {isAllActive && filteredFlags === totalFlags
            ? `Showing all ${totalFlags} flags`
            : `Showing ${filteredFlags} of ${totalFlags} flags`}
        </div>
        <div className={styles.buttonGroup}>
          {onShareUrl && <ShareUrlButton onClick={onShareUrl} count={totalOverriddenFlags} isLoading={isLoading} />}
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
    </div>
  );
}
