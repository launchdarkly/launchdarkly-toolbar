import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function SyncIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M6.229 3.602a7.5 7.5 0 0 1 11.18 5.461.75.75 0 0 1-1.485.207A6 6 0 0 0 5 6.75h1.666a.75.75 0 1 1 0 1.5H3.333a.75.75 0 0 1-.75-.75V4.167a.75.75 0 1 1 1.5 0v1.295a7.5 7.5 0 0 1 2.146-1.86m-3 6.488a.75.75 0 0 1 .847.64 6 6 0 0 0 10.923 2.52h-1.666a.75.75 0 0 1 0-1.5h3.334a.75.75 0 0 1 .75.75v3.333a.75.75 0 0 1-1.5 0v-1.295a7.498 7.498 0 0 1-11.175.695 7.5 7.5 0 0 1-2.152-4.296.75.75 0 0 1 .64-.847"
        clipRule="evenodd"
      />
    </svg>
  );
}
