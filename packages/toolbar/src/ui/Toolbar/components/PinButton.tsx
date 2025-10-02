import { PinIcon } from './icons';
import * as styles from './PinButton.css';

interface PinButtonProps {
  isPinned: boolean;
  onClick: () => void;
  'data-testid'?: string;
}

export function PinButton({ isPinned, onClick, 'data-testid': dataTestId }: PinButtonProps) {
  return (
    <button
      className={`${styles.pinButton} ${isPinned ? styles.pinned : ''}`}
      onClick={onClick}
      aria-label={isPinned ? 'Unpin flag' : 'Pin flag'}
      title={isPinned ? 'Unpin flag' : 'Pin flag'}
      data-testid={dataTestId}
    >
      <PinIcon filled={isPinned} className={styles.pinIcon} />
    </button>
  );
}
