import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ChevronDownIcon({ className }: IconProps) {
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
        d="M4.47 6.97a.75.75 0 0 1 1.06 0L10 11.44l4.47-4.47a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06"
        clipRule="evenodd"
      />
    </svg>
  );
}
