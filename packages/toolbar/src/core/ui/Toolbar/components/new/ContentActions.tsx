import { useCallback } from 'react';
import { SearchIcon, FilterTuneIcon, DeleteIcon } from '../icons';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { usePlugins } from '../../context';
import { useEvents } from '../../hooks';
import { useSearchContext } from '../../context/SearchProvider';
import * as styles from './ContentActions.module.css';

export const ContentActions = () => {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();
  const { eventInterceptionPlugin } = usePlugins();
  const { searchTerm } = useSearchContext();
  const { events } = useEvents(eventInterceptionPlugin, searchTerm);

  // Determine which actions to show based on current tab/subtab
  const showFilter = activeTab === 'flags' && activeSubtab === 'flags';
  const showSearch = true; // All tabs have search
  const showClearEvents = activeTab === 'monitoring' && activeSubtab === 'events';

  const handleClearEvents = useCallback(() => {
    if (eventInterceptionPlugin) {
      eventInterceptionPlugin.clearEvents();
    }
  }, [eventInterceptionPlugin]);

  const handleFilter = useCallback(() => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  }, []);

  const handleSearch = useCallback(() => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  }, []);

  return (
    <div className={styles.container}>
      {showSearch && (
        <button className={styles.actionButton} onClick={handleSearch} aria-label="Search" title="Search">
          <SearchIcon className={styles.icon} />
        </button>
      )}
      {showClearEvents && (
        <button
          className={styles.actionButton}
          onClick={handleClearEvents}
          disabled={events.length === 0}
          aria-label="Clear all events"
          title={`Clear all events (${events.length})`}
        >
          <DeleteIcon className={styles.icon} />
        </button>
      )}
      {showFilter && (
        <button className={styles.actionButton} onClick={handleFilter} aria-label="Filter" title="Filter flags">
          <FilterTuneIcon className={styles.icon} />
        </button>
      )}
    </div>
  );
};
