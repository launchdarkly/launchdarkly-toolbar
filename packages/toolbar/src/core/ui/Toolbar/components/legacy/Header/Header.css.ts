import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateAreas: '"logo center actions"',
  alignItems: 'center',
  padding: '0 8px 0 16px',
  backgroundColor: 'var(--lp-color-gray-950)',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  borderRadius: '12px 12px 0 0',
  minHeight: '56px',
  gap: '12px',
});

export const leftSection = style({
  gridArea: 'logo',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const logo = style({
  width: '154px',
  height: 'auto',
  objectFit: 'contain',
  filter: 'brightness(0) invert(1)',
});

export const headerTitle = style({
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'var(--lp-font-family-base)',
  whiteSpace: 'nowrap',
});

export const centerSection = style({
  gridArea: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 0,
  maxWidth: '100%',
});

export const environmentLabel = style({
  backgroundColor: 'var(--lp-color-gray-800)',
  borderRadius: '5px',
  color: 'var(--lp-color-brand-cyan-base)',
  display: 'block',
  fontFamily: 'var(--lp-font-family-monospace)',
  fontSize: '10px',
  overflow: 'hidden',
  padding: '4px 8px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  textAlign: 'center',
});

export const rightSection = style({
  gridArea: 'actions',
  display: 'flex',
  alignItems: 'center',
  gap: '0px',
});

export const searchButtonArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
});

export const closeButtonArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
});

export const actionButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s ease, background-color 0.2s ease',

  ':hover': {
    color: 'var(--lp-color-gray-200)',
    backgroundColor: 'var(--lp-color-gray-800)',
  },
});

export const actionButtonSvg = style({
  fill: 'var(--lp-color-gray-400)',
});

export const searchField = style({
  height: '36px',
});

export const searchGroup = style({
  paddingRight: '0px !important',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const searchFieldWrapper = style({
  width: '100%',
  color: 'var(--lp-color-gray-400)',
});

export const searchFieldWrapperSvg = style({
  fill: 'var(--lp-color-gray-400)',
  width: '16px',
  height: '16px',
});

export const searchWrapper = style({
  width: '100%',
});

export const environmentWrapper = style({
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
});

export const icon = style({
  width: '16px',
  height: '16px',
  fill: 'currentColor',
});

export const environmentLabelWrapper = style({
  position: 'relative',
  display: 'inline-block',
});

export const environmentTooltip = style({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'var(--lp-color-gray-950)',
  color: 'var(--lp-color-gray-100)',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontFamily: 'var(--lp-font-family-monospace)',
  whiteSpace: 'nowrap',
  zIndex: 1000,
  marginTop: '4px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  border: '1px solid var(--lp-color-gray-700)',
  pointerEvents: 'none',
});
