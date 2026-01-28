import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function CancelCircleIcon({ className }: IconProps) {
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
        d="M10 1.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5M6.97 6.97a.75.75 0 0 1 1.06 0L10 8.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L11.062 10l1.97 1.97a.75.75 0 0 1-1.06 1.06L10 11.06l-1.97 1.97a.75.75 0 1 1-1.06-1.06L8.94 10 6.97 8.03a.75.75 0 0 1 0-1.06"
        clipRule="evenodd"
      />
    </svg>
  );
}
