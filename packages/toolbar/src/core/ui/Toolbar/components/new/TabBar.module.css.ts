import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
  minHeight: '48px',
});

export const tabs = style({
  display: 'flex',
  gap: '24px',
  flex: 1,
});

export const tab = style({
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-400)',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: '12px 0',
  position: 'relative',
  transition: 'color 0.2s ease',

  ':hover': {
    color: 'var(--lp-color-gray-200)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
});

export const active = style({
  color: 'var(--lp-color-gray-100)',

  '::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--lp-color-gray-100)',
  },
});
