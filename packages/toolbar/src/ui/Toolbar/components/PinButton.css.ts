import { style } from '@vanilla-extract/css';

export const pinButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--lp-color-gray-500)',
  transition: 'color 0.15s ease, transform 0.15s ease',
  borderRadius: '4px',

  ':hover': {
    color: 'var(--lp-color-yellow-500)',
    background: 'var(--lp-color-gray-800)',
  },

  ':active': {
    transform: 'scale(0.95)',
  },
});

export const pinned = style({
  color: 'var(--lp-color-yellow-500)',
});

export const pinIcon = style({
  width: '14px',
  height: '14px',
});
