import { style } from '@vanilla-extract/css';

export const alertContainer = style({
  // marginBottom: '8px',
});

export const alertContentWithIcon = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

export const infoIcon = style({
  width: '20px',
  height: '20px',
  flexShrink: 0,
  marginTop: '2px',
  color: 'var(--lp-color-blue-400)',
});

export const alertContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flex: 1,
  minWidth: 0,
});

export const textContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const title = style({
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
});

export const description = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-300)',
  margin: 0,
  lineHeight: 1.4,
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

export const actionButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '6px 10px',
  height: '28px',
  boxSizing: 'border-box',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1,
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  transition: 'all 0.15s',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
  margin: 0,

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
      textDecoration: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const primaryButton = style({
  backgroundColor: 'var(--lp-color-blue-600)',
  borderColor: 'var(--lp-color-blue-500)',
  color: 'var(--lp-color-white)',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-blue-500)',
      borderColor: 'var(--lp-color-blue-400)',
    },
  },
});

export const doneButton = style({
  marginLeft: 'auto',
});

export const cursorIcon = style({
  width: '14px',
  height: '14px',
  flexShrink: 0,
});
