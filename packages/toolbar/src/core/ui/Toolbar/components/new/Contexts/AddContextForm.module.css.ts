import { style } from '@vanilla-extract/css';
import { cardBaseWithMarginRules } from '../../../../styles/card.css';
import {
  flexBetween,
  flexColumn,
  flexRow,
  flexCenter,
  buttonReset,
  transitionDefault,
} from '../../../../styles/mixins.css';

export const container = style({
  ...cardBaseWithMarginRules,
  overflow: 'auto',
  maxHeight: '60vh',
});

export const header = style({
  ...flexBetween,
  marginBottom: '20px',
});

export const title = style({
  fontSize: '18px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
});

export const closeButton = style({
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  padding: '4px',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-300)',
  },
});

export const form = style({
  ...flexColumn,
  gap: '16px',
});

export const field = style({
  ...flexColumn,
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
  ...transitionDefault,
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-100)',

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
  ...flexRow,
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '8px',
});

export const cancelButton = style({
  ...transitionDefault,
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-300)',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    borderColor: 'var(--lp-color-gray-600)',
  },
});

export const submitButton = style({
  ...flexRow,
  ...transitionDefault,
  gap: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-300)',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
