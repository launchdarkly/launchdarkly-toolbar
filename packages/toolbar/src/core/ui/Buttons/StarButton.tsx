import { StarIcon, StarOutlineIcon } from '../Toolbar/components/icons';
import * as styles from './StarButton.css';

interface StarButtonProps {
  flagKey: string;
  isStarred: boolean;
  onToggle: (flagKey: string) => void;
}

export function StarButton({ flagKey, isStarred, onToggle }: StarButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    onToggle(flagKey);
  };

  return (
    <button
      className={styles.starButton}
      onClick={handleClick}
      aria-label={isStarred ? 'Unstar flag' : 'Star flag'}
      title={isStarred ? 'Unstar flag' : 'Star flag'}
    >
      {isStarred ? <StarIcon className={styles.starIcon} /> : <StarOutlineIcon className={styles.starIcon} />}
    </button>
  );
}
