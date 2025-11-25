import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '4px 0',
});

export const value = style({
  fontSize: '14px',
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const placeholder = style({
  padding: '16px',
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  textAlign: 'center',
});

