import { style } from '@vanilla-extract/css';

export const flagContentWrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '16px',
  paddingTop: '6px',
});

export const flagNameText = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
