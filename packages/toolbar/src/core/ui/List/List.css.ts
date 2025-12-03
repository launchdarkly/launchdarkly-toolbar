import { style } from '@vanilla-extract/css';

export const list = style({
  padding: 0,
  margin: 0,
});

export const listItem = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '8px',
  padding: '16px',
  paddingLeft: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',
  justifyContent: 'space-between',
  color: 'var(--lp-color-gray-200)',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
  },

  selectors: {
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
    // Highlight list item when child interactive elements have keyboard focus.
    // Matches buttons, switches (label[data-focus-visible] from React Aria), and button-like spans.
    // Note: Does NOT trigger for input/textarea focus since those have their own focus indicators.
    '&:focus-within:has(button:focus-visible, label:focus-visible, label[data-focus-visible], span[role="button"]:focus-visible)':
      {
        outline: '2px solid var(--lp-color-shadow-interactive-focus)',
        outlineOffset: '-2px',
      },
  },
});
