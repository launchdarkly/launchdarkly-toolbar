import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function FingerprintIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M15.363 5.19a.75.75 0 0 1 1.03.256 7.4 7.4 0 0 1 1.024 4.594v.793a4.25 4.25 0 0 0 .566 2.126.75.75 0 0 1-1.3.748 5.75 5.75 0 0 1-.766-2.874V10q0-.042.004-.082a5.9 5.9 0 0 0-.813-3.698.75.75 0 0 1 .255-1.03"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M10 6.583a2.583 2.583 0 0 0-2.583 2.583.75.75 0 1 1-1.5 0 4.083 4.083 0 0 1 8.166 0V10a7.6 7.6 0 0 0 1.517 4.55.75.75 0 1 1-1.2.9A9.1 9.1 0 0 1 12.583 10v-.834A2.583 2.583 0 0 0 10 6.583"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M10 8.416a.75.75 0 0 1 .75.75v1.668a10.9 10.9 0 0 0 1.95 6.238.75.75 0 1 1-1.233.855 12.4 12.4 0 0 1-2.217-7.094V9.166a.75.75 0 0 1 .75-.75"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M6.58 11.755a.75.75 0 0 1 .832.657 14.3 14.3 0 0 0 1.425 4.75.75.75 0 0 1-1.34.675 15.8 15.8 0 0 1-1.575-5.25.75.75 0 0 1 .657-.832"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M12.958 4.024a5.917 5.917 0 0 0-8.875 5.14v.861c-.063 1.891.18 3.78.72 5.594a.75.75 0 0 1-1.439.428 19.1 19.1 0 0 1-.78-6.06v-.82a7.417 7.417 0 0 1 11.124-6.442.75.75 0 0 1-.75 1.3"
        clip-rule="evenodd"
      />
    </svg>
  );
}
