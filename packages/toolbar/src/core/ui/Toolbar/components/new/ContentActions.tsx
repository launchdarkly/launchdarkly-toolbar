import { useCallback } from 'react';
import { FilterTuneIcon, DeleteIcon, SearchIcon } from '../icons';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { usePlugins } from '../../context';
import { useEvents } from '../../hooks';
import * as styles from './ContentActions.module.css';
import { SearchSection } from '../SearchSection';
import { useTabSearchContext } from './context/TabSearchProvider';
import { useState } from 'react';
import { IconButton } from '../../../Buttons/IconButton';
import { useMemo } from 'react';
import { TabId } from '../../types';

export const ContentActions = () => {
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
};
