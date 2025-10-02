import { style } from '@vanilla-extract/css';

export const iconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  color: 'var(--lp-color-gray-400)',

  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  selectors: {
    '&:hover:not(:disabled)': {
      color: 'var(--lp-color-gray-200)',
      backgroundColor: 'var(--lp-color-gray-800)',
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const small = style([
  iconButton,
  {
    width: '30px',
    height: '30px',
  },
]);

export const medium = style([
  iconButton,
  {
    width: '36px',
    height: '36px',
  },
]);

export const large = style([
  iconButton,
  {
    width: '40px',
    height: '40px',
  },
]);
