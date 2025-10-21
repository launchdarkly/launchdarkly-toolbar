import { style } from '@vanilla-extract/css';

export const list = style({
  padding: 0,
  margin: 0,
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--lp-color-gray-800)',
  color: 'var(--lp-color-gray-200)',
  transition: 'background-color 0.2s ease',

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:focus-visible': {
      backgroundColor: 'var(--lp-color-gray-850)',
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
    // Highlight list item when child interactive elements have keyboard focus.
    // Matches buttons, switches (label[data-focus-visible] from React Aria), and button-like spans.
    // Note: Does NOT trigger for input/textarea focus since those have their own focus indicators.
    '&:focus-within:has(button:focus-visible, label:focus-visible, label[data-focus-visible], span[role="button"]:focus-visible)':
      {
        backgroundColor: 'var(--lp-color-gray-850)',
        outline: '2px solid var(--lp-color-shadow-interactive-focus)',
        outlineOffset: '-2px',
      },
  },
});
