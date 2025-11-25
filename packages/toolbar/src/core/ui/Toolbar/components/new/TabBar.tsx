import { useEffect } from 'react';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { ContentActions } from './ContentActions';
import { TAB_SUBTABS_MAP, getDefaultSubtab, SubTab, TabConfig } from './types';
import * as styles from './TabBar.module.css';

export const TabBar = () => {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab, setActiveSubtab } = useActiveSubtabContext();

  // Get subtabs for the current active tab
  const subtabs: TabConfig[] =
    activeTab && activeTab in TAB_SUBTABS_MAP ? TAB_SUBTABS_MAP[activeTab as keyof typeof TAB_SUBTABS_MAP] : [];

  // When main tab changes, set the default subtab
  useEffect(() => {
    if (activeTab && activeTab in TAB_SUBTABS_MAP) {
      const defaultSubtab = getDefaultSubtab(activeTab);
      setActiveSubtab(defaultSubtab);
    }
  }, [activeTab, setActiveSubtab]);

  // Don't render if no subtabs available
  if (subtabs.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {subtabs.map((tab: TabConfig) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeSubtab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveSubtab(tab.id as SubTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ContentActions />
    </div>
  );
};
