import { TOOLBAR_CONFIG } from '../../constants';
import { LaunchDarklyIcon } from '../../components/icons/LaunchDarklyIcon';

import styles from '../Header.module.css';

export function LogoSection() {
  return (
    <div className={styles.leftSection}>
      <LaunchDarklyIcon className={styles.logo} />
      <span className={styles.headerTitle}>{TOOLBAR_CONFIG.labels.developerTitle}</span>
    </div>
  );
}
