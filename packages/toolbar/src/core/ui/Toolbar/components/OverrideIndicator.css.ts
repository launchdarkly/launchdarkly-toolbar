import { style } from '@vanilla-extract/css';

export const overrideDot = style({
  display: 'inline-block',
  width: '8px',
  height: '8px',
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
  borderRadius: '50%',
  flexShrink: 0,
});

export const interactive = style({
  cursor: 'pointer',

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
});
