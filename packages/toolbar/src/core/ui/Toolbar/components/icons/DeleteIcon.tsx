import * as styles from './Icon.css';

interface IconProps {
  className?: string;
}

export function DeleteIcon({ className }: IconProps) {
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
        d="M8.333 3.25a.083.083 0 0 0-.083.083v1.75h3.5v-1.75a.083.083 0 0 0-.084-.083zm4.917 1.833v-1.75a1.583 1.583 0 0 0-1.584-1.583H8.333A1.583 1.583 0 0 0 6.75 3.333v1.75H3.333a.75.75 0 1 0 0 1.5h.143l.774 9.284a2.417 2.417 0 0 0 2.416 2.383h6.667a2.417 2.417 0 0 0 2.416-2.383l.774-9.284h.143a.75.75 0 1 0 0-1.5zm-8.269 1.5.766 9.188q.003.03.003.062a.917.917 0 0 0 .916.917h6.667a.917.917 0 0 0 .917-.917l.002-.062.766-9.188zm3.352 1.834a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75m3.333 0a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75"
        clipRule="evenodd"
      />
    </svg>
  );
}
