import { ShareIcon } from '../icons';
import * as styles from './ShareUrlButton.css';

interface ShareUrlButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  count: number;
}

export function ShareUrlButton({ onClick, isLoading, count }: ShareUrlButtonProps) {
  if (count === 0) {
    return null;
  }

  return (
    <button
      className={styles.shareButton}
      onClick={onClick}
      disabled={isLoading}
      aria-label={`Copy share URL with ${count} override${count === 1 ? '' : 's'}`}
      title="Copy share URL"
    >
      <ShareIcon className={styles.smallIcon} />
      Copy share URL ({count})
    </button>
  );
}
