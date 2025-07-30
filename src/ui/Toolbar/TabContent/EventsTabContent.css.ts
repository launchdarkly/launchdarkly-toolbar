import { style } from '@vanilla-extract/css';

export const eventInfo = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const eventName = style({
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--lp-color-gray-200)',
});

export const eventMeta = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
});
