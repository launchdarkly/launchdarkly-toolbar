import { LaunchDarklyIcon } from '../../components/icons/LaunchDarklyIcon';

import styles from '../Header.module.css';

export function LogoSection() {
  return (
    <div className={styles.leftSection}>
      <LaunchDarklyIcon className={styles.logo} />
      <span className={styles.headerTitle}>Developers</span>
    </div>
  );
}
