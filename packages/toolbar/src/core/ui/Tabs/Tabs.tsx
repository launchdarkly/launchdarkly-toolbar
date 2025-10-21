import React, { useState, useEffect, useRef, useCallback } from 'react';

import { TabsContext } from './useTabsContext';

import * as styles from './Tabs.css';

export interface TabsProps {
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const { defaultActiveTab, activeTab, onTabChange, children } = props;
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || '');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '0px' });
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const updateIndicatorPosition = useCallback(() => {
    if (!tabsContainerRef.current) return;

    const activeButton = tabsContainerRef.current.querySelector(`[aria-selected="true"]`) as HTMLElement;
    if (activeButton) {
      const left = activeButton.offsetLeft;
      const width = activeButton.offsetWidth;

      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`,
      });
    }
  }, []);

  // Update indicator position when active tab changes
  useEffect(() => {
    updateIndicatorPosition();

    // Update indicator position after a short delay to handle container animations
    const timeoutId = setTimeout(updateIndicatorPosition, 250);

    return () => clearTimeout(timeoutId);
  }, [currentActiveTab, updateIndicatorPosition]);

  return (
    <TabsContext.Provider value={{ activeTab: currentActiveTab, onTabChange: handleTabChange }}>
      <div ref={ref} className={styles.toolbar}>
        <div ref={tabsContainerRef} className={styles.tabsContainer}>
          {children}
          <div className={styles.activeIndicator} style={indicatorStyle} />
        </div>
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';
