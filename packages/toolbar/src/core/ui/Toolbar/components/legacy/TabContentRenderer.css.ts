import { style } from '@vanilla-extract/css';
import { customScrollbar } from '../../../styles/mixins.css';

export const tabContent = style({
  ...customScrollbar,
  height: '450px',
  overflowY: 'auto',
});
