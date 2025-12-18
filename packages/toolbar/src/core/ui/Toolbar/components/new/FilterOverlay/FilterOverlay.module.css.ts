import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../../constants/zIndex';
import { flexColumn, flexCenter, buttonReset, transitionFast, iconSmall } from '../../../../styles/mixins.css';
import { popoverPanelRules, popoverHeaderRules, popoverBackdropRules } from '../../../../styles/popover.css';
import { titleSmallRules, descriptionSmallRules } from '../../../../styles/typography.css';

export const overlay = style({
  ...popoverPanelRules,
  position: 'absolute',
  top: '100%',
  right: '-50px',
  marginTop: '8px',
  minWidth: '220px',
});

export const overlayFlags = style({
  ...popoverPanelRules,
  position: 'absolute',
  top: '100%',
  right: '-95px',
  marginTop: '8px',
  minWidth: '220px',
});

export const header = style({
  ...popoverHeaderRules,
});

export const title = style({
  ...titleSmallRules,
  color: 'var(--lp-color-gray-200)',
});

export const resetButton = style({
  ...buttonReset,
  ...transitionFast,
  fontSize: '12px',
  color: 'var(--lp-color-gray-200)',
  padding: '4px 8px',
  paddingTop: '7px',
  borderRadius: '4px',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':disabled': {
    color: 'var(--lp-color-gray-500)',
    cursor: 'not-allowed',
  },
});

export const content = style({
  padding: '8px',
});

export const filterOption = style({
  ...buttonReset,
  ...transitionFast,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '6px',
  width: '100%',
  textAlign: 'left',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

export const filterOptionActive = style({
  backgroundColor: 'var(--lp-color-gray-800)',
});

export const checkbox = style({
  ...flexCenter,
  ...transitionFast,
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  border: '2px solid var(--lp-color-gray-500)',
  backgroundColor: 'transparent',
  flexShrink: 0,
});

export const checkboxChecked = style({
  borderColor: 'var(--lp-color-gray-400)',
  backgroundColor: 'var(--lp-color-gray-400)',
});

export const checkmark = style(iconSmall);

export const filterLabel = style({
  ...flexColumn,
  gap: '2px',
});

export const filterName = style({
  ...titleSmallRules,
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
});

export const filterDescription = style({
  ...descriptionSmallRules,
  fontSize: '11px',
});

export const backdrop = style({
  ...popoverBackdropRules,
  zIndex: Z_INDEX.POPOVER - 1,
});

export const container = style({
  position: 'relative',
});

export const filterCount = style({
  ...flexCenter,
  position: 'absolute',
  top: '-1px',
  right: '-4px',
  minWidth: '16px',
  height: '16px',
  borderRadius: '8px',
  backgroundColor: 'var(--lp-color-gray-600)',
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  padding: '0 4px',
  lineHeight: 1,
});
