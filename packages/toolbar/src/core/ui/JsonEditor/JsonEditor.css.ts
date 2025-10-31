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

globalStyle('.cm-editor ::selection', {
  backgroundColor: 'var(--lp-color-gray-800) !important',
  color: 'inherit',
});
