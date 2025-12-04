import { useCallback, useState, useMemo } from 'react';
import { useActiveTabContext, usePlugins, useElementSelection } from '../../context';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { useTabSearchContext } from './context/TabSearchProvider';
import { useEvents } from '../../hooks';
import { FilterTuneIcon, DeleteIcon, SearchIcon, CancelCircleIcon } from '../icons';
import { SearchSection } from './SearchSection';
import { IconButton } from '../../../Buttons/IconButton';
import { TabId } from '../../types';
import * as styles from './ContentActions.module.css';

export function ContentActions() {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();
  const { eventInterceptionPlugin } = usePlugins();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms[activeTab as TabId] || '', [searchTerms, activeTab]);
  const { events } = useEvents(eventInterceptionPlugin, searchTerm);
  const { setSearchTerm } = useTabSearchContext();
  const [searchIsExpanded, setSearchIsExpanded] = useState(false);
  const { selectedElement, clearSelection } = useElementSelection();

  // Determine which actions to show based on current tab/subtab
  const showFilter = activeTab === 'flags' && activeSubtab === 'flags';
  const showSearch = activeTab !== 'interactive'; // Hide search for interactive tab
  const showClearEvents = activeTab === 'monitoring' && activeSubtab === 'events';
  // Only show clear button for interactive when element is selected
  const showClearSelection = activeTab === 'interactive' && selectedElement;

  const handleClearEvents = useCallback(() => {
    if (eventInterceptionPlugin) {
      eventInterceptionPlugin.clearEvents();
    }
  }, [eventInterceptionPlugin]);

  const handleFilter = useCallback(() => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  }, []);

  const handleSearch = useCallback(
    (input: string) => {
      if (!activeTab) return;
      setSearchTerm(activeTab, input);
    },
    [activeTab, setSearchTerm],
  );

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
        <>
          {searchIsExpanded && (
            <SearchSection searchTerm={searchTerm} onSearch={handleSearch} setSearchIsExpanded={setSearchIsExpanded} />
          )}
          {!searchIsExpanded && (
            <IconButton icon={<SearchIcon />} label="Search" onClick={() => setSearchIsExpanded(true)} />
          )}
        </>
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
}
