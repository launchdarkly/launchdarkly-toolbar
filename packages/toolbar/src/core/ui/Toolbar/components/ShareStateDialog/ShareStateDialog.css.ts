import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
});

export const dialog = style({
  backgroundColor: 'var(--lp-color-bg-ui-primary)',
  borderRadius: 'var(--lp-border-radius-medium, 8px)',
  boxShadow: 'var(--lp-shadow-600)',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const header = style({
  padding: 'var(--lp-spacing-400, 16px) var(--lp-spacing-500, 20px)',
  borderBottom: '1px solid var(--lp-color-border-ui-primary)',
});

export const title = style({
  margin: 0,
  fontSize: 'var(--lp-text-ui-size-medium, 16px)',
  fontWeight: 'var(--lp-font-weight-bold, 600)',
  color: 'var(--lp-color-text-ui-primary)',
});

export const content = style({
  padding: 'var(--lp-spacing-500, 20px)',
  flex: 1,
  overflow: 'auto',
});

export const description = style({
  margin: '0 0 var(--lp-spacing-400, 16px) 0',
  fontSize: 'var(--lp-text-ui-size-small, 14px)',
  color: 'var(--lp-color-text-ui-secondary)',
  lineHeight: 1.5,
});

export const options = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--lp-spacing-300, 12px)',
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  padding: 'var(--lp-spacing-300, 12px)',
  borderRadius: 'var(--lp-border-radius-small, 4px)',
  border: '1px solid var(--lp-color-border-ui-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'var(--lp-color-bg-ui-secondary)',
    borderColor: 'var(--lp-color-border-interactive-primary)',
  },
});

export const optionLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--lp-spacing-200, 8px)',
  fontSize: 'var(--lp-text-ui-size-small, 14px)',
  color: 'var(--lp-color-text-ui-primary)',
  fontWeight: 'var(--lp-font-weight-medium, 500)',
});

export const count = style({
  fontSize: 'var(--lp-text-ui-size-xsmall, 12px)',
  color: 'var(--lp-color-text-ui-secondary)',
  fontWeight: 'var(--lp-font-weight-normal, 400)',
});

export const actions = style({
  padding: 'var(--lp-spacing-400, 16px) var(--lp-spacing-500, 20px)',
  borderTop: '1px solid var(--lp-color-border-ui-primary)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--lp-spacing-300, 12px)',
});
