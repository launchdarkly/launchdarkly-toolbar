import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function EditIcon({ className }: IconProps) {
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
        d="M12.848 3.107a3.107 3.107 0 0 1 3.386 5.067l-8.75 8.75a.75.75 0 0 1-.53.22H3.62a.75.75 0 0 1-.75-.75V13.06a.75.75 0 0 1 .22-.53L11 4.618l.01-.01.829-.828a3.1 3.1 0 0 1 1.008-.673m-1.311 3.097L4.37 13.371v2.273h2.273l7.167-7.167z"
        clipRule="evenodd"
      />
    </svg>
  );
}
