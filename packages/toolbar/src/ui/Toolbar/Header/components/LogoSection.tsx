import { LaunchDarklyLogo } from '../../components/icons/LaunchDarklyLogo';

import * as styles from '../Header.css';

export function LogoSection() {
  return (
    <div className={styles.leftSection}>
      <LaunchDarklyLogo className={styles.logo} />
    </div>
  );
}
