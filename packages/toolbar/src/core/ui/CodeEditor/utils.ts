import { Diagnostic } from "@codemirror/lint";
import { ZodIssueCode, ZodSchema } from "zod";
import { type ParseError, findNodeAtLocation, Node, parseTree } from 'jsonc-parser';
import { nearestFieldNode, safeParseJSON } from "./jsonSchemaUtils";
import { Text } from "@codemirror/state";

const isPrimitive = (value: unknown) =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  Array.isArray(value) ||
  value === null ||
  value === undefined;

type Primitive = string | number | boolean | null | undefined;

const displayValue = (value: Primitive): string => {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (value === '') {
    return '""';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value.toString();
};

export const getIndentation = (doc: Text, offset: number) => {
  const line = doc.lineAt(offset);
  const indentOffset = line.text.search(/\S/);
  const indentation = indentOffset === -1 ? 0 : indentOffset;

  return ' '.repeat(indentation);
};

export const addCustomZodErrors = async (docString: string, zodSchema: ZodSchema) => {
  const diagnostics: Diagnostic[] = [];
  const errors: ParseError[] = [];
  const jsonAst = parseTree(docString, errors);

  const result = await zodSchema.safeParseAsync(safeParseJSON(docString));
  if (!result.success && jsonAst) {
    result.error.issues.forEach((issue) => {
      if (issue.code === ZodIssueCode.unrecognized_keys) {
        issue.keys.forEach((key) => {
          const path = [...issue.path, key];
          const node = findNodeAtLocation(jsonAst, path);
          const fieldNode = node ? nearestFieldNode(node) : undefined;
          if (fieldNode) {
            diagnostics.push({
              from: fieldNode.offset,
              to: fieldNode.offset + fieldNode.length,
              severity: 'error',
              message: `Unrecognized key in object: ${key}`,
            });
          }
        });
      } else if (issue.path.length > 0) {
        const currentNode = findNodeAtLocation(jsonAst, issue.path);
        let node: Node | undefined;

        // If we are on an array item, let node just be the current node
        if (currentNode?.parent?.type === 'array') {
          node = currentNode;
        } else if (currentNode) {
          node = nearestFieldNode(currentNode);
          // Return the parent node if the current path is undefined
        } else {
          node = findNodeAtLocation(jsonAst, issue.path.slice(0, -1));
        }
        if (node) {
          let message = issue.message;
          if (issue.code === ZodIssueCode.invalid_union) {
            const expected: string[] = [];
            issue.unionErrors.forEach((err) => {
              err.issues.forEach((unionIssue) => {
                if ('expected' in unionIssue && isPrimitive(unionIssue.expected)) {
                  expected.push(displayValue(unionIssue.expected as Primitive));
                }
              });
            });
            if (expected.length < 20) {
              message = `Must be one of the following values: ${expected.join(',')}`;
            } else {
              message = 'Must be one of the suggested autocomplete values';
            }
          }
          diagnostics.push({
            from: node.offset,
            to: node.offset + node.length,
            severity: 'error',
            message,
          });
        }
      }
    });
  }
  return diagnostics;
};

export const getDocumentSize = (str: string) => {
  const byte = encodeURI(str).split(/%..|./).length - 1;

  return +(byte / 1024).toFixed(2);
};
