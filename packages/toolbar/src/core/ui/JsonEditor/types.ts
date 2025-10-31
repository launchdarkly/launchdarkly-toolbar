import { HighlightStyle } from '@codemirror/language';

export type SyntaxHighlightingOverrides = Parameters<typeof HighlightStyle.define>[0];
