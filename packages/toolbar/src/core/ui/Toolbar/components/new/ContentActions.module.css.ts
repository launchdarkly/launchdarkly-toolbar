import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../constants/zIndex';
import { flexRow, flexCenter, buttonReset, transitionDefault, iconDefault } from '../../../styles/mixins.css';

export const container = style({
  ...flexRow,
  gap: '4px',
});

export const searchContainer = style({
  position: 'relative',
});

export const searchDropdown = style({
  position: 'absolute',
  top: '100%',
  right: '-100px',
  marginTop: '5px',
  minWidth: '220px',
  padding: '8px 12px',
  borderRadius: '8px',
  zIndex: Z_INDEX.POPOVER,
});

export const searchDropdownFlags = style({
  position: 'absolute',
  top: '100%',
  right: '-150px',
  marginTop: '5px',
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
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  width: '40px',
  height: '40px',
  padding: '8px',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-400)',

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
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  width: '32px',
  height: '32px',
  padding: '6px',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-400)',

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

export const icon = style(iconDefault);
