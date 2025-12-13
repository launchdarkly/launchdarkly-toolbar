import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '4px 0',
  margin: '12px',
});

export const value = style({
  fontSize: '14px',
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const placeholder = style({
  padding: '16px',
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  textAlign: 'center',
});

export const feedbackSection = style({
  marginTop: '10px',
  paddingTop: '10px',
  borderTop: '1px solid var(--lp-color-gray-700)',
  marginLeft: '-20px',
  marginRight: '-20px',
});

export const feedbackTitle = style({
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginLeft: '20px',
  padding: '0px',
});
