import { style } from '@vanilla-extract/css';

export const section = style({
  marginBottom: '24px',
});

export const title = style({
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '12px',
  padding: '0 4px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
