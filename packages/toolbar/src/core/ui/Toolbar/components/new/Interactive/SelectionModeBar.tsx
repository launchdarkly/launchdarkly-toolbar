import { createPortal } from 'react-dom';
import { useElementSelection } from '../../../context/ElementSelectionProvider';

const SelectorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function SelectionModeBar() {
  const { isSelecting, exitSelection } = useElementSelection();

  if (!isSelecting) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2147400050,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderRadius: '8px',
        padding: '10px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      data-ld-selection-bar="true"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'white',
          fontSize: '14px',
        }}
      >
        <span
          style={{
            color: '#405BFF',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SelectorIcon />
        </span>
        <span>Click on any element to select it</span>
      </div>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '14px',
          transition: 'background-color 0.2s, color 0.2s',
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          exitSelection();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
        }}
      >
        <CloseIcon />
        <span>Exit</span>
      </button>
    </div>,
    document.body,
  );
}
