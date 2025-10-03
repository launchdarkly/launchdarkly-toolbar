import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function SyncIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.1-.3 2.13-.82 3.02l1.46 1.46A7.92 7.92 0 0 0 20 12c0-4.42-3.58-8-8-8zm-6 8c0-1.1.3-2.13.82-3.02L5.36 7.52A7.92 7.92 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z" />
    </svg>
  );
}
