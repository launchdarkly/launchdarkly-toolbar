import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '16px',
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-800)',
  borderRadius: '8px',
  textAlign: 'center',
});

export const text = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-300)',
  marginBottom: '4px',
});

export const subtext = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-500)',
});

