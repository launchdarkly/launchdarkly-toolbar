import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '12px 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const bottomRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
});

export const tab = style({
  background: 'transparent',
  border: '1px solid var(--lp-color-gray-600)',
  color: 'var(--lp-color-gray-200)',
  padding: '6px 20px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },

  selectors: {
    '&:hover:not([data-active="true"])': {
      background: 'var(--lp-color-gray-800)',
      borderColor: 'var(--lp-color-gray-500)',
    },
  },
});

export const activeTab = style({
  background: '#283050',
  borderColor: '#6A78D1',
  color: 'white',

  selectors: {
    '&:hover': {
      background: '#2d3858',
      borderColor: '#7583e0',
    },
  },
});

export const statusText = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  fontWeight: 400,
});
