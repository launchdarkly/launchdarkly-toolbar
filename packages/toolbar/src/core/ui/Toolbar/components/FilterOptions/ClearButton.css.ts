import { style } from '@vanilla-extract/css';

export const clearButton = style({
  background: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-200)',
  padding: '6px 8px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  flexShrink: 0,

  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
    borderRadius: '4px',
  },

  selectors: {
    '&:hover:not(:disabled)': {
      color: 'var(--lp-color-gray-100)',
    },
  },
});

export const smallIcon = style({
  width: '14px',
  height: '14px',
});
