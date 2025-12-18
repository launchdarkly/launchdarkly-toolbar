import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../constants/zIndex';

export const container = style({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
});

export const searchContainer = style({
  position: 'relative',
});

export const searchDropdown = style({
  position: 'absolute',
  top: '100%',
  right: '-100px',
  marginTop: '6px',
  minWidth: '220px',
  padding: '8px 12px',
  borderRadius: '8px',
  zIndex: Z_INDEX.POPOVER,
});

export const searchDropdownLeft = style({
  position: 'absolute',
  top: '-10px',
  right: '85%',
  marginTop: '6px',
  minWidth: '220px',
  padding: '8px 12px',
  borderRadius: '8px',
  zIndex: Z_INDEX.POPOVER,
});

export const actionButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  padding: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--lp-color-gray-400)',
  transition: 'all 0.2s ease',

  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-700)',
      color: 'var(--lp-color-gray-200)',
    },
    '&:active:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-600)',
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '2px',
    },
  },
});

export const clearButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  padding: '6px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--lp-color-gray-400)',
  transition: 'all 0.2s ease',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
      color: 'var(--lp-color-red-400)',
    },
    '&:active': {
      backgroundColor: 'var(--lp-color-gray-600)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '2px',
    },
  },
});

export const icon = style({
  width: '24px',
  height: '24px',
});
