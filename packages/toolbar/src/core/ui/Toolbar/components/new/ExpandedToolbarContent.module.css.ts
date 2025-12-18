import { style } from '@vanilla-extract/css';
import { flexColumn, customScrollbar } from '../../../styles/mixins.css';

export const container = style({
  ...flexColumn,
  backgroundColor: 'var(--lp-color-gray-950)',
  color: 'var(--lp-color-gray-200)',
  height: '600px',
  borderRadius: '12px',
  border: '1px solid var(--lp-color-gray-700)',
  overflow: 'hidden',
  position: 'relative',
});

export const content = style({
  ...customScrollbar,
  flex: 1,
  minHeight: 0, // Required for flex child to allow overflow scroll
  overflowY: 'auto',
});
