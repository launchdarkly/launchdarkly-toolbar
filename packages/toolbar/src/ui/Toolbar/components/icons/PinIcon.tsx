export function PinIcon({ filled = false, className }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.5 2C10.5 1.72386 10.2761 1.5 10 1.5H6C5.72386 1.5 5.5 1.72386 5.5 2V6C5.5 6.27614 5.27614 6.5 5 6.5H3C2.72386 6.5 2.5 6.72386 2.5 7V8.5C2.5 8.77614 2.72386 9 3 9H7.25V14C7.25 14.4142 7.58579 14.75 8 14.75C8.41421 14.75 8.75 14.4142 8.75 14V9H13C13.2761 9 13.5 8.77614 13.5 8.5V7C13.5 6.72386 13.2761 6.5 13 6.5H11C10.7239 6.5 10.5 6.27614 10.5 6V2Z" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2H10V6H13V8.5H8.75V14M7.25 14V8.5H3V6H6V2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
