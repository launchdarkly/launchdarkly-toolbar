import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ToggleOffIcon({ className }: IconProps) {
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
        d="M2.6 5.934A5.75 5.75 0 0 1 6.668 4.25h6.666a5.75 5.75 0 1 1 0 11.5H6.667A5.75 5.75 0 0 1 2.6 5.934m2.358 2.357a2.417 2.417 0 1 1 3.418 3.418A2.417 2.417 0 0 1 4.958 8.29"
        clipRule="evenodd"
      />
    </svg>
  );
}
