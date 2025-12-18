import { style } from '@vanilla-extract/css';
import {
  cardBaseWithMarginRules,
  cardActiveRules,
  cardClickableRules,
  cardHeaderRules,
  cardInfo,
  cardNameRow,
  cardActions,
  statusDot as statusDotStyle,
  statusDotActive,
  badge,
  badgeWarning,
} from '../../../../styles/card.css';
import {
  textEllipsis,
  textEllipsisInFlex,
  flexRow,
  flexColumn,
  flexCenter,
  buttonReset,
  transitionDefault,
  focusVisible,
} from '../../../../styles/mixins.css';

export const container = style({
  ...cardBaseWithMarginRules,
  ...flexColumn,
  gap: '0',
});

export const header = style({
  ...cardHeaderRules,
  position: 'relative',
});

export const containerActive = style({
  ...cardActiveRules,
  // Slightly stronger hover for active contexts
  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.12)',
    borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.4)',
  },
});

export const containerClickable = style(cardClickableRules);

export const info = cardInfo;

export const nameRow = cardNameRow;

export const name = style({
  ...textEllipsisInFlex,
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
});

export const keyRow = style({
  ...flexRow,
  gap: '4px',
});

export const key = style({
  ...textEllipsis,
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'monospace',
});

export const kindBadge = badge;

export const anonymousBadge = style([badge, badgeWarning]);

export const activeDot = style([statusDotStyle, statusDotActive]);

export const actions = cardActions;

export const deleteButton = style({
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  padding: '4px',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',
  width: '20px',
  height: '20px',

  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-red-500) r g b / 0.15)',
    color: 'var(--lp-color-red-400)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-red-500)',
    outlineOffset: '2px',
  },

  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.4,
  },

  selectors: {
    '&:hover:disabled': {
      backgroundColor: 'transparent',
      color: 'var(--lp-color-gray-400)',
    },
  },
});

export const iconButton = style({
  width: '34px',
  height: '34px',
});

export const expandButton = style({
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  ...focusVisible,
  padding: '4px',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-300)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-brand-cyan-base)',
    outlineOffset: '2px',
  },
});

export const chevron = style({
  ...flexCenter,
  color: 'var(--lp-color-gray-500)',
  transition: 'transform 0.2s',
  width: '20px',
  height: '20px',
});

export const chevronExpanded = style({
  transform: 'rotate(180deg)',
});

export const editActions = style({
  ...flexRow,
  gap: '8px',
  flexShrink: 0,
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid var(--lp-color-gray-700)',
});
