import { style, globalStyle } from '@vanilla-extract/css';
import { Z_INDEX } from '../constants/zIndex';

// Respect user's motion preferences - disable animations and transitions
globalStyle('*', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
    },
  },
});

export const toolbarContainer = style({
  position: 'fixed',
  zIndex: Z_INDEX.TOOLBAR,
  backgroundColor: 'var(--lp-color-gray-950)',
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const positionBottomRight = style({
  right: 20,
  bottom: 20,
  transformOrigin: 'bottom right',
});

export const positionBottomLeft = style({
  left: 20,
  bottom: 20,
  transformOrigin: 'bottom left',
});

export const positionTopRight = style({
  right: 20,
  top: 20,
  transformOrigin: 'top right',
});

export const positionTopLeft = style({
  left: 20,
  top: 20,
  transformOrigin: 'top left',
});

export const toolbarCircle = style({
  cursor: 'pointer',
});

export const toolbarExpanded = style({
  cursor: 'default',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
});

export const circleContent = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '50%',
  cursor: 'pointer',
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
  },
});

export const circleLogo = style({
  width: 28,
  height: 28,
  objectFit: 'contain',
  filter: 'brightness(0) invert(1)',
  flexShrink: 0,
  display: 'block',
});

export const toolbarContent = style({
  width: '100%',
  display: 'flex',
  // Reverse the visual order so tabs appear at bottom while keeping them first in DOM.
  // This ensures keyboard users can tab to navigation immediately without traversing all flag list items.
  // Screen readers also encounter tabs before content. We use CSS visual reordering instead of
  // positive tabIndex values to preserve natural tab flow (a11y best practice).
  flexDirection: 'column-reverse',
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
});

export const contentArea = style({
  backgroundColor: 'var(--lp-color-gray-950)',
  overflow: 'hidden',
  borderRadius: '0px',
});

export const scrollableContent = style({
  minHeight: 450,
});

export const tabsContainer = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 8px',
  backgroundColor: 'var(--lp-color-gray-950)',
  borderRadius: '0px',
});

export const tabsContainerChild = style({
  flex: 1,
});
