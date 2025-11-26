import { style, globalStyle } from '@vanilla-extract/css';
import { Z_INDEX } from '../constants/zIndex';

export const selectContainer = style({
  position: 'relative',
  display: 'inline-block',
  minWidth: '120px',
  maxWidth: '200px',
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '32px',
  padding: '0 8px',
  background: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '14px',
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  gap: '8px',
  boxSizing: 'border-box',

  ':hover': {
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':focus': {
    outline: 'none',
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':active': {
    borderColor: 'var(--lp-color-gray-500)',
  },
});

export const disabled = style({
  opacity: 0.6,
  cursor: 'not-allowed',
  pointerEvents: 'none',
});

export const value = style({
  flex: 1,
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const placeholder = style({
  color: 'var(--lp-color-gray-500)',
});

export const icon = style({
  width: '16px',
  height: '16px',
  fill: 'currentColor',
  flexShrink: 0,
  transition: 'transform 0.2s ease',
});

export const iconOpen = style({
  transform: 'rotate(180deg)',
});

export const dropdown = style({
  zIndex: Z_INDEX.POPOVER,
  background: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  maxHeight: '200px',
  overflow: 'hidden',
  pointerEvents: 'auto',
});

export const list = style({
  margin: 0,
  padding: '4px 0',
  listStyle: 'none',
  maxHeight: '196px', // Account for padding
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--lp-color-gray-600) transparent',

  // Custom scrollbar for webkit browsers
  '::-webkit-scrollbar': {
    width: '6px',
  },

  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },

  '::-webkit-scrollbar-thumb': {
    background: 'var(--lp-color-gray-600)',
    borderRadius: '3px',
  },

  // Note: webkit scrollbar hover styles are handled by browser defaults
});

export const option = style({
  padding: '8px 12px',
  fontSize: '14px',
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  borderRadius: '4px',
  margin: '0 4px',
  transition: 'all 0.1s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },
});

export const focused = style({
  backgroundColor: 'var(--lp-color-gray-800)',
});

export const selected = style({
  backgroundColor: 'var(--lp-color-gray-800)',
  color: 'var(--lp-color-gray-200)',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },
});

// Dark theme support
globalStyle(`[data-theme="dark"] ${selectContainer}`, {
  // Dark theme styles are already the default
});

// Light theme support (if needed in the future)
globalStyle(`[data-theme="light"] ${trigger}`, {
  background: 'var(--lp-color-white)',
  border: '1px solid var(--lp-color-gray-300)',
  color: 'var(--lp-color-gray-900)',
});

globalStyle(`[data-theme="light"] ${dropdown}`, {
  background: 'var(--lp-color-white)',
  border: '1px solid var(--lp-color-gray-300)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

globalStyle(`[data-theme="light"] ${option}`, {
  color: 'var(--lp-color-gray-900)',
});

globalStyle(`[data-theme="light"] ${option}:hover`, {
  backgroundColor: 'var(--lp-color-gray-100)',
});

globalStyle(`[data-theme="light"] ${focused}`, {
  backgroundColor: 'var(--lp-color-gray-100)',
});

globalStyle(`[data-theme="light"] ${selected}`, {
  backgroundColor: 'var(--lp-color-blue-100)',
  color: 'var(--lp-color-blue-900)',
});
