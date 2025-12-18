import { style } from '@vanilla-extract/css';
import {
  cardRowCompact,
  cardBaseWithMarginRules,
  cardHeader,
  cardInfoRules,
  cardNameRow,
  statusDotOverrideRules,
} from '../../../../styles/card.css';
import {
  textEllipsis,
  textEllipsisInFlex,
  flexRow,
  flexColumn,
  flexCenter,
  focusVisible,
  transitionFast,
  iconNoShrink,
} from '../../../../styles/mixins.css';

// Base container styles
export const container = cardRowCompact;

// Overridden container - explicit styling to ensure override specificity
// Note: This is applied as an additional class, so it must override :hover explicitly
export const containerOverridden = style({
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.08)',
  border: '1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / 0.2)',

  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.12)',
    borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
  },
});

export const containerBlock = style({
  ...cardBaseWithMarginRules,
  ...flexColumn,
  paddingLeft: '8px',
  gap: '16px',
});

// Overridden block container - explicit styling to ensure override specificity
export const containerBlockOverridden = style({
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.08)',
  border: '1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / 0.2)',

  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.12)',
    borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
  },
});

export const header = cardHeader;

export const flagInfo = style({
  ...flexRow,
  gap: '4px',
  flex: 1,
  minWidth: 0, // Allow flex item to shrink
});

export const info = style({
  ...cardInfoRules,
  maxWidth: '200px',
});

export const nameRow = cardNameRow;

export const name = style({
  ...textEllipsisInFlex,
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
});

export const nameLink = style({
  ...focusVisible,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: 'var(--lp-color-gray-200)',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  overflow: 'hidden',
  minWidth: 0,
  maxWidth: '100%',

  ':hover': {
    color: 'var(--lp-color-gray-100)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
    borderRadius: '2px',
  },
});

export const nameLinkText = style({
  ...textEllipsis,
  textDecoration: 'underline',
  textDecorationColor: 'var(--lp-color-gray-500)',
  textUnderlineOffset: '2px',

  selectors: {
    [`${nameLink}:hover &`]: {
      textDecorationColor: 'var(--lp-color-gray-200)',
    },
  },
});

export const externalLinkIcon = style({
  ...iconNoShrink,
  ...transitionFast,
  opacity: 0.6,

  selectors: {
    [`${nameLink}:hover &`]: {
      opacity: 1,
    },
  },
});

export const overrideDot = style({
  ...flexCenter,
  width: '8px',
  height: '8px',
  flexShrink: 0,
  cursor: 'pointer',
});

export const overrideDotInner = style({
  ...statusDotOverrideRules,
});

export const control = style({
  ...flexRow,
  flexShrink: 0, // Don't shrink the control
});

export const readOnlyValue = style({
  ...flexColumn,
  gap: '4px',
  fontSize: '12px',
});

export const objectLabel = style({
  color: 'var(--lp-color-gray-400)',
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.5px',
});

export const objectValue = style({
  ...textEllipsis,
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'monospace',
  fontSize: '11px',
  maxWidth: '250px',
});
