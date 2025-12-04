import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  backgroundColor: 'var(--lp-color-gray-900)',
  borderRadius: '8px',
  border: '1px solid var(--lp-color-gray-800)',
  transition: 'border-color 0.2s',

  selectors: {
    '&:hover:not([data-disabled="true"])': {
      borderColor: 'var(--lp-color-gray-700)',
    },
    '&[data-disabled="true"]': {
      opacity: 0.6,
    },
  },
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

export const iconContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  backgroundColor: 'var(--lp-color-gray-800)',
  borderRadius: '8px',
  flexShrink: 0,
  color: 'var(--lp-color-gray-300)',
});

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
});

export const title = style({
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
});

export const description = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  margin: 0,
  lineHeight: 1.4,
});

export const comingSoonBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  backgroundColor: 'var(--lp-color-gray-800)',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginLeft: '8px',
});

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const inputLabel = style({
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-400)',
});

export const input = style({
  padding: '10px 12px',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '13px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-100)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',

  selectors: {
    '&::placeholder': {
      color: 'var(--lp-color-gray-500)',
    },
    '&:focus': {
      borderColor: 'var(--lp-color-blue-500)',
      boxShadow: '0 0 0 2px rgba(64, 91, 255, 0.2)',
    },
  },
});

export const actions = style({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

export const actionsDisabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
});

export const actionButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  transition: 'all 0.15s',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
    },
    '&:active': {
      backgroundColor: 'var(--lp-color-gray-600)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const actionIcon = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
});

export const ideIconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: '16px',
  height: '16px',
  flexShrink: 0,
});

export const ideIconSvg = style({
  width: '16px',
  height: '16px',
});

// Split button styles (using LaunchPad UI ButtonGroup with custom dropdown)
export const splitButtonContainer = style({
  position: 'relative',
  display: 'inline-flex',
});

export const splitButtonGroup = style({
  display: 'inline-flex',
});

export const splitButtonMain = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 500,
  height: '36px', 
  borderRadius: '6px 0 0 6px', 
  borderRight: 'none',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  color: 'var(--lp-color-gray-200)',
  transition: 'all 0.15s',

  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
    },
    '&:active:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-600)',
    },
  },
});

export const splitButtonDropdown = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '36px',
  width: '36px',
  padding: '0',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderLeft: 'none',
  borderRadius: '0 6px 6px 0',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  transition: 'all 0.15s',

  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
    },
    '&:active:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-600)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
      zIndex: 1,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const splitButtonDropdownOpen = style({
  backgroundColor: 'var(--lp-color-gray-700)',
  borderColor: 'var(--lp-color-gray-600)',
});

export const splitButtonDropdownSuccess = style({
  color: 'var(--lp-color-green-500)',
});

export const dropdownMenu = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 'calc(100% - 36px)', // Align left edge with arrow button's left edge (36px button width)
  minWidth: '180px',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 10,
  overflow: 'hidden',
});

export const dropdownItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '10px 12px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  textAlign: 'left',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
    },
    '&:not(:last-child)': {
      borderBottom: '1px solid var(--lp-color-gray-700)',
    },
  },
});

export const dropdownItemSelected = style({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
});

export const dropdownSeparator = style({
  height: '1px',
  backgroundColor: 'var(--lp-color-gray-700)',
  margin: '4px 0',
});

export const preferredBadge = style({
  marginLeft: 'auto',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});
