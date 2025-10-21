import type { EditorView } from '@codemirror/view';
import type { JSONSchema7 } from 'json-schema';
import type { Node as JsoncNode } from 'jsonc-parser';
import { findNodeAtOffset, getLocation, getNodeValue, parseTree } from 'jsonc-parser';

export const safeParseJSON = (string: string) => {
  try {
    return JSON.parse(string);
  } catch {
    return string;
  }
};

export const getSchemaInfoFromPos = (doc: string, pos: number, schema?: JSONSchema7) => {
  const emptyResult = {
    currentSchemaNode: undefined,
    tree: undefined,
    path: undefined,
    node: undefined,
    currentValue: undefined,
    jsonLocation: undefined,
  };
  const tree = parseTree(doc);
  if (!tree) {
    return emptyResult;
  }

  const node = findNodeAtOffset(tree, pos, true);

  if (!node) {
    return emptyResult;
  }

  const jsonLocation = getLocation(doc, pos);

  const path = jsonLocation.path.map((p) => String(p)).join('/');
  if (!schema) {
    return { ...emptyResult, jsonLocation, tree, path, node };
  }

  const schemaNode = resolveSchemaPointer(schema, path);

  const currentValue = getNodeValue(node);
  return { currentSchemaNode: schemaNode, jsonLocation, tree, path, node, currentValue };
};

export const isKey = (node: JsoncNode, value: string) => {
  const fieldNode = nearestFieldNode(node);
  return !!fieldNode && fieldNode?.value === value;
};

//This returns the node with the full property so it will include the field name and value
export const nearestPropertyNode = (node: JsoncNode) => {
  let propertyNode: JsoncNode | undefined = node;
  while (propertyNode && propertyNode.type !== 'property') {
    propertyNode = propertyNode.parent;
  }
  return propertyNode;
};

//This returns the node with the field name
export const nearestFieldNode = (node: JsoncNode) => {
  const propertyNode = nearestPropertyNode(node);
  if (!propertyNode) {
    return undefined;
  }
  return propertyNode.children?.[0];
};

export const nearestValueNode = (node: JsoncNode) => {
  const propertyNode = nearestPropertyNode(node);
  if (!propertyNode) {
    return undefined;
  }
  return propertyNode.children?.[1];
};

export const resolveSchemaPointer = (schema: JSONSchema7, pointer: string) => {
  const parts = pointer.split('/'); // skip root ""
  const definition = schema.$ref?.split('/').pop();
  let current = definition ? schema.definitions?.[definition] : undefined;
  if (!current) {
    return undefined;
  }

  for (const part of parts) {
    if (!current) {
      return undefined;
    }

    // Handle the case where current might be a boolean
    if (typeof current === 'boolean') {
      return undefined;
    }

    // Now TypeScript knows current is a JSONSchema7 object
    if (current.type === 'object') {
      if (current.properties) {
        current = current.properties[part];
      } else if (current.additionalProperties && typeof current.additionalProperties !== 'boolean') {
        // When additionalProperties is a schema, use it for any property not explicitly defined
        current = current.additionalProperties;
      }
    } else if (current.type === 'array' && current.items) {
      // Handle both array and single schema item cases
      current = Array.isArray(current.items) ? current.items[0] : current.items;
    } else {
      return undefined;
    }
  }

  return current && current !== true ? current : undefined;
};

export const getCurrentWordRange = (
  view: EditorView,
  pos: number,
  word: string,
): { from: number; to: number } | undefined => {
  const line = view.state.doc.lineAt(pos);
  const text = line.text;
  const offset = pos - line.from;

  const regex = new RegExp(`"${word}"`, 'g');
  let match;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (offset >= start && offset <= end) {
      return {
        from: line.from + start,
        to: line.from + end,
      };
    }
  }

  return undefined;
};

export const nodeIsChild = (pos: number, parentNode: JsoncNode) =>
  parentNode.offset <= pos && pos <= parentNode.offset + parentNode.length;
