import React from 'react';
import * as styles from './ConnectionStatus.module.css';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'error';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.text}>{getStatusText()}</span>
      <div className={`${styles.dot} ${styles[status]}`} />
    </div>
  );
};

