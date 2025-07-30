import styles from './Icon.module.css';

interface IconProps {
  className?: string;
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 12-12-1.41-1.41z" />
    </svg>
  );
}
