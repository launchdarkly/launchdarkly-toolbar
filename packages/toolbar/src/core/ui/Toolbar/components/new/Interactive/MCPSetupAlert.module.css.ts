import { style } from '@vanilla-extract/css';
import { flexRow, flexColumn, flexCenter, iconNoShrink, transitionFast } from '../../../../styles/mixins.css';
import { titleSmallRules, descriptionSmallRules } from '../../../../styles/typography.css';
import { cardInfoRules } from '../../../../styles/card.css';

export const alertContainer = style({
  // marginBottom: '8px',
});

export const alertContentWithIcon = style({
  ...flexRow,
  alignItems: 'flex-start',
  gap: '12px',
});

export const infoIcon = style({
  ...iconNoShrink,
  width: '20px',
  height: '20px',
  marginTop: '2px',
  color: 'var(--lp-color-blue-400)',
});

export const alertContent = style({
  ...cardInfoRules,
  gap: '10px',
});

export const textContent = style({
  ...flexColumn,
  gap: '2px',
});

export const title = style({
  ...titleSmallRules,
});

export const description = style({
  ...descriptionSmallRules,
  color: 'var(--lp-color-gray-300)',
  lineHeight: 1.4,
});

export const actions = style({
  ...flexRow,
  gap: '8px',
  flexWrap: 'wrap',
});

export const actionButton = style({
  ...flexCenter,
  ...transitionFast,
  gap: '6px',
  padding: '6px 10px',
  height: '28px',
  boxSizing: 'border-box',
  backgroundColor: 'var(--lp-color-gray-800)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1,
  color: 'var(--lp-color-gray-200)',
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
  margin: 0,

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-700)',
      borderColor: 'var(--lp-color-gray-600)',
      textDecoration: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-blue-500)',
      outlineOffset: '2px',
    },
  },
});

export const primaryButton = style({
  backgroundColor: 'var(--lp-color-blue-600)',
  borderColor: 'var(--lp-color-blue-500)',
  color: 'var(--lp-color-white)',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-blue-500)',
      borderColor: 'var(--lp-color-blue-400)',
    },
  },
});

export const doneButton = style({
  marginLeft: 'auto',
});

export const cursorIcon = style({
  ...iconNoShrink,
  width: '14px',
  height: '14px',
});
