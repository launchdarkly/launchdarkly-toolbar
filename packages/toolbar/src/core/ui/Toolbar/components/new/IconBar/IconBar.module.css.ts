import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '6px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  gap: '8px',
});

export const iconButton = style({
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-400)',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  transition: 'all 0.2s ease',
  position: 'relative',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-900)',
    color: 'var(--lp-color-gray-200)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

export const active = style({
  backgroundColor: 'var(--lp-color-gray-900)',
  color: 'var(--lp-color-gray-200)',
});

export const disabled = style({
  opacity: 0.4,
  cursor: 'not-allowed',

  ':hover': {
    backgroundColor: 'transparent',
    color: 'var(--lp-color-gray-400)',
  },
});

export const icon = style({
  width: '24px',
  height: '24px',
});

// Special hover state for interactive icon when in interactive mode
export const selectMode = style({
  backgroundColor: 'var(--lp-color-blue-900)',
  color: 'var(--lp-color-blue-400)',

  ':hover': {
    backgroundColor: 'var(--lp-color-blue-800)',
    color: 'var(--lp-color-blue-300)',
  },
});
