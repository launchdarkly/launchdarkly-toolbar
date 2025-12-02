import { useCallback, useState, useMemo } from 'react';

import { useActiveTabContext, usePlugins } from '../../context';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { useTabSearchContext } from './context/TabSearchProvider';
import { useEvents } from '../../hooks';
import { FilterTuneIcon, DeleteIcon, SearchIcon } from '../icons';
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

  const handleSearch = useCallback(
    (input: string) => {
      if (!activeTab) return;
      setSearchTerm(activeTab, input);
    },
    [activeTab, searchTerm, setSearchTerm],
  );

  return (
    <div className={styles.container}>
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
