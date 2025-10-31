import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

import type { SyntaxHighlightingOverrides } from './types';
import { Z_INDEX } from '../constants/zIndex';

export const theme = {
  '&': {
    cursor: 'text',
    borderRadius: '4px',
    backgroundColor: 'var(--lp-color-bg-ui-primary)',
    fontFamily: 'var(--lp-font-family-monospace)',
    fontSize: 'var(--lp-font-size-200)',
    '& .ͼ1.cm-focused': {
      outline: 'none',
    },
  },
  '.cm-content': {
    caretColor: 'var(--lp-color-gray-100)',
  },
  '.cm-editor': {
    padding: 'var(--lp-size-8)',
  },
  '.cm-completionLabel': {
    font: 'var(--lp-text-label-1-regular)',
  },
  '.cm-completionDetail': {
    font: 'var(--lp-text-label-1-regular)',
  },
  '.cm-completionInfo': {
    font: 'var(--lp-text-label-1-regular)',
  },
  '.cm-completionIcon': {
    width: 0,
    opacity: 0,
    height: 0,
    padding: 0,
    margin: 0,
    display: 'none',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--lp-color-bg-ui-secondary)',
    borderRight: 'none',
  },
  '.cm-readonly-field': {
    borderRadius: 'var(--lp-border-radius-medium)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    opacity: 0.5,
  },
  '.cm-readonly-field-block': {
    display: 'block',
  },
  '.cm-readonly-field-copy-button': {
    verticalAlign: 'middle',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--lp-color-bg-ui-tertiary)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--lp-color-bg-ui-tertiary)',
  },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--lp-color-blue-100)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'transparent !important',
  },
  '.cm-tooltip-readonly': {
    font: 'var(--lp-text-body-2-regular)',
  },
  '.cm-diagnosticText': {
    font: 'var(--lp-text-body-2-regular)',
  },
  '.cm-tooltip': {
    borderRadius: 'var(--lp-border-radius-medium)',
    color: 'var(--lp-color-text-ui-primary-base)',
    backgroundColor: 'var(--lp-color-bg-overlay-secondary) !important',
    boxShadow: `
        0 0 1px 0 var(--lp-color-shadow-ui-secondary),
        0 0 4px 0 var(--lp-color-shadow-ui-secondary),
        0 4px 8px 0 var(--lp-color-shadow-ui-secondary),
        0 2px 12px 0 var(--lp-color-shadow-ui-secondary)
      `,
    padding: 'var(--lp-size-8)',
    border: 'none',
    wordWrap: 'break-word',
    zIndex: Z_INDEX.TOOLTIP,
    top: '50% !important',
    position: 'fixed !important',
    width: '90%',
    overflow: 'hidden',
  },
  '.cm-tooltip-empty': {
    display: 'none',
  },
  '.cm-tooltip-arrow': {
    display: 'none',
  },
};

export const lightHighlightStyle = [
  { tag: tags.keyword, color: 'var(--lp-color-brand-purple-dark)' },
  { tag: tags.atom, color: 'var(--lp-color-brand-orange-dark)' },
  { tag: tags.url, textDecoration: 'underline' },
  { tag: tags.labelName, color: 'var(--lp-color-brand-purple-dark)' },
  { tag: tags.inserted, color: 'var(--lp-color-text-success-primary)' },
  { tag: tags.deleted, color: 'var(--lp-color-text-danger-primary)' },
  { tag: tags.literal, color: 'var(--lp-color-brand-orange-dark)' },
  // Commenting out for now - not sure if we need these
  // { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: 'var(--lp-color-brand-red-dark)' },
  { tag: tags.definition(tags.variableName), color: 'var(--lp-color-brand-blue-dark)' },
  { tag: tags.local(tags.variableName), color: 'var(--lp-color-brand-blue-dark)' },
  { tag: [tags.typeName, tags.namespace], color: 'var(--lp-color-brand-purple-dark)' },
  { tag: tags.className, color: 'var(--lp-color-brand-purple-dark)' },
  { tag: [tags.special(tags.variableName), tags.macroName], color: 'var(--lp-color-brand-blue-dark)' },
  // { tag: tags.definition(tags.propertyName), color: 'var(--lp-color-brand-cyan-dark)' },
  { tag: tags.comment, color: 'var(--lp-color-text-ui-secondary)', fontStyle: 'italic' },
  { tag: tags.meta, color: 'var(--lp-color-text-ui-secondary)' },
  { tag: tags.invalid, color: 'var(--lp-color-text-danger-primary)' },

  { tag: tags.string, color: 'var(--lp-color-brand-cyan-dark)' }, // cyan
  { tag: tags.number, color: 'var(--lp-color-brand-purple-base)' }, // violet
  { tag: tags.bool, color: 'var(--lp-color-brand-pink-base)' }, // soft pink
  { tag: tags.propertyName, color: 'var(--lp-color-brand-cyan-dark)' }, // light blue
];

export const getThemeForMode = (syntaxHighlightingOverrides: SyntaxHighlightingOverrides = []) => {
  const highlightStyle = HighlightStyle.define([...lightHighlightStyle, ...syntaxHighlightingOverrides]);

  return [EditorView.theme(theme), syntaxHighlighting(highlightStyle, { fallback: true })];
};
