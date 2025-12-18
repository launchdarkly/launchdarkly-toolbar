import { style } from '@vanilla-extract/css';
import { flexRow, flexColumn, textEllipsis, customScrollbarWide } from '../../../../styles/mixins.css';

export const flagName = style({
  ...flexRow,
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  gap: '8px',
  minWidth: 0,
  flex: 1,
});

export const flagNameText = style({
  ...textEllipsis,
  minWidth: 0,
});

export const flagHeader = style({
  ...flexColumn,
  gap: '4px',
  flex: 1,
  minWidth: 0,
  maxWidth: 'calc(100% - 90px)',
});

export const flagKey = style({
  ...textEllipsis,
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
});

export const flagOptions = style({
  ...flexRow,
  marginLeft: '16px',
  gap: '8px',
});

export const virtualContainer = style({
  ...customScrollbarWide,
  height: '400px',
  overflow: 'auto',
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
