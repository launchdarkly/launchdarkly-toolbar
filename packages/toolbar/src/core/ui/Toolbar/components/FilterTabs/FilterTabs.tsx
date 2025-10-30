import { useFilterTabsContext, type FilterMode } from './useFilterTabsContext';
import { ClearButton } from './ClearButton';
import * as styles from './FilterTabs.css';

const FILTER_TABS = [
  { id: 'all' as const, label: 'All' },
  { id: 'overrides' as const, label: 'Overrides' },
  { id: 'starred' as const, label: 'Starred' },
] satisfies { id: FilterMode; label: string }[];

interface FilterTabsProps {
  totalFlags: number;
  filteredFlags: number;
  totalOverriddenFlags: number;
  starredCount: number;
  onClearOverrides?: () => void;
  onClearStarred?: () => void;
  isLoading?: boolean;
}

export function FilterTabs(props: FilterTabsProps) {
  const { totalFlags, filteredFlags, totalOverriddenFlags, starredCount, onClearOverrides, onClearStarred, isLoading } =
    props;
  const { activeFilter, onFilterChange } = useFilterTabsContext();

  const isAllActive = activeFilter === 'all';
  const isOverridesActive = activeFilter === 'overrides';
  const isStarredActive = activeFilter === 'starred';

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {FILTER_TABS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
              onClick={() => onFilterChange(filter.id)}
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
        {isOverridesActive && totalOverriddenFlags > 0 && onClearOverrides && (
          <ClearButton label="Overrides" count={totalOverriddenFlags} onClick={onClearOverrides} isLoading={isLoading} />
        )}
        {isStarredActive && starredCount > 0 && onClearStarred && (
          <ClearButton label="Starred" count={starredCount} onClick={onClearStarred} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
