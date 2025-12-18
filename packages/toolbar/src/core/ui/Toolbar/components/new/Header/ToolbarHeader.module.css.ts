import { style } from '@vanilla-extract/css';
import {
  flexBetween,
  flexRow,
  buttonReset,
  flexCenter,
  transitionDefault,
  iconDefault,
} from '../../../../styles/mixins.css';

export const header = style({
  ...flexBetween,
  padding: '8px 12px 0 12px',
});

export const leftSection = style({
  ...flexRow,
  gap: '8px',
  cursor: 'grab',
  userSelect: 'none',
  padding: '4px',
  marginLeft: '-4px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',

  ':active': {
    cursor: 'grabbing',
  },
});

export const logo = style({
  ...iconDefault,
  color: 'var(--lp-color-gray-200)',
});

export const title = style({
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
});

export const rightSection = style({
  ...flexRow,
  gap: '4px',
});

export const iconButton = style({
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  color: 'var(--lp-color-gray-400)',
  padding: '6px',
  borderRadius: '4px',
  width: '32px',
  height: '32px',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-200)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});
