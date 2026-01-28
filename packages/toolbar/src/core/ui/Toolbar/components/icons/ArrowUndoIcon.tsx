import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ArrowUndoIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4 5.25a.75.75 0 0 1 .75.75v2.316l.749-.674a6.75 6.75 0 0 1 4.5-1.725c1.79 0 3.508.71 4.774 1.977C16.084 9.205 16.75 10.877 16.75 14a.75.75 0 0 1-1.5 0c0-2.877-.6-4.107-1.538-5.046A5.25 5.25 0 0 0 10 7.417a5.25 5.25 0 0 0-3.5 1.34l-.546.493H8a.75.75 0 1 1 0 1.5H4a.75.75 0 0 1-.75-.75V6A.75.75 0 0 1 4 5.25"
        clipRule="evenodd"
      />
    </svg>
  );
}
