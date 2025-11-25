import { LaunchDarklyLogo } from '../../../icons/LaunchDarklyLogo';
import type React from 'react';

import * as styles from '../Header.css';

interface LogoSectionProps {
  onMouseDown?: (event: React.MouseEvent) => void;
}

export function LogoSection(props: LogoSectionProps) {
  const { onMouseDown } = props;

  return (
    <div className={styles.leftSection} aria-hidden="true">
      <LaunchDarklyLogo className={styles.logo} onMouseDown={onMouseDown} />
    </div>
  );
}
