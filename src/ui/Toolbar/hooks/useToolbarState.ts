import { useState, useRef, useCallback, useMemo, useEffect, Dispatch, SetStateAction } from 'react';

import { useSearchContext } from '../context/SearchProvider';
import { TabId, ActiveTabId, TAB_ORDER } from '../types';

export interface UseToolbarStateReturn {
  // State values
  isExpanded: boolean;
  isHovered: boolean;
  activeTab: ActiveTabId;
  previousTab: ActiveTabId;
  isAnimating: boolean;
  searchIsExpanded: boolean;
  showFullToolbar: boolean;
  slideDirection: number;
  hasBeenExpanded: boolean;

  // Refs
  toolbarRef: React.RefObject<HTMLDivElement | null>;

  // Handlers
  handleTabChange: (tabId: string) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClose: () => void;
  handleSearch: (newSearchTerm: string) => void;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export function useToolbarState(): UseToolbarStateReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabId>();
  const [previousTab, setPreviousTab] = useState<ActiveTabId>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);

  const hasBeenExpandedRef = useRef(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const { setSearchTerm } = useSearchContext();

  const showFullToolbar = useMemo(() => isExpanded || (isHovered && !isExpanded), [isExpanded, isHovered]);

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

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
    },
    [setSearchTerm],
  );

  // Update hasBeenExpanded ref when toolbar shows
  useEffect(() => {
    if (showFullToolbar) {
      hasBeenExpandedRef.current = true;
    }
  }, [showFullToolbar]);

  // Reset active tab to undefined when toolbar is closed
  useEffect(() => {
    if (!isExpanded) {
      setActiveTab(undefined);
      setPreviousTab(undefined);
    }
  }, [isExpanded]);

  // Handle click outside to close toolbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return {
    // State values
    isExpanded,
    isHovered,
    activeTab,
    previousTab,
    isAnimating,
    searchIsExpanded,
    showFullToolbar,
    slideDirection,
    hasBeenExpanded: hasBeenExpandedRef.current,

    // Refs
    toolbarRef,

    // Handlers
    handleTabChange,
    handleMouseEnter,
    handleMouseLeave,
    handleClose,
    handleSearch,
    setIsAnimating,
    setSearchIsExpanded,
  };
}
