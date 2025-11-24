import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '12px 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
});

export const filterButton = style({
  background: 'transparent',
  border: '1px solid var(--lp-color-gray-600)',
  color: 'var(--lp-color-gray-200)',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.2s ease',

  ':hover': {
    background: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-500)',
  },

  selectors: {
    '&[aria-pressed="true"]': {
      background: '#283050',
      borderColor: '#6A78D1',
      color: 'white',
    },
    '&[aria-pressed="true"]:hover': {
      background: '#2d3858',
      borderColor: '#7583e0',
    },
  },
});

export const bottomRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
});

export const statusText = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  fontWeight: 400,
});
