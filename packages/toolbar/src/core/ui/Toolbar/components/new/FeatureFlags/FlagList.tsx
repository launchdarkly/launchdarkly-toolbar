import React from 'react';
import { FlagItem } from './FlagItem';
import * as styles from './FlagList.module.css';

export const FlagList = () => {
  const [flags, setFlags] = React.useState([
    { id: 'new-dashboard-ui', name: 'new-dashboard-ui', value: 'true', enabled: true },
    { id: 'enable-analytics', name: 'enable-analytics', value: 'false', enabled: false },
    { id: 'beta-features', name: 'beta-features', value: 'control', enabled: true },
  ]);

  const handleToggle = (id: string) => {
    setFlags((prevFlags) => prevFlags.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag)));
  };

  return (
    <div className={styles.container}>
      {flags.map((flag) => (
        <FlagItem
          key={flag.id}
          name={flag.name}
          value={flag.value}
          enabled={flag.enabled}
          onToggle={() => handleToggle(flag.id)}
        />
      ))}
    </div>
  );
};
