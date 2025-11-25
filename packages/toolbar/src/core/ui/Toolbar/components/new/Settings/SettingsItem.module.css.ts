import { style } from '@vanilla-extract/css';

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-800)',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  gap: '16px',

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
  minWidth: 0,
});

export const label = style({
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-100)',
});

export const description = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  lineHeight: '1.4',
});

export const control = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
});
