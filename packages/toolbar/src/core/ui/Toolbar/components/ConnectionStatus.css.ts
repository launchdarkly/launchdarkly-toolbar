import { style } from '@vanilla-extract/css';

export const connectionStatus = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderBottom: '1px solid var(--lp-color-gray-600);',
});

export const statusIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'flex-end',
});

export const statusText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const lastSync = style({
  fontSize: '10px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
});
