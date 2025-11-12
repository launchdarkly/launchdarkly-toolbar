import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function CancelIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M4.47 4.47a.75.75 0 0 1 1.06 0L10 8.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L11.062 10l4.47 4.47a.75.75 0 0 1-1.06 1.06L10 11.06l-4.47 4.47a.75.75 0 1 1-1.06-1.06L8.94 10 4.47 5.53a.75.75 0 0 1 0-1.06"
        clipRule="evenodd"
      />
    </svg>
  );
}
