import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function CheckIcon({ className }: IconProps) {
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
        d="M17.197 5.303a.75.75 0 0 1 0 1.06l-8.333 8.334a.75.75 0 0 1-1.06 0L3.635 10.53a.75.75 0 1 1 1.061-1.06l3.636 3.636 7.803-7.803a.75.75 0 0 1 1.061 0"
        clipRule="evenodd"
      />
    </svg>
  );
}
