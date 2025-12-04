import { style } from '@vanilla-extract/css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingBottom: '4px',
});

export const icon = style({
  width: '20px',
  height: '20px',
  color: 'var(--lp-color-gray-500)',
});

export const title = style({
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: 0,
});

export const cards = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

