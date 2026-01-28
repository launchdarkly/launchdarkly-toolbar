import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function StarOutlineIcon({ className }: IconProps) {
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
        d="M9.995.918a.75.75 0 0 1 .672.419l2.397 4.857 5.36.776a.75.75 0 0 1 .415 1.28l-3.883 3.78.915 5.34a.75.75 0 0 1-1.089.79L10 15.64l-4.794 2.52a.75.75 0 0 1-1.088-.79l.916-5.34L1.15 8.25a.75.75 0 0 1 .415-1.28l5.36-.776 2.397-4.857a.75.75 0 0 1 .673-.419m0 2.445-1.9 3.848a.75.75 0 0 1-.565.41l-4.244.616 3.077 2.994a.75.75 0 0 1 .216.664l-.726 4.23 3.798-1.997a.75.75 0 0 1 .699 0l3.786 1.995-.726-4.228a.75.75 0 0 1 .216-.664l3.077-2.994-4.244-.615a.75.75 0 0 1-.565-.41z"
        clipRule="evenodd"
      />
    </svg>
  );
}
