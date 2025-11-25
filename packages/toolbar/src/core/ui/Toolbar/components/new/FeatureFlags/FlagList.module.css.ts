import { style } from '@vanilla-extract/css';

export const scrollContainer = style({
  height: '100%',
  width: '100%',
  overflow: 'auto',
  position: 'relative',
});

export const virtualInner = style({
  width: '100%',
  position: 'relative',
});
