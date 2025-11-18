import { useCallback, useState, useEffect, useRef } from 'react';
import { CopyClipboard } from './icons/CopyClipboard';
import { CheckIcon } from './icons/CheckIcon';
import * as styles from './FlagKeyWithCopy.css';

interface FlagKeyWithCopyProps {
  flagKey: string;
  className?: string;
}

export function FlagKeyWithCopy({ flagKey, className }: FlagKeyWithCopyProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(flagKey);
    setIsCopied(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, 2000);
  }, [flagKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      className={`${styles.container} ${isCopied ? styles.copied : ''} ${className || ''}`}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied to clipboard!' : `Copy flag key: ${flagKey}`}
      title={isCopied ? 'Copied to clipboard!' : 'Click to copy flag key'}
    >
      {isCopied ? (
        <>
          <span className={styles.copiedText}>Copied!</span>
          <CheckIcon className={styles.checkIcon} />
        </>
      ) : (
        <>
          <span className={styles.flagKeyText}>{flagKey}</span>
          <CopyClipboard className={styles.copyIcon} />
        </>
      )}
    </button>
  );
}
