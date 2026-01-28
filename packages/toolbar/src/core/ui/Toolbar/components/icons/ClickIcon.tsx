import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ClickIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 1.75a.75.75 0 0 1 .75.75V5a.75.75 0 0 1-1.5 0V2.5a.75.75 0 0 1 .75-.75M4.138 4.136a.75.75 0 0 1 1.06 0L7.03 5.97a.75.75 0 1 1-1.06 1.06L4.137 5.197a.75.75 0 0 1 0-1.06m11.727 0a.75.75 0 0 1 0 1.061L14.031 7.03a.75.75 0 0 1-1.06-1.06l1.833-1.834a.75.75 0 0 1 1.06 0M1.75 10a.75.75 0 0 1 .75-.75H5a.75.75 0 1 1 0 1.5H2.5a.75.75 0 0 1-.75-.75m5.28 2.97a.75.75 0 0 1 0 1.06l-1.833 1.834a.75.75 0 1 1-1.06-1.061l1.833-1.834a.75.75 0 0 1 1.06 0"
        clip-rule="evenodd"
      />
      <path d="M10.238 9.288a.75.75 0 0 0-.949.949l2.5 7.5a.75.75 0 0 0 1.382.098l1.202-2.402 2.597 2.597a.75.75 0 1 0 1.06-1.06l-2.166-2.813 1.972-.986a.75.75 0 0 0-.098-1.383z" />
    </svg>
  );
}
