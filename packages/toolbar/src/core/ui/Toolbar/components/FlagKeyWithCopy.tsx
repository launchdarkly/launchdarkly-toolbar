import { useCallback, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAnalytics } from '../context/AnalyticsProvider';
import * as styles from './FlagKeyWithCopy.css';

interface FlagKeyWithCopyProps {
  flagKey: string;
  className?: string;
}

export function FlagKeyWithCopy({ flagKey, className }: FlagKeyWithCopyProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analytics = useAnalytics();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(flagKey);
    setIsCopied(true);

    // Track the copy action
    analytics.trackFlagKeyCopy(flagKey);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, 2000);
  }, [flagKey, analytics]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.container} ${className || ''}`}
        onClick={handleCopy}
        aria-label={`Copy flag key: ${flagKey}`}
      >
        <span className={styles.flagKeyText}>{flagKey}</span>
      </button>
      <AnimatePresence>
        {isCopied && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
