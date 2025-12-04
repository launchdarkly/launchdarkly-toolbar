import { useState } from 'react';
import { Alert } from '@launchpad-ui/components';
import { loadMCPAlertDismissed, saveMCPAlertDismissed } from '../../../utils/localStorage';
import { CursorIcon, InfoIcon } from '../../icons';
import * as styles from './MCPSetupAlert.module.css.ts';

/**
 * LaunchDarkly MCP server configuration for Cursor deeplink installation.
 * Users will need to add their own API key after installation.
 */
const MCP_SERVER_CONFIG = {
  command: 'npx',
  args: ['-y', '@launchdarkly/mcp-server', 'start', '--api-key', 'YOUR_API_KEY'],
};

/**
 * Generate a Cursor deeplink URL for MCP server installation.
 * Uses the format from https://cursor.com/docs/context/mcp/install-links
 */
function generateCursorDeeplink(): string {
  const configJson = JSON.stringify(MCP_SERVER_CONFIG);
  const base64Config = btoa(configJson);
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=LaunchDarkly&config=${base64Config}`;
}

const DOCS_URL = 'https://launchdarkly.com/docs/home/getting-started/mcp';
const CURSOR_DEEPLINK = generateCursorDeeplink();

export interface MCPSetupAlertProps {
  /** Called when the alert is dismissed */
  onDismiss?: () => void;
}

/**
 * A compact alert prompting users to set up the LaunchDarkly MCP server.
 * Shows only if user hasn't dismissed it via "Done!" button.
 * Provides links to documentation and a one-click install button for Cursor users.
 */
export function MCPSetupAlert({ onDismiss }: MCPSetupAlertProps) {
  const [isDismissed, setIsDismissed] = useState(() => loadMCPAlertDismissed());

  const handleDone = () => {
    setIsDismissed(true);
    saveMCPAlertDismissed(true);
    onDismiss?.();
  };

  // Don't render if user has dismissed via "Done!"
  if (isDismissed) {
    return null;
  }

  return (
    <div className={styles.alertContainer}>
      <Alert status="neutral" variant="default">
        <div className={styles.alertContentWithIcon}>
          <InfoIcon className={styles.infoIcon} />
          <div className={styles.alertContent}>
            <div className={styles.textContent}>
              <p className={styles.title}>Supercharge your workflow with MCP</p>
              <p className={styles.description}>
                Our MCP server is the perfect companion to this toolbar - let AI agents create and manage your feature
                flags directly in your IDE.
              </p>
            </div>
            <div className={styles.actions}>
              <a
                href={CURSOR_DEEPLINK}
                className={`${styles.actionButton}`}
                title="Add LaunchDarkly MCP server to Cursor"
              >
                <CursorIcon className={styles.cursorIcon} width={14} height={14} />
                <span>Add to Cursor</span>
              </a>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
                title="View MCP server documentation"
              >
                View docs
              </a>
              <button
                type="button"
                className={`${styles.actionButton} ${styles.doneButton}`}
                onClick={handleDone}
                title="Dismiss this alert"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}
