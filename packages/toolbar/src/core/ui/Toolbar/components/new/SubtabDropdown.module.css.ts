import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../constants/zIndex';

export const container = style({
  position: 'relative',
  display: 'inline-block',
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-200)',
  fontSize: '14px',
  fontWeight: 500,
  padding: '8px 12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '120px',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
});

export const triggerOpen = style({
  backgroundColor: 'var(--lp-color-gray-800)',
  borderColor: 'var(--lp-color-gray-600)',
});

export const filterIcon = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
});

export const label = style({
  flex: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
});

export const chevron = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const chevronIcon = style({
  width: '16px',
  height: '16px',
});

export const menu = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  minWidth: '100%',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  boxShadow: `
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2)
  `,
  zIndex: Z_INDEX.POPOVER,
  overflow: 'hidden',
});

export const menuItem = style({
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-300)',
  fontSize: '14px',
  fontWeight: 400,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'all 0.15s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    color: 'var(--lp-color-gray-100)',
  },

  ':focus': {
    outline: 'none',
    backgroundColor: 'var(--lp-color-gray-750)',
  },
});

export const menuItemActive = style({
  backgroundColor: 'var(--lp-color-gray-750)',
  color: 'var(--lp-color-gray-100)',
  fontWeight: 500,
});
