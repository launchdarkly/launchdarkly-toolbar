import { useAuthContext } from '../../../context/api';
import { useAnalytics } from '../../../context/telemetry/AnalyticsProvider';
import * as styles from './LogoutButton.module.css';

export function LogoutButton() {
  const { logout } = useAuthContext();
  const analytics = useAnalytics();

  const handleLogout = () => {
    analytics.trackLogout();
    logout();
  };

  return (
    <button className={styles.button} onClick={handleLogout} aria-label="Log out">
      Log out
    </button>
  );
}
