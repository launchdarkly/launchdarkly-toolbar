import { style } from '@vanilla-extract/css';

export const searchFieldWrapper = style({
  width: '100%',
  color: 'var(--lp-color-gray-400)',
});

export const searchField = style({
  height: '32px',
  borderRadius: '8px',
});

export const searchGroup = style({
  paddingRight: '0px !important',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});
