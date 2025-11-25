import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
});

export const leftSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const logo = style({
  width: '24px',
  height: '24px',
  color: 'var(--lp-color-gray-200)',
});

export const title = style({
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
});

export const rightSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const iconButton = style({
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--lp-color-gray-400)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-200)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

