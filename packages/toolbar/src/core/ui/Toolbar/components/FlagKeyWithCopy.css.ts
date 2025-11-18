import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  minWidth: 0,
});

export const flagKeyText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const copyButton = style({
  flexShrink: 0,
  opacity: 0.7,
  padding: '4px',
  width: '24px',
  height: '24px',
  
  ':hover': {
    opacity: 1,
  },
});

