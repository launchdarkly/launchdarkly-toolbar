import { style } from '@vanilla-extract/css';

export const searchFieldWrapper = style({
  flex: 1,
  minWidth: '200px',
  color: 'var(--lp-color-gray-400)',
});

export const searchField = style({
  height: '32px',
});

export const searchGroup = style({
  paddingRight: '0px !important',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});
