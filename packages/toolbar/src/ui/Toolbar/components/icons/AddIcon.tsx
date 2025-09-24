import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function AddIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 3.417a.75.75 0 0 1 .75.75V9.25h5.083a.75.75 0 0 1 0 1.5H10.75v5.083a.75.75 0 0 1-1.5 0V10.75H4.167a.75.75 0 0 1 0-1.5H9.25V4.167a.75.75 0 0 1 .75-.75" />
    </svg>
  );
}
