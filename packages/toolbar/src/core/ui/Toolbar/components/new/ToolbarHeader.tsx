import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import * as styles from './ToolbarHeader.module.css';
import { LaunchDarklyIcon } from '../icons/LaunchDarklyIcon';

export const ToolbarHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <LaunchDarklyIcon className={styles.logo} />
        <span className={styles.title}>LaunchDarkly</span>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton}>
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
};

