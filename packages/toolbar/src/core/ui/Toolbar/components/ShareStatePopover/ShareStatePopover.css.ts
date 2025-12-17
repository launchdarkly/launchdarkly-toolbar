import { style } from '@vanilla-extract/css';

export const popover = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  backgroundColor: 'var(--lp-color-bg-ui-primary)',
  borderRadius: 'var(--lp-border-radius-medium, 8px)',
  boxShadow: 'var(--lp-shadow-600)',
  minWidth: '280px',
  maxWidth: '320px',
  zIndex: 1000,
  overflow: 'hidden',
  border: '1px solid var(--lp-color-border-ui-primary)',
});

export const header = style({
  padding: 'var(--lp-spacing-300, 12px) var(--lp-spacing-400, 16px)',
  borderBottom: '1px solid var(--lp-color-border-ui-primary)',
});

export const title = style({
  margin: 0,
  fontSize: 'var(--lp-text-ui-size-small, 14px)',
  fontWeight: 'var(--lp-font-weight-semibold, 600)',
  color: 'var(--lp-color-text-ui-primary)',
});

export const content = style({
  padding: 'var(--lp-spacing-400, 16px)',
});

export const description = style({
  margin: '0 0 var(--lp-spacing-300, 12px) 0',
  fontSize: 'var(--lp-text-ui-size-xsmall, 12px)',
  color: 'var(--lp-color-text-ui-secondary)',
  lineHeight: 1.4,
});

export const options = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--lp-spacing-200, 8px)',
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  padding: 'var(--lp-spacing-200, 8px)',
  borderRadius: 'var(--lp-border-radius-small, 4px)',
  transition: 'background-color 0.15s ease',
  ':hover': {
    backgroundColor: 'var(--lp-color-bg-ui-secondary)',
  },
});

export const optionLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--lp-spacing-100, 4px)',
  fontSize: 'var(--lp-text-ui-size-xsmall, 12px)',
  color: 'var(--lp-color-text-ui-primary)',
  fontWeight: 'var(--lp-font-weight-medium, 500)',
});

export const count = style({
  fontSize: 'var(--lp-text-ui-size-xsmall, 12px)',
  color: 'var(--lp-color-text-ui-secondary)',
  fontWeight: 'var(--lp-font-weight-normal, 400)',
});

export const actions = style({
  padding: 'var(--lp-spacing-300, 12px) var(--lp-spacing-400, 16px)',
  borderTop: '1px solid var(--lp-color-border-ui-primary)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--lp-spacing-200, 8px)',
  backgroundColor: 'var(--lp-color-bg-ui-secondary)',
});
