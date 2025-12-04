import { useCallback } from 'react';
import { SearchIcon, FilterTuneIcon, DeleteIcon, CancelCircleIcon } from '../icons';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { usePlugins } from '../../context';
import { useEvents } from '../../hooks';
import { useSearchContext } from '../../context/SearchProvider';
import { useElementSelection } from '../../context/ElementSelectionProvider';
import * as styles from './ContentActions.module.css';
import { useAnalytics } from '../../context/AnalyticsProvider';

export const ContentActions = () => {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();
  const { eventInterceptionPlugin } = usePlugins();
  const { searchTerm } = useSearchContext();
  const { events } = useEvents(eventInterceptionPlugin, searchTerm);
  const analytics = useAnalytics();
  const { selectedElement, clearSelection } = useElementSelection();

  // Determine which actions to show based on current tab/subtab
  const showFilter = activeTab === 'flags' && activeSubtab === 'flags';
  const showSearch = activeTab !== 'interactive'; // Hide search for interactive tab
  const showClearEvents = activeTab === 'monitoring' && activeSubtab === 'events';
  // Only show clear button for interactive when element is selected
  const showClearSelection = activeTab === 'interactive' && selectedElement;

  const handleClearEvents = useCallback(() => {
    if (eventInterceptionPlugin) {
      analytics.trackClearEvents();
      eventInterceptionPlugin.clearEvents();
    }
  }, [eventInterceptionPlugin, analytics]);

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
      {showClearSelection && (
        <button
          className={styles.clearButton}
          onClick={clearSelection}
          aria-label="Clear selection"
          title="Clear selection"
        >
          <CancelCircleIcon className={styles.icon} />
        </button>
      )}
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
