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
import { CancelCircleIcon, DeleteIcon, SearchIcon, SyncIcon, AddIcon, ShareIcon } from '../icons';
import { SearchSection } from './SearchSection';
import { FilterButton } from './FilterOverlay';
import { IconButton } from '../../../Buttons/IconButton';
import { Tooltip } from './Tooltip';
import { ShareStatePopover, type ShareStateOptions } from '../ShareStatePopover';
import { SubTab } from './types';
import { serializeToolbarState, SHARED_STATE_VERSION, MAX_STATE_SIZE_LIMIT } from '../../../../utils/urlOverrides';
import { loadContexts, loadActiveContext, loadAllSettings, loadStarredFlags } from '../../utils/localStorage';
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
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

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
  const showShare = activeTab === 'flags' && activeSubtab === 'flags';

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

  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharePopoverOpen((prev) => !prev);
  }, []);

  const handleShare = useCallback(
    (options: ShareStateOptions) => {
      try {
        // Gather overrides based on mode
        let overrides: Record<string, any> = {};

        if (options.includeFlagOverrides) {
          if (mode === 'sdk' && flagOverridePlugin) {
            // SDK mode: get overrides from plugin
            overrides = flagOverridePlugin.getAllOverrides();
          } else if (mode === 'dev-server') {
            // Dev server mode: get overridden flags from dev server state
            Object.entries(state.flags).forEach(([flagKey, flag]) => {
              if (flag.isOverridden) {
                overrides[flagKey] = flag.currentValue;
              }
            });
          }
        }

        // Gather all toolbar state based on selected options
        const toolbarState = {
          version: SHARED_STATE_VERSION,
          overrides: options.includeFlagOverrides ? overrides : {},
          contexts: options.includeContexts ? loadContexts() : [],
          activeContext: options.includeContexts ? loadActiveContext() : null,
          settings: options.includeSettings ? loadAllSettings() : {},
          starredFlags: options.includeFlagOverrides ? Array.from(loadStarredFlags()) : [],
        };

        // Serialize the state
        const result = serializeToolbarState(toolbarState);

        // Check size limits
        if (result.exceedsLimit) {
          console.error(
            `Shared state is too large (${result.size} chars, limit: ${MAX_STATE_SIZE_LIMIT}). Cannot create shareable link.`,
          );
          alert(
            `The toolbar state is too large to share (${result.size} characters). Try reducing the number of overrides, contexts, or starred flags.`,
          );
          return;
        }

        if (result.exceedsWarning) {
          console.warn(
            `Shared state is large (${result.size} chars). Some browsers may have issues with URLs this long.`,
          );
        }

        // Copy to clipboard
        navigator.clipboard
          .writeText(result.url)
          .then(() => {
            console.log('Share URL copied to clipboard:', result.url);
            analytics.trackShareState({
              includeSettings: options.includeSettings,
              overrideCount: Object.keys(overrides).length,
              contextCount: toolbarState.contexts.length,
              starredFlagCount: toolbarState.starredFlags.length,
            });
          })
          .catch((error) => {
            console.error('Failed to copy share URL:', error);
            alert('Failed to copy URL to clipboard. Please copy it manually from the console.');
          });
      } catch (error) {
        console.error('Failed to create share URL:', error);
        alert('Failed to create shareable link. Check console for details.');
      }
    },
    [mode, flagOverridePlugin, state.flags, analytics],
  );

  // Calculate counts for the dialog
  const overrideCount = useMemo(() => {
    if (mode === 'sdk' && flagOverridePlugin) {
      return Object.keys(flagOverridePlugin.getAllOverrides()).length;
    } else if (mode === 'dev-server') {
      return Object.values(state.flags).filter((flag) => flag.isOverridden).length;
    }
    return 0;
  }, [mode, flagOverridePlugin, state.flags]);

  const contextCount = useMemo(() => {
    return loadContexts().length;
  }, []);

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
      {showFilter && <FilterButton />}
      {showShare && (
        <div style={{ position: 'relative' }}>
          <IconButton icon={<ShareIcon />} label="Share state" onClick={handleShareClick} />
          <ShareStatePopover
            isOpen={isSharePopoverOpen}
            onClose={() => setIsSharePopoverOpen(false)}
            onShare={handleShare}
            overrideCount={overrideCount}
            contextCount={contextCount}
          />
        </div>
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
