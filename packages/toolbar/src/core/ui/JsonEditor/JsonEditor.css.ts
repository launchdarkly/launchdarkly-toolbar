import { globalStyle, style } from '@vanilla-extract/css';

export const jsonEditor = style({
  marginTop: 'var(--lp-spacing-300)',
  height: '100%',
  width: '100%',
});

globalStyle('.cm-editor', {
  height: '100%',
  caretColor: 'var(--lp-color-gray-50)',
});

globalStyle('.cm-tooltip-autocomplete', {
  maxWidth: 'var(--lp-size-400)',
});

globalStyle('.cm-tooltip-autocomplete ul', {
  minWidth: 0,
  maxWidth: 'none',
  width: '100%',
});

globalStyle('.cm-tooltip-autocomplete ul li', {
  paddingBlock: 'var(--lp-spacing-200)',
  paddingInline: 'var(--lp-spacing-300)',
  borderRadius: 'var(--lp-border-radius-regular)',
  outline: 'none',
  textDecoration: 'none',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

globalStyle('.cm-editor ::selection', {
  backgroundColor: 'var(--lp-color-gray-800) !important',
  color: 'inherit',
});

globalStyle('.cm-tooltip-autocomplete ul li:hover', {
  background: 'var(--lp-color-bg-interactive-secondary-hover)',
  color: 'inherit',
});
