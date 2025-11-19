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
        d="M12.5 4.083a.75.75 0 0 1 0-1.5h4.166a.75.75 0 0 1 .75.75V7.5a.75.75 0 1 1-1.5 0V5.144l-6.22 6.22a.75.75 0 1 1-1.06-1.061l6.22-6.22zm-9.21.875A2.42 2.42 0 0 1 5 4.25h5a.75.75 0 1 1 0 1.5H5a.917.917 0 0 0-.917.917V15a.917.917 0 0 0 .917.917h8.333A.917.917 0 0 0 14.25 15v-5a.75.75 0 0 1 1.5 0v5a2.417 2.417 0 0 1-2.417 2.417H5A2.417 2.417 0 0 1 2.583 15V6.667c0-.641.255-1.256.708-1.71"
        clip-rule="evenodd"
      />
    </svg>
  );
}
