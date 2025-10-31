import { XIcon } from '../icons';
import * as styles from './ClearButton.css';

interface ClearButtonProps {
  label: string;
  count: number;
  onClick: () => void;
  isLoading?: boolean;
}

export function ClearButton({ label, count, onClick, isLoading }: ClearButtonProps) {
  return (
    <button
      className={styles.clearButton}
      onClick={onClick}
      disabled={isLoading}
      aria-label={`Clear ${label} (${count})`}
    >
      <XIcon className={styles.smallIcon} />
      Clear {label} ({count})
    </button>
  );
}
