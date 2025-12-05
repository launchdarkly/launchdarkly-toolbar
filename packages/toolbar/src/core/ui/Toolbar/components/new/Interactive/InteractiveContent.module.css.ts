import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
});

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '60px 20px',
  color: 'var(--lp-color-gray-400)',
  textAlign: 'center',
});

export const message = style({
  margin: 0,
  fontSize: '14px',
  color: 'var(--lp-color-gray-400)',
  maxWidth: '280px',
  lineHeight: 1.5,
});

export const inlineIcon = style({
  display: 'inline-flex',
  verticalAlign: 'middle',
  width: '16px',
  height: '16px',
  marginRight: '2px',
  marginLeft: '2px',
});
