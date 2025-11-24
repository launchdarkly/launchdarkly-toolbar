import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ThumbDownIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className || ''}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thumb down"
    >
      <path
        fillRule="evenodd"
        d="M14.139 2.583c.606-.04 1.158.217 1.577.636s.703.994.848 1.61l.005.024.833 4.166q.015.073.015.148A2.416 2.416 0 0 1 15 11.583h-1.75V15a2.417 2.417 0 0 1-4.833 0v-.834a2.583 2.583 0 0 0-2.584-2.583h-2.5A1.583 1.583 0 0 1 1.75 10V4.167a1.583 1.583 0 0 1 1.583-1.584H5a1.58 1.58 0 0 1 1.316.702 3.25 3.25 0 0 1 2.017-.702zM5.083 4.167A.083.083 0 0 0 5 4.083H3.333a.083.083 0 0 0-.083.084V10a.083.083 0 0 0 .083.083h1.75zm1.5 5.986v-4.32a1.75 1.75 0 0 1 1.75-1.75h5.834q.03 0 .063-.003c.101-.008.25.025.425.2.18.179.35.478.446.88l.813 4.07a.917.917 0 0 1-.914.853h-2.5a.75.75 0 0 0-.75.75V15a.917.917 0 0 1-1.833 0v-.834a4.08 4.08 0 0 0-3.334-4.013"
        clipRule="evenodd"
      />
    </svg>
  );
}
