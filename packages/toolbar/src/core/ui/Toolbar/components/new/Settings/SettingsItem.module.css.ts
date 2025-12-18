import { style } from '@vanilla-extract/css';
import { flexBetween, flexRow, transitionDefault } from '../../../../styles/mixins.css';
import { cardInfoRules } from '../../../../styles/card.css';
import { titleSmallRules, descriptionSmallRules } from '../../../../styles/typography.css';

export const item = style({
  ...flexBetween,
  ...transitionDefault,
  backgroundColor: 'var(--lp-color-gray-850)',
  gap: '16px',
});

export const info = style({
  ...cardInfoRules,
});

export const label = style({
  ...titleSmallRules,
  fontWeight: 500,
});

export const description = style({
  ...descriptionSmallRules,
  lineHeight: '1.4',
});

export const control = style({
  ...flexRow,
  flexShrink: 0,
});

export const switch_ = style({
  fontSize: '12px',
  backgroundColor: 'var(--lp-color-gray-950)',
});
