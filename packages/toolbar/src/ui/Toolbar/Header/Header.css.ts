import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateAreas: '"logo center actions"',
  alignItems: 'center',
  padding: '0 8px 0 16px',
  backgroundColor: 'var(--lp-color-gray-900)',
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
});

export const closeButtonArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  paddingRight: '0',
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
