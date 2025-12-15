import { motion } from 'motion/react';

import * as styles from './LoadingScreen.css';
import { LaunchDarklyLogo } from '../icons/LaunchDarklyLogo';

interface LoadingScreenProps {
  onMouseDown?: (event: React.MouseEvent) => void;
}

export function LoadingScreen(props: LoadingScreenProps) {
  const { onMouseDown } = props;

  return (
    <motion.div
      className={styles.loadingContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      data-testid="loading-screen"
    >
      <div className={styles.loadingHeader}>
        <LaunchDarklyLogo className={styles.headerLogo} onMouseDown={onMouseDown} />
      </div>

      <div className={styles.loadingMainContent}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    </motion.div>
  );
}
