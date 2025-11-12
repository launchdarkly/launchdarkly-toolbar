import { useState, useRef, useCallback, useMemo, useEffect, Dispatch, SetStateAction } from 'react';

import { useSearchContext } from '../context/SearchProvider';
import { useAnalytics } from '../context/AnalyticsProvider';
import { TabId, ActiveTabId, TAB_ORDER } from '../types';
import {
  saveToolbarAutoCollapse,
  loadToolbarAutoCollapse,
  loadReloadOnFlagChange,
  saveReloadOnFlagChange,
  loadOptInToNewFeatures,
  saveOptInToNewFeatures,
} from '../utils/localStorage';

export interface UseToolbarStateProps {
  defaultActiveTab: ActiveTabId;
  domId: string;
}

export interface UseToolbarStateReturn {
  // State values
  isExpanded: boolean;
  activeTab: ActiveTabId;
  previousTab: ActiveTabId;
  isAnimating: boolean;
  searchIsExpanded: boolean;
  slideDirection: number;
  hasBeenExpanded: boolean;
  reloadOnFlagChangeIsEnabled: boolean;
  isAutoCollapseEnabled: boolean;
  optInToNewFeatures: boolean;

  // Refs
  toolbarRef: React.RefObject<HTMLDivElement | null>;

  // Handlers
  handleTabChange: (tabId: string) => void;
  handleClose: () => void;
  handleSearch: (newSearchTerm: string) => void;
  handleToggleReloadOnFlagChange: () => void;
  handleToggleAutoCollapse: () => void;
  handleToggleOptInToNewFeatures: () => void;
  handleCircleClick: () => void;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export function useToolbarState(props: UseToolbarStateProps): UseToolbarStateReturn {
  const { defaultActiveTab, domId } = props;
  const { setSearchTerm } = useSearchContext();
  const analytics = useAnalytics();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabId>();
  const [previousTab, setPreviousTab] = useState<ActiveTabId>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchIsExpanded, setSearchIsExpanded] = useState(false);
  const [reloadOnFlagChangeIsEnabled, enableReloadOnFlagChange] = useState(() => loadReloadOnFlagChange());
  const [isAutoCollapseEnabled, setAutoCollapse] = useState(() => loadToolbarAutoCollapse());
  const [optInToNewFeatures, setOptInToNewFeatures] = useState(() => loadOptInToNewFeatures());
  // Refs
  const hasBeenExpandedRef = useRef(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const slideDirection = useMemo(() => {
    if (!activeTab || !previousTab) return 1; // Default direction when no tab is selected
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const previousIndex = TAB_ORDER.indexOf(previousTab);
    return currentIndex > previousIndex ? 1 : -1; // 1 = slide left, -1 = slide right
  }, [activeTab, previousTab]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      // Prevent tab changes during container expansion/collapse animation
      if (isAnimating) return;

      const newTabId = tabId as TabId;

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

      setPreviousTab(activeTab);
      setActiveTab(newTabId);

      if (!isExpanded) {
        setIsExpanded(true);
      }
    },
    [activeTab, isExpanded, setSearchTerm, isAnimating, analytics],
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

  const handleToggleOptInToNewFeatures = useCallback(() => {
    setOptInToNewFeatures((prev) => {
      const newValue = !prev;
      saveOptInToNewFeatures(newValue);
      return newValue;
    });
  }, []);

  const handleCircleClick = useCallback(() => {
    if (!isExpanded) {
      // Only set default tab if no tab is currently selected
      if (!activeTab) {
        setActiveTab(defaultActiveTab);
      }
      setIsExpanded(true);
    }
  }, [isExpanded, activeTab, defaultActiveTab]);

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

    // shadowRoot.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // shadowRoot.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isAutoCollapseEnabled, analytics, domId]);

  return {
    // State values
    isExpanded,
    activeTab,
    previousTab,
    isAnimating,
    searchIsExpanded,
    slideDirection,
    hasBeenExpanded: hasBeenExpandedRef.current,
    reloadOnFlagChangeIsEnabled,
    isAutoCollapseEnabled,
    optInToNewFeatures,

    // Refs
    toolbarRef,

    // Handlers
    handleTabChange,
    handleClose,
    handleSearch,
    handleToggleReloadOnFlagChange,
    handleToggleAutoCollapse,
    handleToggleOptInToNewFeatures,
    handleCircleClick,
    setIsAnimating,
    setSearchIsExpanded,
  };
}
