import { style } from '@vanilla-extract/css';
import { flexColumn, flexCenter, iconSmall } from '../../../../styles/mixins.css';
import { bodyRules } from '../../../../styles/typography.css';

export const container = style(flexColumn);

export const emptyState = style({
  ...flexColumn,
  ...flexCenter,
  gap: '8px',
  padding: '60px 20px',
  color: 'var(--lp-color-gray-400)',
  textAlign: 'center',
});

export const message = style({
  ...bodyRules,
  margin: 0,
  color: 'var(--lp-color-gray-400)',
  maxWidth: '280px',
});

export const inlineIcon = style({
  ...iconSmall,
  display: 'inline-flex',
  verticalAlign: 'middle',
  marginRight: '2px',
  marginLeft: '2px',
});
