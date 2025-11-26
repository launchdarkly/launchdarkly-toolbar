import { style, globalStyle } from '@vanilla-extract/css';

export const switchContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const switchControl = style({
  // Inherit theme styles
});

globalStyle(`${switchContainer} label`, {
  backgroundColor: 'transparent',
});

export const select = style({
  background: 'transparent',
  minWidth: '120px',
  maxWidth: '160px',
});

export const customVariantContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '4px',
  minWidth: '120px',
  maxWidth: '160px',
});

export const currentValueGroup = style({
  display: 'flex',
  alignItems: 'center',
  background: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  height: '32px',
  boxSizing: 'border-box',
  flex: 1,
  gap: '2px',
  paddingRight: '2px',
  minWidth: '120px',
  maxWidth: '160px',
});

export const currentValueText = style({
  padding: '6px 8px',
  fontSize: '14px',
  color: 'var(--lp-color-gray-200)',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const customVariantField = style({
  width: '100%',
  height: '32px',
  backgroundColor: 'transparent',
  flex: 1,
});

export const customVariantFieldGroup = style({
  gap: '2px',
  paddingRight: '0',
  alignItems: 'center',
  width: '100%',
});

export const jsonEditorActions = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexShrink: 0,
});
