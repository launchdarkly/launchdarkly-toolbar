import { useState, useRef, useCallback, useMemo, useEffect, Dispatch, SetStateAction, useContext } from 'react';

import { useSearchContext } from '../context/SearchProvider';
import { useAnalytics } from '../context/AnalyticsProvider';
import { TabId, ActiveTabId, TAB_ORDER } from '../types';
import { saveToolbarPinned, loadToolbarPinned } from '../utils/localStorage';
import ShadowRootContext from '../../../context/ShadowRootContext';

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
  isPinned: boolean;

  // Refs
  toolbarRef: React.RefObject<HTMLDivElement | null>;

  // Handlers
  handleTabChange: (tabId: string) => void;
  handleClose: () => void;
  handleSearch: (newSearchTerm: string) => void;
  handleTogglePin: () => void;
  handleCircleClick: () => void;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export function useToolbarState(props: UseToolbarStateProps): UseToolbarStateReturn {
  const shadowRoot = useContext(ShadowRootContext);
  const { defaultActiveTab, domId } = props;
  const { setSearchTerm } = useSearchContext();
  const analytics = useAnalytics();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabId>();
  const [previousTab, setPreviousTab] = useState<ActiveTabId>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchIsExpanded, setSearchIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(() => loadToolbarPinned());

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

      setSearchIsExpanded(false);
      setSearchTerm('');

      const newTabId = tabId as TabId;

      // If clicking the currently active tab, toggle the toolbar
      if (newTabId === activeTab && isExpanded) {
        // Track toolbar collapse from tab toggle
        analytics.trackToolbarToggle('collapse', 'tab_toggle');
        setIsExpanded(false);
        return;
      }

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
    setIsPinned(false);
    saveToolbarPinned(false);
  }, [analytics]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
    },
    [setSearchTerm],
  );

  const handleTogglePin = useCallback(() => {
    setIsPinned((prev) => {
      const newValue = !prev;
      saveToolbarPinned(newValue);
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

  // Handle click outside to close toolbar (only when not pinned)
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      // Toolbar clicks will all register at the root of the Shadow DOM,
      // so check to make sure that's the target. If not, the user clicked
      // outside
      const node = event.target as HTMLElement;
      if (isExpanded && !isPinned && node.id !== domId) {
        // Track toolbar collapse from click outside
        analytics.trackToolbarToggle('collapse', 'click_outside');
        setIsExpanded(false);
      }
    };

    shadowRoot.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      shadowRoot.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isPinned, analytics]);

  return {
    // State values
    isExpanded,
    activeTab,
    previousTab,
    isAnimating,
    searchIsExpanded,
    slideDirection,
    hasBeenExpanded: hasBeenExpandedRef.current,
    isPinned,

    // Refs
    toolbarRef,

    // Handlers
    handleTabChange,
    handleClose,
    handleSearch,
    handleTogglePin,
    handleCircleClick,
    setIsAnimating,
    setSearchIsExpanded,
  };
}
