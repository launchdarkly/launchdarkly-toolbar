import { style, keyframes } from '@vanilla-extract/css';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loginContainer = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '0px',
  width: '100%',
  minHeight: '450px',
  overflow: 'hidden',
});

export const loginHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px 0 16px',
  backgroundColor: 'var(--lp-color-gray-900)',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  minHeight: '56px',
});

export const headerLogo = style({
  width: '154px',
  height: 'auto',
  objectFit: 'contain',
  filter: 'brightness(0) invert(1)',
});

export const loginMainContent = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  flex: 1,
});

export const closeButtonArea = style({
  display: 'flex',
  alignItems: 'center',
});

export const actionButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  color: 'var(--lp-color-gray-400)',
  width: '36px',
  height: '36px',

  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  selectors: {
    '&:hover:not(:disabled)': {
      color: 'var(--lp-color-gray-200)',
      backgroundColor: 'var(--lp-color-gray-800)',
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
  },
});

export const loginContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
});

export const title = style({
  color: 'var(--lp-color-gray-100)',
  fontSize: '1.5rem',
  fontWeight: '600',
  margin: '0 0 0.75rem 0',
  lineHeight: '1.25',
});

export const description = style({
  color: 'var(--lp-color-gray-300)',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  margin: '0 0 1.5rem 0',
  maxWidth: '320px',
});

export const errorMessage = style({
  backgroundColor: 'var(--ld-color-red-900)',
  border: '1px solid var(--ld-color-red-600)',
  color: 'var(--ld-color-red-100)',
  padding: '0.75rem 1rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  marginBottom: '1rem',
  width: '100%',
  boxSizing: 'border-box',
});

export const loginButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  backgroundColor: 'var(--lp-color-gray-800)',
  color: 'white',
  fontWeight: '500',
  fontSize: '0.875rem',
  padding: '0.75rem 1.5rem',
  border: '1px solid var(--lp-color-gray-600)',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  minHeight: '2.5rem',
  width: '100%',
  marginBottom: '1rem',
  
  ':disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
  },

  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-700)',
    },
  },
});

export const spinner = style({
  width: '1rem',
  height: '1rem',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
});

export const helpText = style({
  color: 'var(--lp-color-gray-400)',
  fontSize: '0.75rem',
  margin: 0,
  lineHeight: '1.5',
});

export const helpLink = style({
  color: 'var(--lp-color-gray-100)',
  textDecoration: 'none',
  fontWeight: '500',
  
  selectors: {
    '&:hover': {
      color: 'var(--lp-color-gray-50)',
      textDecoration: 'underline',
    },
  },
});
