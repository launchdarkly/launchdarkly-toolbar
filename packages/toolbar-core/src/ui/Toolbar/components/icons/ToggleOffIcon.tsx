import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ToggleOffIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 7H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10zm0 8H7a3 3 0 0 1 0-6h10a3 3 0 0 1 0 6zM7 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}
