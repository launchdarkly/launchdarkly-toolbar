import { style, keyframes } from '@vanilla-extract/css';

const slideUp = keyframes({
  '0%': {
    transform: 'translateY(100%)',
    opacity: 0,
  },
  '100%': {
    transform: 'translateY(0)',
    opacity: 1,
  },
});

export const overlay = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: '12px',
  backgroundColor: 'var(--lp-color-gray-900)',
  borderTop: '1px solid var(--lp-color-gray-700)',
  animation: `${slideUp} 0.3s ease-out`,
});

export const container = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

export const infoIcon = style({
  width: '20px',
  height: '20px',
  flexShrink: 0,
  marginTop: '2px',
  color: 'var(--lp-color-gray-300)',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const textContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
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

export const privacyLink = style({
  color: 'var(--lp-color-gray-50)',
  textDecoration: 'none',
  fontSize: '12px',

  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px',
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
  fontFamily: 'inherit',
  margin: 0,

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const primaryButton = style({
  selectors: {
    '&[type="button"]': {
      backgroundColor: 'var(--lp-color-blue-600)',
      borderColor: 'var(--lp-color-blue-500)',
      // Use pure white for sufficient contrast against blue-600 background (WCAG AA)
      color: 'var(--lp-color-gray-100)',
    },
    '&[type="button"]:hover': {
      backgroundColor: 'var(--lp-color-blue-500)',
      borderColor: 'var(--lp-color-blue-400)',
      color: 'var(--lp-color-gray-100)',
    },
  },
});

export const closeButton = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '24px',
  height: '24px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',
  cursor: 'pointer',
  transition: 'all 0.15s',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-800)',
      color: 'var(--lp-color-gray-200)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const closeIcon = style({
  width: '14px',
  height: '14px',
});
