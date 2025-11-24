import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function ThumbUpIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className || ''}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thumb up"
    >
      <path
        fillRule="evenodd"
        d="M10.833 4.084A.916.916 0 0 0 9.917 5v.833a4.08 4.08 0 0 1-3.334 4.014v4.32a1.75 1.75 0 0 0 1.75 1.75h5.834l.063.002c.101.01.25-.024.425-.198.18-.18.35-.48.446-.88l.813-4.07A.917.917 0 0 0 15 9.916h-2.5a.75.75 0 0 1-.75-.75V5a.917.917 0 0 0-.917-.917m-4.517 12.63A1.58 1.58 0 0 1 5 17.418H3.333a1.583 1.583 0 0 1-1.583-1.584V10a1.583 1.583 0 0 1 1.583-1.583h2.5a2.583 2.583 0 0 0 2.584-2.583V5a2.417 2.417 0 1 1 4.833 0v3.417H15a2.417 2.417 0 0 1 2.417 2.417q0 .074-.015.147l-.833 4.166-.005.024c-.145.616-.428 1.19-.848 1.61-.419.419-.97.676-1.577.636H8.333a3.25 3.25 0 0 1-2.017-.702M5.083 9.918h-1.75A.083.083 0 0 0 3.25 10v5.834a.083.083 0 0 0 .083.083H5a.083.083 0 0 0 .083-.083z"
        clipRule="evenodd"
      />
    </svg>
  );
}
