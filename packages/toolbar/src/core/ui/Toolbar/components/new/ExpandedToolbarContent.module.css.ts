import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: 'var(--lp-color-gray-900)',
  color: 'var(--lp-color-gray-200)',
  height: '600px',
  borderRadius: '12px',
  border: '1px solid var(--lp-color-gray-700)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  paddingTop: '0px',
  scrollbarColor: 'var(--lp-color-gray-700) transparent',
  scrollbarWidth: 'thin',

  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
});
