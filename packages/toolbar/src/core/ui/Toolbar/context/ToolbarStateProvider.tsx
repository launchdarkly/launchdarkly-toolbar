import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';

import { useSearchContext } from './SearchProvider';
import { useAnalytics } from './AnalyticsProvider';
import { useActiveTabContext } from './ActiveTabProvider';
import { TabId, ActiveTabId, TAB_ORDER, ToolbarMode, getToolbarMode } from '../types';
import {
  saveToolbarAutoCollapse,
  loadToolbarAutoCollapse,
  loadReloadOnFlagChange,
  saveReloadOnFlagChange,
} from '../utils/localStorage';

export interface ToolbarStateContextValue {
  // State values
  isExpanded: boolean;
  previousTab: ActiveTabId;
  isAnimating: boolean;
  searchIsExpanded: boolean;
  slideDirection: number;
  hasBeenExpanded: boolean;
  reloadOnFlagChangeIsEnabled: boolean;
  isAutoCollapseEnabled: boolean;
  mode: ToolbarMode;

  // Refs
  toolbarRef: React.RefObject<HTMLDivElement | null>;

  // Handlers
  handleTabChange: (tabId: string) => void;
  handleClose: () => void;
  handleSearch: (newSearchTerm: string) => void;
  handleToggleReloadOnFlagChange: () => void;
  handleToggleAutoCollapse: () => void;
  handleCircleClick: () => void;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const ToolbarStateContext = createContext<ToolbarStateContextValue | undefined>(undefined);

export interface ToolbarStateProviderProps {
  children: ReactNode;
  domId: string;
  devServerUrl?: string;
}

export function ToolbarStateProvider({ children, domId, devServerUrl }: ToolbarStateProviderProps) {
  const { setSearchTerm } = useSearchContext();
  const analytics = useAnalytics();
  const { activeTab, setActiveTab } = useActiveTabContext();

  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousTab, setPreviousTab] = useState<ActiveTabId>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchIsExpanded, setSearchIsExpanded] = useState(false);
  const [reloadOnFlagChangeIsEnabled, enableReloadOnFlagChange] = useState(() => loadReloadOnFlagChange());
  const [isAutoCollapseEnabled, setAutoCollapse] = useState(() => loadToolbarAutoCollapse());
  const [mode] = useState<ToolbarMode>(() => getToolbarMode(devServerUrl));

  // Refs
  const hasBeenExpandedRef = useRef(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  // Computed values
  const slideDirection = useMemo(() => {
    if (!activeTab || !previousTab) return 1; // Default direction when no tab is selected
    const currentIndex = TAB_ORDER.indexOf(activeTab as TabId);
    const previousIndex = TAB_ORDER.indexOf(previousTab);
    return currentIndex > previousIndex ? 1 : -1; // 1 = slide left, -1 = slide right
  }, [activeTab, previousTab]);

  // Handlers
  const handleTabChange = useCallback(
    (tabId: string) => {
      // Prevent tab changes during container expansion/collapse animation
      if (isAnimating) return;

      const newTabId = tabId as TabId;
      console.log('newTabId', newTabId);

      // If clicking the currently active tab, toggle the toolbar
      if (newTabId === activeTab && isExpanded) {
        // Track toolbar collapse from tab toggle
        analytics.trackToolbarToggle('collapse', 'tab_toggle');
        setIsExpanded(false);
        return;
      }

      // Only clear search when actually changing tabs
      setSearchIsExpanded(false);
      setSearchTerm('');

      // Track tab change analytics
      analytics.trackTabChange(activeTab || null, newTabId);

      setPreviousTab(activeTab as ActiveTabId);
      setActiveTab(newTabId);

      if (!isExpanded) {
        setIsExpanded(true);
      }
    },
    [activeTab, isExpanded, setSearchTerm, isAnimating, analytics, setActiveTab],
  );

  const handleClose = useCallback(() => {
    // Track toolbar collapse from close button
    analytics.trackToolbarToggle('collapse', 'close_button');

    setIsExpanded(false);
    setAutoCollapse(false);
    saveToolbarAutoCollapse(false);
  }, [analytics]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
    },
    [setSearchTerm],
  );

  const handleToggleAutoCollapse = useCallback(() => {
    setAutoCollapse((prev) => {
      const newValue = !prev;
      saveToolbarAutoCollapse(newValue);
      return newValue;
    });
  }, []);

  const handleToggleReloadOnFlagChange = useCallback(() => {
    enableReloadOnFlagChange((prev) => {
      const newValue = !prev;
      saveReloadOnFlagChange(newValue);
      return newValue;
    });
  }, []);

  const handleCircleClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  // Effects
  // Update hasBeenExpanded ref when toolbar shows
  useEffect(() => {
    if (isExpanded) {
      hasBeenExpandedRef.current = true;
    }
  }, [isExpanded]);

  // Handle click outside to close toolbar (only when auto-collapse is enabled)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      /**
       * composedPath() is used to reliably detect clicks across Shadow DOM boundaries.
       * It provides the full event path including shadow DOM internals, allowing us to
       * reliably detect whether a click occurred inside the toolbar.
       */
      const path = event.composedPath();
      const clickedInsideToolbar = path.some((el) => (el as HTMLElement).id === domId);

      if (isExpanded && isAutoCollapseEnabled && toolbarRef.current && !clickedInsideToolbar) {
        // Track toolbar collapse from click outside
        analytics.trackToolbarToggle('collapse', 'click_outside');
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isAutoCollapseEnabled, analytics, domId]);

  const value = useMemo<ToolbarStateContextValue>(
    () => ({
      // State values
      isExpanded,
      previousTab,
      isAnimating,
      searchIsExpanded,
      slideDirection,
      hasBeenExpanded: hasBeenExpandedRef.current,
      reloadOnFlagChangeIsEnabled,
      isAutoCollapseEnabled,
      mode,

      // Refs
      toolbarRef,

      // Handlers
      handleTabChange,
      handleClose,
      handleSearch,
      handleToggleReloadOnFlagChange,
      handleToggleAutoCollapse,
      handleCircleClick,
      setIsAnimating,
      setSearchIsExpanded,
    }),
    [
      isExpanded,
      previousTab,
      isAnimating,
      searchIsExpanded,
      slideDirection,
      reloadOnFlagChangeIsEnabled,
      isAutoCollapseEnabled,
      handleTabChange,
      handleClose,
      handleSearch,
      handleToggleReloadOnFlagChange,
      handleToggleAutoCollapse,
      handleCircleClick,
    ],
  );

  return <ToolbarStateContext.Provider value={value}>{children}</ToolbarStateContext.Provider>;
}

export function useToolbarState(): ToolbarStateContextValue {
  const context = useContext(ToolbarStateContext);
  if (context === undefined) {
    throw new Error('useToolbarState must be used within a ToolbarStateProvider');
  }
  return context;
}
