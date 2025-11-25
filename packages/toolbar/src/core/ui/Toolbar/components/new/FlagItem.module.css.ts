import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-800)',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-700)',
  },
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
});

export const name = style({
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-100)',
});

export const value = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
});

