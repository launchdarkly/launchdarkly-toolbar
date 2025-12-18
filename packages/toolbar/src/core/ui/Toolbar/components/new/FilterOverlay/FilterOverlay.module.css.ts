import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../../constants/zIndex';

export const overlay = style({
  position: 'absolute',
  top: '100%',
  right: '-50px',
  marginTop: '8px',
  minWidth: '220px',
  backgroundColor: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  zIndex: Z_INDEX.POPOVER,
  overflow: 'hidden',
});

export const overlayFlags = style({
  position: 'absolute',
  top: '100%',
  right: '-95px',
  marginTop: '8px',
  minWidth: '220px',
  backgroundColor: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  zIndex: Z_INDEX.POPOVER,
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
});

export const title = style({
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
  margin: 0,
});

export const resetButton = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-200)',
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  paddingTop: '7px',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':disabled': {
    color: 'var(--lp-color-gray-500)',
    cursor: 'not-allowed',
  },
});

export const content = style({
  padding: '8px',
});

export const filterOption = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  width: '100%',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

export const filterOptionActive = style({
  backgroundColor: 'var(--lp-color-gray-800)',
});

export const checkbox = style({
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  border: '2px solid var(--lp-color-gray-500)',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.15s ease',
});

export const checkboxChecked = style({
  borderColor: 'var(--lp-color-gray-400)',
  backgroundColor: 'var(--lp-color-gray-400)',
});

export const checkmark = style({
  width: '16px',
  height: '16px',
});

export const filterLabel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const filterName = style({
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
});

export const filterDescription = style({
  fontSize: '11px',
  color: 'var(--lp-color-gray-400)',
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.POPOVER - 1,
});

export const container = style({
  position: 'relative',
});

export const filterCount = style({
  position: 'absolute',
  top: '-1px',
  right: '-4px',
  minWidth: '16px',
  height: '16px',
  borderRadius: '8px',
  backgroundColor: 'var(--lp-color-gray-600)',
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  lineHeight: 1,
});
