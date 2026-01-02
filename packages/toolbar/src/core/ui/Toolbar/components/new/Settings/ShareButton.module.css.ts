import { style } from '@vanilla-extract/css';

export const button = style({
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-200)',
  padding: '6px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-700)',
    color: 'var(--lp-color-gray-100)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
});
