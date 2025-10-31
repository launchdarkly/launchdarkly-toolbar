import { jsonParseLinter } from '@codemirror/lang-json';
import { Diagnostic, linter } from '@codemirror/lint';

export const jsonLint = () => [
  linter((view) => {
    const text = view.state.doc.toString();
    const diagnostics: Diagnostic[] = [];
    const trailingCommaRegex = /,\s*([}\]])/g;
    let match;

    while ((match = trailingCommaRegex.exec(text)) !== null) {
      diagnostics.push({
        from: match.index,
        to: match.index + 1,
        severity: 'error',
        message: 'Trailing commas are not allowed in JSON',
      });
    }
    return diagnostics;
  }),
  linter(jsonParseLinter(), {
    // default is 750ms
    delay: 300,
  }),
];
