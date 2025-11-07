import { useCallback, useEffect } from 'react';
import * as styles from './AuthenticationModal.css';
import { useIFrameContext } from '../context/IFrameProvider';
import { useAuthContext } from '../context/AuthProvider';
import { openOAuthPopup } from '../utils/oauthPopup';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthenticationModal({ isOpen, onClose }: AuthenticationModalProps) {
  const { ref } = useIFrameContext();
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
        url: 'https://1af34adb3482.ngrok.app/toolbar/index.html',
      });
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
            ? 'https://1af34adb3482.ngrok.app/toolbar/authenticating.html'
            : 'https://1af34adb3482.ngrok.app/toolbar/index.html'
        }
        title="LaunchDarkly Toolbar"
        style={{ display: 'none' }}
        ref={ref}
      />
    </div>
  );
}
