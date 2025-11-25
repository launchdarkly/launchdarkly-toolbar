import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function FlaskIcon({ className }: IconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M6.75 2.5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-.083v4.118l3.277 9.01a1.334 1.334 0 0 1-.974 1.86 1 1 0 0 1-.136.012H5.417a1 1 0 0 1-.135-.012 1.334 1.334 0 0 1-.975-1.86l3.276-9.01V3.25H7.5a.75.75 0 0 1-.75-.75m2.334.75V7.5a.8.8 0 0 1-.046.256l-1.567 4.311c.655-.099 1.467-.291 2.194-.655a9 9 0 0 1 2.336-.795h.001l-1.04-2.86a.8.8 0 0 1-.045-.257V3.25z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
