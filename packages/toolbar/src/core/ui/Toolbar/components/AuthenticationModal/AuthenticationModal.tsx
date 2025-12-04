import { useCallback, useEffect } from 'react';
import * as styles from './AuthenticationModal.css';
import { useIFrameContext } from '../../context/api/IFrameProvider';
import { useAuthContext } from '../../context/api';
import { openOAuthPopup } from '../../utils/oauthPopup';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthenticationModal(props: AuthenticationModalProps) {
  const { isOpen, onClose } = props;

  const { ref, iframeSrc } = useIFrameContext();
  const { authenticated, authenticating, setAuthenticating } = useAuthContext();

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
        url: `${iframeSrc}/toolbar/index.html?originUrl=${window.location.origin}`,
      });
      onClose();
    } catch (error) {
      console.error('Popup authentication failed:', error);
    } finally {
      setAuthenticating(false);
    }
  }, [iframeSrc, onClose, setAuthenticating]);

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
            ? `${iframeSrc}/toolbar/authenticating.html?originUrl=${window.location.origin}`
            : `${iframeSrc}/toolbar/index.html?originUrl=${window.location.origin}`
        }
        title="LaunchDarkly Toolbar"
        style={{ display: 'none' }}
        ref={ref}
      />
    </div>
  );
}
