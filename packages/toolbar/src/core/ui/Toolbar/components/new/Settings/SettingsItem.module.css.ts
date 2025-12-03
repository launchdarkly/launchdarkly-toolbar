import { style } from '@vanilla-extract/css';

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--lp-color-gray-850)',
  transition: 'all 0.2s ease',
  gap: '16px',
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

export const switch_ = style({
  fontSize: '12px',
  backgroundColor: 'var(--lp-color-gray-950)',
});
