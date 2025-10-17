import { style } from '@vanilla-extract/css';

export const genericHelpText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '40px 20px',
  minHeight: '400px',
  color: 'var(--lp-color-gray-400)',
  textAlign: 'center',
});

export const genericHelpTextP = style({
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
});

export const genericHelpTextSpan = style({
  fontSize: '14px',
  opacity: 0.8,
});
