import { style } from '@vanilla-extract/css';

export const list = style({
  padding: 0,
  margin: 0,
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
  color: 'var(--lp-color-gray-200)',
  transition: 'background-color 0.2s ease',

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});
