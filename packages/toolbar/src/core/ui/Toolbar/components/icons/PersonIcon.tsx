import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M7.702 3.952a3.25 3.25 0 1 1 4.596 4.596 3.25 3.25 0 0 1-4.596-4.596"
        clip-rule="evenodd"
      />
      <path d="M16.236 16.203q.056-.048.088-.078l.04-.039c.14-.14.22-.331.22-.53a4.64 4.64 0 0 0-4.64-4.64H8.057a4.64 4.64 0 0 0-4.639 4.64c0 .199.079.39.22.53l.04.039.087.078q.111.1.318.256c.274.207.677.474 1.208.74 1.064.532 2.636 1.051 4.71 1.051s3.647-.52 4.71-1.051a8 8 0 0 0 1.21-.74q.205-.156.316-.256" />
    </svg>
  );
}
