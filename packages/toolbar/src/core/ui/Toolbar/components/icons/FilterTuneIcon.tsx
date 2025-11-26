import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function FilterTuneIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M9.958 4.958a2.417 2.417 0 0 1 4.006.959h2.702a.75.75 0 1 1 0 1.5h-2.702a2.417 2.417 0 0 1-4.595 0H3.333a.75.75 0 1 1 0-1.5h6.036a2.4 2.4 0 0 1 .588-.96m1.708.792a.916.916 0 1 0 0 1.833.916.916 0 0 0 0-1.833m-6.303 5.874a2.417 2.417 0 0 1 4.006.96h7.297a.75.75 0 1 1 0 1.5H9.37a2.416 2.416 0 0 1-4.595 0H3.333a.75.75 0 0 1 0-1.5h1.441c.117-.359.317-.688.589-.96m1.709.793a.916.916 0 1 0 0 1.832.916.916 0 0 0 0-1.832"
        clip-rule="evenodd"
      />
    </svg>
  );
}
