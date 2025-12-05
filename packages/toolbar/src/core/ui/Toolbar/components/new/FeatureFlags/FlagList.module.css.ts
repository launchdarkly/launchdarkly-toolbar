import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const statsHeader = style({
  padding: '8px 20px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  backgroundColor: 'var(--lp-color-gray-900)',
  flexShrink: 0,
});

export const statsText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontWeight: 500,
});

export const scrollContainer = style({
  paddingTop: '8px',
  paddingBottom: '20px',
  flex: 1,
  width: '100%',
  overflow: 'auto',
  position: 'relative',
});

export const virtualInner = style({
  width: '100%',
  position: 'relative',
});
