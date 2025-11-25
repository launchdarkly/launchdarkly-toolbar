import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import * as styles from './TabBar.module.css';

export const TabBar = () => {
  const [activeTab, setActiveTab] = React.useState('flags');

  const tabs = [
    { id: 'flags', label: 'Flags' },
    { id: 'pinned', label: 'Pinned' },
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

      <button className={styles.searchButton} aria-label="Search">
        <SearchIcon />
      </button>
    </div>
  );
};
