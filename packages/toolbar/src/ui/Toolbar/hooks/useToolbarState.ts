import { useState, useRef, useCallback, useMemo, useEffect, Dispatch, SetStateAction } from 'react';

import { useSearchContext } from '../context/SearchProvider';
import { TabId, ActiveTabId, TAB_ORDER } from '../types';
import { saveToolbarPinned, loadToolbarPinned } from '../utils/localStorage';

export interface UseToolbarStateProps {
  defaultActiveTab: ActiveTabId;
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
  const { defaultActiveTab } = props;
  const { setSearchTerm } = useSearchContext();

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
        setIsExpanded(false);
        return;
      }

      setPreviousTab(activeTab);
      setActiveTab(newTabId);

      if (!isExpanded) {
        setIsExpanded(true);
      }
    },
    [activeTab, isExpanded, setSearchTerm, isAnimating],
  );

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setIsPinned(false);
    saveToolbarPinned(false);
  }, []);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !isPinned && toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isPinned]);

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
