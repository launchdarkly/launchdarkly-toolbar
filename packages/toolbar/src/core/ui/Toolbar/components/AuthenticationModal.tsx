import { useEffect } from 'react';
import { motion } from 'motion/react';
import * as styles from './AuthenticationModal.css';
import { IconButton } from './IconButton';
import { CancelIcon } from './icons/CancelIcon';
import { useIFrameContext } from '../context/IFrameProvider';
import { useAuthContext } from '../context/AuthProvider';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthenticationModal({ isOpen, onClose }: AuthenticationModalProps) {
  const { ref } = useIFrameContext();
  const { authenticated } = useAuthContext();
  
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

  useEffect(() => {
    // If the user is authenticated and the modal is open, close it (auth flow is complete)
    if (authenticated && isOpen) {
      onClose();
    }
  }, [authenticated, onClose, isOpen]);

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={false}
      animate={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={(e) => {
        if (e.target === e.currentTarget && isOpen) {
          onClose();
        }
      }}
    >
      <motion.div
        className={styles.modalContent}
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
          y: isOpen ? 0 : 20,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Authentication</h2>
          <IconButton icon={<CancelIcon />} label="Close authentication modal" onClick={onClose} />
        </div>
        <div className={styles.iframeContainer}>
          <iframe
            src="http://localhost:9050/toolbar/configure/index.html"
            className={styles.modalIframe}
            title="LaunchDarkly Authentication"
            ref={ref}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
