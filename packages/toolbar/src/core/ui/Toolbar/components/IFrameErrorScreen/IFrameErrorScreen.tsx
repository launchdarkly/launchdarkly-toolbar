import { motion } from 'motion/react';

import * as styles from './IFrameErrorScreen.css';
import { LaunchDarklyLogo } from '../icons/LaunchDarklyLogo';
import { usePlugins } from '../../context';

interface IFrameErrorScreenProps {
  onMouseDown?: (event: React.MouseEvent) => void;
}

export function IFrameErrorScreen(props: IFrameErrorScreenProps) {
  const { onMouseDown } = props;
  const { baseUrl } = usePlugins();

  return (
    <motion.div
      className={styles.errorContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      data-testid="iframe-error-screen"
    >
      <div className={styles.errorHeader}>
        <LaunchDarklyLogo className={styles.headerLogo} onMouseDown={onMouseDown} />
      </div>

      <div className={styles.errorMainContent}>
        <div className={styles.errorContent}>
          <p className={styles.errorTitle}>Unable to connect to LaunchDarkly</p>
          <p className={styles.errorDescription}>
            The toolbar could not connect to LaunchDarkly. This is typically caused by trying to load the toolbar from a
            domain that is not whitelisted (i.e. a non-localhost domain). If you are running this in a hosted
            environment, ensure the domain has been whitelisted. Click{' '}
            <a
              href={`${baseUrl}/settings/integrations/launchdarkly-developer-toolbar/new`}
              target="_blank"
              rel="noopener noreferrer"
            >
              here to whitelist your domain.
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
