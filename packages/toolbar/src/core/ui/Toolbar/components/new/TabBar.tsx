import React from 'react';
import { SearchIcon, FilterTuneIcon } from '../icons';
import * as styles from './TabBar.module.css';

export const TabBar = () => {
  const [activeTab, setActiveTab] = React.useState('flags');

  const tabs = [
    { id: 'flags', label: 'Flags' },
    { id: 'context', label: 'Context' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button className={styles.tabButton} aria-label="Filter">
        <FilterTuneIcon />
      </button>
      <button className={styles.tabButton} aria-label="Search">
        <SearchIcon />
      </button>
    </div>
  );
};
