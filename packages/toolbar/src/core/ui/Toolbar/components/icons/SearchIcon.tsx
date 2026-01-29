import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function SearchIcon({ className }: IconProps) {
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
        d="M5.814 2.251a6.583 6.583 0 0 1 7.675 10.177l4.542 4.542a.75.75 0 1 1-1.06 1.06l-4.543-4.542a6.58 6.58 0 0 1-8.75-.5A6.585 6.585 0 0 1 5.815 2.252m2.52.999a5.083 5.083 0 1 0 0 10.166 5.083 5.083 0 0 0 0-10.166"
        clipRule="evenodd"
      />
    </svg>
  );
}
