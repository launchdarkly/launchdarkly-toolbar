import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 15.5l-6-6 1.41-1.41L12 12.67l4.59-4.58L18 9.5z" />
    </svg>
  );
}
