import { style } from '@vanilla-extract/css';

export const toolbar = style({
  display: 'flex',
  borderRadius: '8px',
  padding: '6px',
  overflow: 'hidden',
  width: '100%',
  position: 'relative',
});

export const tabsContainer = style({
  display: 'flex',
  gap: '6px',
  width: '100%',
  position: 'relative',
});

export const activeIndicator = style({
  position: 'absolute',
  top: 0,
  height: '100%',
  backgroundColor: 'var(--lp-color-gray-700)',
  borderRadius: 'var(--radius)',
  zIndex: 0,
  transition: 'left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});

export const tab = style({
  borderRadius: 'var(--radius)',
  transition: 'all var(--lp-duration-150) ease',
  color: 'var(--lp-color-gray-400)',
  background: 'transparent',
  flex: 1,
  minWidth: 0,
  border: 'none',
  padding: '8px 12px',
  cursor: 'pointer',
  fontFamily: 'var(--lp-font-family-base)',
  fontSize: '14px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  position: 'relative',
  zIndex: 1,

  ':hover': {
    color: 'var(--lp-color-gray-200)',
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':disabled': {
    color: 'var(--lp-color-gray-600)',
    cursor: 'not-allowed',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

// Active tab modifier
export const tabActive = style({
  color: 'var(--lp-color-white-950)',
  backgroundColor: 'transparent',

  ':hover': {
    backgroundColor: 'transparent',
  },
});

export const iconSvg = style({
  width: '24px',
  height: '24px',
  fill: 'currentColor',
});
