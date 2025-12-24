import { ShareIcon } from '../../icons';
import * as styles from './ShareButton.module.css';

interface ShareButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export function ShareButton({ onClick }: ShareButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <button className={styles.button} onClick={handleClick} aria-label="Share toolbar state">
      <ShareIcon />
    </button>
  );
}
