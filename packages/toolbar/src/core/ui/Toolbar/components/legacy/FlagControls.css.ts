import { style, globalStyle } from '@vanilla-extract/css';

export const switch_ = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
});

export const switchContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

globalStyle(`${switchContainer} label`, {
  backgroundColor: 'transparent',
});

export const customVariantContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '4px',
  minWidth: '120px',
  maxWidth: '160px',
});

export const jsonEditorContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row-reverse',
  gap: '4px',
  minWidth: '120px',
  maxWidth: '160px',
});

export const currentValueGroup = style({
  display: 'flex',
  alignItems: 'center',
  background: 'var(--lp-color-gray-950)',
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

export const customVariantFieldGroup = style({
  gap: '2px',
  paddingRight: '0',
  alignItems: 'center',
  width: '100%',
});

export const currentValue = style({
  padding: '6px 8px',
  background: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '14px',
  color: 'var(--lp-color-gray-200)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  height: '32px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  fontVariantNumeric: 'tabular-nums', // Consistent width for numbers
});

export const customVariantField = style({
  width: '100%',
  height: '32px',
  backgroundColor: 'transparent',
  flex: 1,
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
  fontVariantNumeric: 'tabular-nums', // Consistent width for numbers
});

export const select = style({
  background: 'transparent',
  minWidth: '120px',
  maxWidth: '160px',
});

export const selectedValue = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});

export const icon = style({
  width: '16px',
  height: '16px',
  fill: 'currentColor',
});
