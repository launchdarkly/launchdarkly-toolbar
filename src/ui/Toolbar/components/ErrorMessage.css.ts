import { style } from '@vanilla-extract/css';

export const errorContainer = style({
  height: 400,
});

export const errorMessage = style({
  background: 'var(--lp-color-red-900)',
  border: '1px solid var(--lp-color-red-600)',
  color: 'var(--lp-color-red-200)',
  padding: '8px 12px',
  margin: '12px 20px',
  borderRadius: '6px',
  fontSize: '12px',
});
