import { style } from '@vanilla-extract/css';

export const warningContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  padding: '40px 20px',
  textAlign: 'center',
});

export const warningMessage = style({
  background: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  color: 'var(--lp-color-gray-300)',
  padding: '24px',
  borderRadius: '8px',
  fontSize: '14px',
  maxWidth: '400px',
});

export const warningTitle = style({
  fontWeight: 600,
  marginBottom: '16px',
  fontSize: '16px',
  color: 'var(--lp-color-gray-200)',
});

export const warningText = style({
  marginBottom: '16px',
  color: 'var(--lp-color-gray-300)',
});

export const warningHelp = style({
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  fontStyle: 'italic',
});
