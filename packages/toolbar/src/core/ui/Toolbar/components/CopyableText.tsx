import { useCallback, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import * as styles from './CopyableText.css';

interface CopyableTextProps {
  /** The text to display and copy to clipboard */
  text: string;
  /** Optional callback fired after copying (useful for analytics) */
  onCopy?: (text: string) => void;
  /** Custom aria-label for accessibility. Defaults to "Copy {text} to clipboard" */
  ariaLabel?: string;
  /** Custom title tooltip. Defaults to "Copy {text} to clipboard" */
  title?: string;
  /** Additional CSS class name */
  className?: string;
  /** Custom tooltip text shown after copying. Defaults to "Copied!" */
  copiedMessage?: string;
  /** Duration in ms to show the copied tooltip. Defaults to 2000 */
  copiedDuration?: number;
}

export function CopyableText({
  text,
  onCopy,
  ariaLabel,
  title,
  className,
  copiedMessage = 'Copied!',
  copiedDuration = 2000,
}: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    // Fire optional callback (e.g., for analytics)
    onCopy?.(text);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset after specified duration
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, copiedDuration);
  }, [text, onCopy, copiedDuration]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const defaultTitle = `Copy ${text} to clipboard`;
  const defaultAriaLabel = `Copy ${text} to clipboard`;

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.container} ${className || ''}`}
        onClick={handleCopy}
        title={title ?? defaultTitle}
        aria-label={ariaLabel ?? defaultAriaLabel}
      >
        <span className={styles.text}>{text}</span>
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
            {copiedMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
