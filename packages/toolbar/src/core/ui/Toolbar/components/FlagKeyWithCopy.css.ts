import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  minWidth: 0,
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  textAlign: 'left',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '1px',
  },
});

export const flagKeyText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,

  selectors: {
    [`${container}:hover &`]: {
      color: 'var(--lp-color-gray-200)',
    },
  },
});

export const copyIcon = style({
  flexShrink: 0,
  opacity: 0.7,
  width: '16px',
  height: '16px',

  selectors: {
    [`${container}:hover &`]: {
      color: 'var(--lp-color-gray-200)',
    },
  },
});

export const copied = style({
  cursor: 'default',
});

export const copiedText = style({
  fontSize: '12px',
  fontFamily: 'var(--lp-font-family-monospace)',
  fontWeight: 500,
});

export const checkIcon = style({
  flexShrink: 0,
  width: '16px',
  height: '16px',
});
