import { foldEffect } from '@codemirror/language';
import type { EditorState, StateEffect } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import { getIndentation } from './utils';

export const INDENT_LENGTH = 4;

const getFoldingRangesByIndent = (state: EditorState, from: number, to: number) => {
  const line = state.doc.lineAt(from); // First line
  const lines = state.doc.lines; // Number of lines in the document
  const indent = line.text.search(/\S|$/); // Indent level of the first line
  let foldEnd = to; // End of the fold

  // Check the next line if it is on a deeper indent level
  // If it is, check the next line and so on
  // If it is not, go on with the foldEnd
  let nextLine = line;
  while (nextLine.number < lines) {
    nextLine = state.doc.line(nextLine.number + 1); // Next line
    const nextIndent = nextLine.text.search(/\S|$/); // Indent level of the next line

    // If the next line is on a deeper indent level, add it to the fold
    if (nextIndent > indent) {
      foldEnd = nextLine.to; // Set the fold end to the end of the next line
    } else {
      break; // If the next line is not on a deeper indent level, stop
    }
  }

  // If the fold is only one line, don't fold it
  if (state.doc.lineAt(from).number === state.doc.lineAt(foldEnd).number) {
    return null;
  }

  // Set the fold start to the end of the first line
  // With this, the fold will not include the first line
  const foldStart = line.to;

  // Return a fold that covers the entire indent level
  return { from: foldStart, to: foldEnd };
};

export function getFoldEffects(view: EditorView, indentLevel: number) {
  const state = view.state;
  const doc = state.doc;
  const foldingRanges: Array<{ from: number; to: number }> = [];

  // Loop through all lines of the editor doc
  const numberOfLines = doc.lines;
  for (let line = 1; line < numberOfLines; line++) {
    const lineStart = doc.line(line).from;
    const lineEnd = doc.line(line).to;

    // Get folding range of line
    const foldingRange = getFoldingRangesByIndent(state, lineStart, lineEnd);

    // If folding range found, add it to the array
    if (foldingRange) {
      foldingRanges.push(foldingRange);
    }
  }

  const effects: Array<StateEffect<{ from: number; to: number }>> = [];

  // Loop through all folding ranges
  for (const foldingRange of foldingRanges) {
    const lineIntendation = getIndentation(doc, foldingRange.from).length;

    // If line has no intendation or intendation is smaller than the indent level, continue (don't fold)
    if (!lineIntendation || lineIntendation !== indentLevel * INDENT_LENGTH) {
      continue;
    }

    effects.push(foldEffect.of({ from: foldingRange.from, to: foldingRange.to }));
  }

  return effects;
}
