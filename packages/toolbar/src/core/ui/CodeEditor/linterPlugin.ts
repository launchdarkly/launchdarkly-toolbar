import { ZodSchema } from "zod";
import { linter } from '@codemirror/lint';
import { addCustomZodErrors } from "./utils";
import { jsonParseLinter } from '@codemirror/lang-json';

export const jsonLint = (schema: ZodSchema | undefined) => [
  linter(async (view) => {
    const text = view.state.doc.toString();
    const diagnostics = schema ? await addCustomZodErrors(text, schema) : [];
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