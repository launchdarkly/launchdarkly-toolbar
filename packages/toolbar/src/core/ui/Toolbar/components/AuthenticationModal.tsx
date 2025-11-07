import { useCallback, useEffect } from 'react';
import * as styles from './AuthenticationModal.css';
import { useIFrameContext } from '../context/IFrameProvider';
import { useAuthContext } from '../context/AuthProvider';
import { openOAuthPopup } from '../utils/oauthPopup';

interface AuthenticationModalProps {
  baseUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AuthenticationModal(props: AuthenticationModalProps) {
  const { baseUrl, isOpen, onClose } = props;

  const { ref } = useIFrameContext();
  const { authenticated, authenticating, setAuthenticating } = useAuthContext();

  // If running the toolbar + integration server locally, replace the iframe URL as needed.
  const getIframeUrl = useCallback(() => {
    switch (baseUrl.toLowerCase()) {
      case 'https://app.launchdarkly.com':
        return 'https://integrations.launchdarkly.com';
      case 'https://ld-stg.launchdarkly.com':
        return 'https://integrations-stg.launchdarkly.com';
      case 'https://app.ld.catamorphic.com':
        return 'https://integrations.ld.catamorphic.com';
      default:
        return 'https://integrations.launchdarkly.com';
    }
  }, [baseUrl]);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handlePopupAuth = useCallback(async () => {
    try {
      setAuthenticating(true);
      await openOAuthPopup({
        url: `${getIframeUrl()}/toolbar/index.html`,
      });
      onClose();
      setAuthenticating(false);
    } catch (error) {
      console.error('Popup authentication failed:', error);
    }
  }, []);

  // Auto-trigger popup authentication when modal opens
  useEffect(() => {
    if (isOpen && !authenticated) {
      handlePopupAuth();
    }
  }, [isOpen, authenticated, handlePopupAuth]);

  // Check auth by going to index.html. If that returns a 401, navigate to authenticating.html
  // while the user authenticates in the popup. This is done because iframe authentication can
  // have some issues with setting cookies.
  return (
    <div className={styles.iframeContainer}>
      <iframe
        src={
          authenticating
            ? `${getIframeUrl()}/toolbar/authenticating.html?originUrl=${window.location.origin}`
            : `${getIframeUrl()}/toolbar/index.html?originUrl=${window.location.origin}`
        }
        title="LaunchDarkly Toolbar"
        style={{ display: 'none' }}
        ref={ref}
      />
    </div>
  );
}
