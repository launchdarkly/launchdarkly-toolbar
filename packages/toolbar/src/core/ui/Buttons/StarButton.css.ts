import { style } from '@vanilla-extract/css';

export const starButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  color: 'var(--lp-color-gray-400)',
  width: '24px',
  height: '24px',

  selectors: {
    '&:hover': {
      color: 'var(--lp-color-gray-200)',
      backgroundColor: 'var(--lp-color-gray-800)',
      transform: 'scale(1.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
  },
});

export const starButtonStarred = style({
  color: '#eab308', // Yellow-500 for starred state

  selectors: {
    '&:hover': {
      color: '#facc15', // Yellow-400 on hover
      backgroundColor: 'var(--lp-color-gray-800)',
      transform: 'scale(1.1)',
    },
  },
});

export const starIcon = style({
  width: '16px',
  height: '16px',
});
