import { style } from '@vanilla-extract/css';

export const settingsGroup = style({
  borderBottom: '1px solid var(--lp-color-gray-600);',

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const settingsGroupTitle = style({
  margin: 0,
  padding: '16px 20px 8px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const switch_ = style({
  fontSize: '12px',
  backgroundColor: 'var(--lp-color-gray-950)',
});

export const settingInfo = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});

export const settingDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const settingName = style({
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--lp-color-gray-200)',
});

export const settingDescription = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-200)',
  fontWeight: 400,
});

export const settingValue = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const statusIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'flex-end',
});

export const statusText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const icon = style({
  width: '16px',
  height: '16px',
  fill: 'currentColor',
  flexShrink: 0,
});

export const select = style({
  background: 'transparent',
  minWidth: '160px',
  maxWidth: '200px',
  flexShrink: 0,
});

export const selectedValue = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});
