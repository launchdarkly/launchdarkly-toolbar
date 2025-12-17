import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useAnalyticsPreferences } from '../../../context';
import { loadAnalyticsConsentShown, saveAnalyticsConsentShown } from '../../../utils/localStorage';
import { InfoIcon, CancelIcon } from '../../icons';
import * as styles from './AnalyticsConsentToast.module.css';

const PRIVACY_POLICY_URL = 'https://launchdarkly.com/policies/privacy';

/**
 * A toast component that appears at the bottom of the toolbar asking users
 * to opt into analytics. Only shows the first time the toolbar is opened.
 */
export function AnalyticsConsentToast() {
  const [hasBeenShown, setHasBeenShown] = useState(() => loadAnalyticsConsentShown());
  const { handleToggleAnalyticsOptOut } = useAnalyticsPreferences();

  const handleDismiss = () => {
    setHasBeenShown(true);
    saveAnalyticsConsentShown(true);
  };

  const handleEnableAnalytics = () => {
    handleToggleAnalyticsOptOut(true);
    handleDismiss();
  };

  // Don't render if user has already seen the toast
  if (hasBeenShown) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Close"
        >
          <CancelIcon className={styles.closeIcon} />
        </button>

        <div className={styles.container}>
          <InfoIcon className={styles.infoIcon} />
          <div className={styles.content}>
            <div className={styles.textContent}>
              <p className={styles.title}>Help us improve</p>
              <p className={styles.description}>
                Help us improve the toolbar by sharing usage data.
              </p>
              <a
                href={PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.privacyLink}
              >
                Privacy Policy
              </a>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleEnableAnalytics}
              >
                Accept
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={handleDismiss}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

