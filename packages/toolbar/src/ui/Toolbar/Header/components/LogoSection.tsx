import { LaunchDarklyLogo } from '../../components/icons/LaunchDarklyLogo';

import * as styles from '../Header.css';

export function LogoSection() {
  return (
    <div className={styles.leftSection} aria-hidden="true">
      <LaunchDarklyLogo className={styles.logo} />
    </div>
  );
}
