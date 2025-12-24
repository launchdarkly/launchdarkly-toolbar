import { useCallback, useState, useMemo, useEffect } from 'react';
import {
  useActiveTabContext,
  useDevServerContext,
  useElementSelection,
  usePlugins,
  useToolbarState,
  useFlagsContext,
} from '../../context';
import { useActiveSubtabContext, useTabSearchContext } from './context';
import { useContextsContext } from '../../context/api/ContextsProvider';
import { useEvents } from '../../hooks';
import { useAnalytics } from '../../context/telemetry/AnalyticsProvider';
import { CancelCircleIcon, DeleteIcon, SearchIcon, SyncIcon, AddIcon } from '../icons';
import { SearchSection } from './SearchSection';
import { FilterButton } from './FilterOverlay';
import { IconButton } from '../../../Buttons/IconButton';
import { Tooltip } from './Tooltip';
import { SubTab } from './types';
import * as styles from './ContentActions.module.css';

export function ContentActions() {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();
  const { eventInterceptionPlugin } = usePlugins();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms[activeSubtab as SubTab] || '', [searchTerms, activeSubtab]);
  const { events } = useEvents(eventInterceptionPlugin, searchTerm);
  const { setSearchTerm } = useTabSearchContext();
  const [searchIsExpanded, setSearchIsExpanded] = useState(false);
  const analytics = useAnalytics();

  // Update search expansion when subtab changes
  // Expand if the new subtab has a search term, collapse if it doesn't
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchIsExpanded(true);
    }
  }, [activeSubtab, searchTerm]);

  const { selectedElement, clearSelection } = useElementSelection();

  // Determine which actions to show based on current tab/subtab
  // Only show clear button for interactive when element is selected
  const showClearSelection = activeTab === 'interactive' && selectedElement;
  const { mode } = useToolbarState();
  const { refresh, state } = useDevServerContext();
  const { refreshFlags, loading: flagsLoading } = useFlagsContext();
  const { setIsAddFormOpen, clearContexts, contexts } = useContextsContext();
  const { flagOverridePlugin } = usePlugins();
  const { clearAllOverrides } = useDevServerContext();

  const showFilter =
    (activeTab === 'flags' && activeSubtab === 'flags') || (activeTab === 'monitoring' && activeSubtab === 'events');

  const showSearch = activeTab !== 'interactive' && activeSubtab !== undefined; // Hide search for interactive tab

  const showClearEvents = activeTab === 'monitoring' && activeSubtab === 'events';
  const showSync = mode === 'dev-server' && activeTab === 'flags' && activeSubtab === 'flags';
  const showAddContext = activeTab === 'flags' && activeSubtab === 'contexts';
  const showClearContexts = activeTab === 'flags' && activeSubtab === 'contexts';
  const showClearOverrides = activeTab === 'flags' && activeSubtab === 'flags';

  const showRefreshFlags = mode === 'sdk' && activeTab === 'flags' && activeSubtab === 'flags';

  // Determine search dropdown position based on active tab/subtab
  const getSearchDropdownClass = () => {
    if (activeTab === 'settings') return styles.searchDropdownLeft;
    if (activeTab === 'flags' && activeSubtab === 'flags') return styles.searchDropdownFlags;
    return styles.searchDropdown;
  };

  const handleClearEvents = useCallback(() => {
    if (eventInterceptionPlugin) {
      eventInterceptionPlugin.clearEvents();
      analytics.trackClearEvents();
    }
  }, [eventInterceptionPlugin, analytics]);

  const handleSync = useCallback(() => {
    refresh();
    analytics.trackRefresh();
  }, [refresh, analytics]);

  const handleRefreshFlags = useCallback(() => {
    refreshFlags();
  }, [refreshFlags]);

  const handleSearch = useCallback(
    (input: string) => {
      if (!activeSubtab) return;
      setSearchTerm(activeSubtab as SubTab, input);
      analytics.trackSearch(input);
    },
    [activeSubtab, setSearchTerm, analytics],
  );

  const handleClearContexts = useCallback(() => {
    clearContexts();
  }, []);

  const handleClearOverrides = useCallback(() => {
    if (mode === 'dev-server') {
      clearAllOverrides();
    } else {
      flagOverridePlugin?.clearAllOverrides();
    }
  }, [flagOverridePlugin]);

  return (
    <div className={styles.container}>
      {showClearSelection && (
        <Tooltip content="Clear selection" offsetTop={-4} offsetLeft={2}>
          <button className={styles.clearButton} onClick={clearSelection} aria-label="Clear selection">
            <CancelCircleIcon className={styles.icon} />
          </button>
        </Tooltip>
      )}
      {showSearch && (
        <div className={styles.searchContainer}>
          <Tooltip content="Search" offsetTop={-4} offsetLeft={1}>
            <IconButton icon={<SearchIcon />} label="Search" onClick={() => setSearchIsExpanded(!searchIsExpanded)} />
          </Tooltip>
          {searchIsExpanded && (
            <div className={getSearchDropdownClass()}>
              <SearchSection
                key={activeSubtab} // Force remount when subtab changes to ensure correct value
                searchTerm={searchTerm}
                onSearch={handleSearch}
                setSearchIsExpanded={setSearchIsExpanded}
              />
            </div>
          )}
        </div>
      )}
      {showAddContext && setIsAddFormOpen && (
        <Tooltip content="Add context" offsetTop={-4} offsetLeft={2}>
          <IconButton icon={<AddIcon />} label="Add context" onClick={() => setIsAddFormOpen(true)} />
        </Tooltip>
      )}
      {showFilter && (
        <Tooltip content={`Filter ${activeSubtab.charAt(0).toUpperCase() + activeSubtab.slice(1)}`} offsetTop={-4}>
          <FilterButton />
        </Tooltip>
      )}
      {showSync && (
        <Tooltip content="Sync flags" offsetTop={-4} offsetLeft={2}>
          <IconButton icon={<SyncIcon />} label="Sync flags" onClick={handleSync} disabled={state.isLoading} />
        </Tooltip>
      )}
      {showRefreshFlags && (
        <Tooltip content="Refresh flags" offsetTop={-4}>
          <IconButton icon={<SyncIcon />} label="Refresh flags" onClick={handleRefreshFlags} disabled={flagsLoading} />
        </Tooltip>
      )}
      {showClearEvents && (
        <Tooltip content="Clear all events" offsetTop={-4}>
          <button
            className={styles.actionButton}
            onClick={handleClearEvents}
            disabled={events.length === 0}
            aria-label="Clear all events"
          >
            <DeleteIcon className={styles.icon} />
          </button>
        </Tooltip>
      )}
      {showClearContexts && (
        <Tooltip content="Clear contexts" offsetTop={-4}>
          <button
            disabled={contexts.length === 1}
            className={styles.actionButton}
            onClick={handleClearContexts}
            aria-label="Clear contexts"
          >
            <DeleteIcon className={styles.icon} />
          </button>
        </Tooltip>
      )}
      {showClearOverrides && (
        <Tooltip content="Clear overrides" offsetTop={-4}>
          <button className={styles.actionButton} onClick={handleClearOverrides} aria-label="Clear overrides">
            <DeleteIcon className={styles.icon} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
