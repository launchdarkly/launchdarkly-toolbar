import { motion } from 'motion/react';

import { useAuthContext } from '../../context/AuthProvider';
import * as styles from './LoginScreen.css';
import { IconButton } from '../../../Buttons/IconButton';
import { ChevronUpIcon } from '../icons/ChevronUpIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { useToolbarUIContext } from '../../context/ToolbarUIProvider';
import { LaunchDarklyLogo } from '../icons/LaunchDarklyLogo';
import { useAnalytics } from '../../context/AnalyticsProvider';

interface LoginScreenProps {
  onClose: () => void;
  onLogin: () => void;
  onMouseDown?: (event: React.MouseEvent) => void;
}

/**
 * Login screen component that prompts users to authenticate with LaunchDarkly
 */
export function LoginScreen(props: LoginScreenProps) {
  const { onClose, onLogin, onMouseDown } = props;
  const { authenticating } = useAuthContext();
  const { position } = useToolbarUIContext();
  const analytics = useAnalytics();
  const isTop = position.startsWith('top-');

  const handleClose = () => {
    analytics.trackLoginCancelled();
    onClose();
  };

  return (
    <motion.div
      className={styles.loginContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      data-testid="login-screen"
    >
      <div className={styles.loginHeader}>
        <LaunchDarklyLogo className={styles.headerLogo} onMouseDown={onMouseDown} />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={styles.closeButtonArea}
          tabIndex={-1}
        >
          <IconButton
            icon={isTop ? <ChevronUpIcon /> : <ChevronDownIcon />}
            label="Close toolbar"
            onClick={handleClose}
            className={styles.actionButton}
          />
        </motion.div>
      </div>

      <div className={styles.loginMainContent}>
        <div className={styles.loginContent}>
          <h2 className={styles.title}>Connect to LaunchDarkly</h2>
          <p className={styles.description}>Authorize your account to activate the Developer Toolbar.</p>

          <motion.button
            className={styles.loginButton}
            onClick={onLogin}
            disabled={authenticating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="login-button"
          >
            {authenticating ? (
              <>
                <div className={styles.spinner} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </motion.button>

          <p className={styles.helpText}>
            Don't have a LaunchDarkly account?{' '}
            <a
              href="https://launchdarkly.com/start-trial"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.helpLink}
            >
              Start your free trial!
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
