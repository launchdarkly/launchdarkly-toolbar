import { useCallback } from 'react';
import { IconButton } from './IconButton';
import { CopyClipboard } from './icons/CopyClipboard';
import * as styles from './FlagKeyWithCopy.css';

interface FlagKeyWithCopyProps {
  flagKey: string;
  className?: string;
}

export function FlagKeyWithCopy({ flagKey, className }: FlagKeyWithCopyProps) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(flagKey);
  }, [flagKey]);

  return (
    <span className={`${styles.container} ${className || ''}`}>
      <span className={styles.flagKeyText}>{flagKey}</span>
      <IconButton
        icon={<CopyClipboard />}
        label={`Copy flag key: ${flagKey}`}
        onClick={handleCopy}
        size="small"
        className={styles.copyButton}
      />
    </span>
  );
}

