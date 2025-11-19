import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M4.167 4.083A.917.917 0 0 0 3.25 5v7.764c.288-.118.6-.18.917-.18h8.416V12.5a.75.75 0 0 1 1.5 0v4.167a.75.75 0 0 1-.75.75H4.167A2.417 2.417 0 0 1 1.75 15V5a2.417 2.417 0 0 1 2.417-2.417h9.166a.75.75 0 0 1 .75.75v.834a.75.75 0 0 1-1.5 0v-.084zm8.416 10H4.167a.917.917 0 1 0 0 1.834h8.416z"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M18.521 8.358a.75.75 0 0 1-.233.543l-2.1 2a.75.75 0 0 1-1.034-1.086l.742-.707h-3.15a.75.75 0 0 1 0-1.5h3.15l-.742-.707a.75.75 0 1 1 1.034-1.086l2.1 2a.75.75 0 0 1 .233.543"
        clip-rule="evenodd"
      />
    </svg>
  );
}
