import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  margin: '12px',
  borderRadius: '8px',
  padding: '16px',
  overflow: 'auto',
  maxHeight: '60vh',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
});

export const title = style({
  fontSize: '18px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
});

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-300)',
  },
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const label = style({
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-300)',
});

export const required = style({
  color: 'var(--lp-color-red-400)',
});

export const input = style({
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-100)',
  transition: 'all 0.2s ease',

  ':focus': {
    outline: 'none',
    borderColor: 'var(--lp-color-brand-cyan-base)',
    boxShadow: '0 0 0 3px rgba(from var(--lp-color-brand-cyan-base) r g b / 0.1)',
  },

  '::placeholder': {
    color: 'var(--lp-color-gray-500)',
  },
});

export const jsonEditorContainer = style({
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  overflow: 'auto',
  minHeight: '200px',
  maxHeight: '400px',
});

export const errorText = style({
  fontSize: '12px',
  color: 'var(--lp-color-red-400)',
  marginTop: '8px',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '8px',
});

export const cancelButton = style({
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-300)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    borderColor: 'var(--lp-color-gray-600)',
  },
});

export const submitButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-300)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
