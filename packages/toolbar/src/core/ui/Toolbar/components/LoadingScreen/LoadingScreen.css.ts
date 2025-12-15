import { style, keyframes } from '@vanilla-extract/css';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loadingContainer = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  width: '100%',
  height: '600px',
  overflow: 'hidden',
});

export const loadingHeader = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  backgroundColor: 'var(--lp-color-gray-950)',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  minHeight: '56px',
});

export const headerLogo = style({
  width: '154px',
  height: 'auto',
  objectFit: 'contain',
  filter: 'brightness(0) invert(1)',
});

export const loadingMainContent = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

export const loadingContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});

export const spinner = style({
  width: '2.5rem',
  height: '2.5rem',
  border: '3px solid var(--lp-color-gray-700)',
  borderTop: '3px solid var(--lp-color-gray-300)',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
});

export const loadingText = style({
  color: 'var(--lp-color-gray-300)',
  fontSize: '0.875rem',
  margin: 0,
  lineHeight: '1.5',
});
