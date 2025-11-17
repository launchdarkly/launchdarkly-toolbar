import { style } from '@vanilla-extract/css';

export const flagName = style({
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
  flex: 1,
});

export const flagNameText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const flagHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
  maxWidth: 'calc(100% - 90px)',
});

export const flagKey = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const flagOptions = style({
  marginLeft: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const virtualContainer = style({
  height: '400px',
  overflow: 'auto',
  scrollbarColor: 'var(--lp-color-gray-800) transparent',
  scrollbarWidth: 'thin',

  ':hover': {
    scrollbarColor: 'var(--lp-color-gray-700) transparent',
  },

  selectors: {
    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-800)',
      borderRadius: '4px',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
});

export const virtualInner = style({
  width: '100%',
  position: 'relative',
});

export const virtualItem = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    transition: 'background-color 0.2s ease',
  },
});

export const flagListItem = style({
  height: '100%',
});

export const flagListItemBlock = style({
  display: 'block',
});

export const loadingMoreIndicator = style({
  padding: '16px',
  textAlign: 'center',
  color: 'var(--lp-color-gray-400)',
  fontSize: '14px',
});
