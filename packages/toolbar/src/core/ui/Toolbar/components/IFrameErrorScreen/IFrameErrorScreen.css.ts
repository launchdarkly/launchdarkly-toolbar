import { style } from '@vanilla-extract/css';

export const errorContainer = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  width: '100%',
  height: '600px',
  overflow: 'hidden',
});

export const errorHeader = style({
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

export const errorMainContent = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: '0 24px',
});

export const errorContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  maxWidth: '320px',
  textAlign: 'center',
});

export const errorTitle = style({
  color: 'var(--lp-color-gray-200)',
  fontSize: '0.875rem',
  fontWeight: 500,
  margin: 0,
  lineHeight: '1.5',
});

export const errorDescription = style({
  color: 'var(--lp-color-gray-400)',
  fontSize: '0.8125rem',
  margin: 0,
  lineHeight: '1.5',
});
