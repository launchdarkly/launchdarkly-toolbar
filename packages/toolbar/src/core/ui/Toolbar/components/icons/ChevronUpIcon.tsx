import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ChevronUpIcon({ className }: IconProps) {
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
        d="M9.47 6.97a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1-1.06 1.06L10 8.56l-4.47 4.47a.75.75 0 1 1-1.06-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
