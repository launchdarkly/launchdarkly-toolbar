import { style } from '@vanilla-extract/css';

export const toolbarContainer = style({
  position: 'fixed',
  zIndex: 1000,
  backgroundColor: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
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
  flexDirection: 'column',
});

export const contentArea = style({
  backgroundColor: 'var(--lp-color-gray-900)',
  overflow: 'hidden',
  borderRadius: '12px',
});

export const scrollableContent = style({
  minHeight: 450,
});

export const tabsContainer = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 8px',
  backgroundColor: 'var(--lp-color-gray-900)',
  borderRadius: '12px',
});

export const tabsContainerChild = style({
  flex: 1,
});
