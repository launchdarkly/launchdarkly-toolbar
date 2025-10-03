import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 2a8 8 0 1 0 5.29 14.29l4.3 4.3a1 1 0 0 0 1.42-1.42l-4.3-4.3A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
    </svg>
  );
}
