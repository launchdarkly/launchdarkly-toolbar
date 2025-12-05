import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '10px 0',
  borderBottom: '1px solid var(--lp-color-gray-600);',
  overflowX: 'auto',
  display: 'flex',
  gap: '8px',
  paddingLeft: '20px',
  paddingRight: '20px',
  scrollbarColor: 'var(--lp-color-gray-700) transparent',
  scrollbarWidth: 'thin',

  selectors: {
    '&::-webkit-scrollbar': {
      height: '4px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
});

export const actionButton = style({
  background: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-600)',
  color: 'var(--lp-color-gray-200)',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },

  selectors: {
    '&:hover:not(:disabled)': {
      background: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-500)',
    },
  },
});

export const toggleButton = style({
  background: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-600)',
  color: 'var(--lp-color-gray-200)',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },

  selectors: {
    '&:hover:not(:disabled)': {
      background: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-500)',
    },
  },
});

export const active = style({
  background: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.1)',
  borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
  color: 'var(--lp-color-brand-cyan-base)',

  selectors: {
    '&:hover:not(:disabled)': {
      background: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.15)',
      borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.4)',
    },
  },
});
