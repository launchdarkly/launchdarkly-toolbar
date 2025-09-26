import { LaunchDarklyIcon } from '../../components/icons/LaunchDarklyIcon';

import * as styles from '../Header.css';

export function LogoSection() {
  return (
    <div className={styles.leftSection}>
      <LaunchDarklyIcon className={styles.logo} />
      <span className={styles.headerTitle}>LaunchDarkly</span>
    </div>
  );
}
