import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const text = style({
  fontSize: '14px',
  color: 'var(--lp-color-gray-300)',
});

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
});

export const connected = style({
  backgroundColor: 'var(--lp-color-green-500)',
  boxShadow: '0 0 8px var(--lp-color-green-500)',
});

export const disconnected = style({
  backgroundColor: 'var(--lp-color-gray-500)',
});

export const error = style({
  backgroundColor: 'var(--lp-color-red-500)',
  boxShadow: '0 0 8px var(--lp-color-red-500)',
});
