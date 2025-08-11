import { useAuthProxy } from '../context/AuthProxyContext';
import * as styles from './LoginTabContent.css';

export function LoginTabContent() {
  const { state, login, logout } = useAuthProxy();

  const handleAuthAction = () => {
    if (state === 'logged-in') {
      logout();
    } else {
      login();
    }
  };

  const getStatusMessage = () => {
    switch (state) {
      case 'logged-in':
        return 'You are successfully signed in to LaunchDarkly.';
      case 'logged-out':
        return 'Sign in to LaunchDarkly to access your feature flags and projects.';
      case 'connecting':
        return 'Connecting to LaunchDarkly...';
      case 'disconnected':
        return 'Unable to connect to LaunchDarkly. Please check your connection.';
      default:
        return 'Authentication status unknown.';
    }
  };

  const getButtonText = () => {
    switch (state) {
      case 'logged-in':
        return 'Sign Out';
      case 'logged-out':
        return 'Sign In with LaunchDarkly';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Retry Connection';
      default:
        return 'Sign In';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'logged-in':
        return '#22c55e';
      case 'logged-out':
        return '#6b7280';
      case 'connecting':
        return '#f59e0b';
      case 'disconnected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>LaunchDarkly Authentication</h3>
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot} style={{ backgroundColor: getStatusColor() }} />
          <span className={styles.statusText}>{state.charAt(0).toUpperCase() + state.slice(1).replace('-', ' ')}</span>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.message}>{getStatusMessage()}</p>

        <button className={styles.authButton} onClick={handleAuthAction} disabled={state === 'connecting'}>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
