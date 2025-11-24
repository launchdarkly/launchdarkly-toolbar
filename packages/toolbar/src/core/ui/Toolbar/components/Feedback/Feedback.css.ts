import { style } from '@vanilla-extract/css';

export const feedbackContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px 20px',
});

export const title = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
  marginBottom: '8px',
});

export const sentimentContainer = style({
  display: 'flex',
  gap: '8px',
});

export const sentimentButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  border: '1px solid var(--lp-color-gray-700)',
  backgroundColor: 'transparent',
  color: 'var(--lp-color-gray-400)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',

  ':focus': {
    outline: 'none',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--lp-color-gray-800)',
      borderColor: 'var(--lp-color-gray-600)',
      color: 'var(--lp-color-gray-200)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
    '&[data-selected="true"]': {
      backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.1)',
      borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
      color: 'var(--lp-color-brand-cyan-base)',
    },
    '&[data-selected="true"]:hover:not(:disabled)': {
      backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.15)',
      borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.4)',
    },
  },
});

export const commentForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '8px',
});

export const textField = style({
  width: '100%',
});

export const submitButton = style({
  alignSelf: 'flex-end',
});

export const successMessage = style({
  color: 'var(--lp-color-gray-200)',
  fontSize: '13px',
  marginTop: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'var(--lp-color-gray-800)',
  borderRadius: '4px',
  border: '1px solid var(--lp-color-gray-700)',
});

export const successIcon = style({
  color: 'var(--lp-color-green-500)',
  flexShrink: 0,
});
