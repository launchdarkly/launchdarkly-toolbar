import { style } from '@vanilla-extract/css';

export const toggle = style({
  position: 'relative',
  width: '44px',
  height: '24px',
  backgroundColor: 'var(--lp-color-gray-700)',
  border: '1px solid var(--lp-color-gray-600)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: 0,

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
});

export const checked = style({
  backgroundColor: 'var(--lp-color-blue-600)',
  borderColor: 'var(--lp-color-blue-500)',
});

export const thumb = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '18px',
  height: '18px',
  backgroundColor: 'white',
  borderRadius: '50%',
  transition: 'transform 0.2s ease',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',

  selectors: {
    [`${checked} &`]: {
      transform: 'translateX(20px)',
    },
  },
});
