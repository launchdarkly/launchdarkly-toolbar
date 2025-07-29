import { StatusDot } from './StatusDot';
import styles from './ConnectionStatus.module.css';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'error';
  lastSyncTime: number;
}

export function ConnectionStatus(props: ConnectionStatusProps) {
  const { status, lastSyncTime } = props;

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected to dev server';
      case 'disconnected':
        return 'Disconnected from dev server';
      case 'error':
        return 'Error connecting to dev server';
    }
  };

  return (
    <div className={styles.connectionStatus}>
      <div className={styles.statusIndicator}>
        <StatusDot status={status} />
        <span className={styles.statusText}>{getStatusText()}</span>
      </div>

      {lastSyncTime > 0 && (
        <span className={styles.lastSync}>Last sync: {new Date(lastSyncTime).toLocaleTimeString()}</span>
      )}
    </div>
  );
}
