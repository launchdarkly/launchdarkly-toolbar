import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../constants/zIndex';

export const wrapper = style({
  position: 'relative',
  display: 'inline-flex',
  minWidth: 0,
});

export const container = style({
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: 0,
  backgroundColor: 'inherit',
  border: 'none',
  cursor: 'pointer',
  paddingRight: '4px',
  paddingLeft: '0px',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  textAlign: 'left',

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '1px',
  },
});

export const text = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-monospace)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,

  selectors: {
    [`${container}:hover &`]: {
      color: 'var(--lp-color-gray-200)',
    },
  },
});

export const tooltip = style({
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: '15%',
  transform: 'translateX(0)',
  backgroundColor: 'var(--lp-color-gray-700)',
  color: 'var(--lp-color-gray-100)',
  fontSize: '12px',
  fontWeight: 500,
  padding: '6px 12px',
  borderRadius: 'var(--lp-border-radius-medium)',
  whiteSpace: 'nowrap',
  boxShadow: `
    0 0 1px 0 var(--lp-color-shadow-ui-secondary),
    0 0 4px 0 var(--lp-color-shadow-ui-secondary),
    0 4px 8px 0 var(--lp-color-shadow-ui-secondary),
    0 2px 12px 0 var(--lp-color-shadow-ui-secondary)
  `,
  zIndex: Z_INDEX.TOOLTIP,
  pointerEvents: 'none',

  '::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--lp-color-gray-700)',
  },
});
