import { EditorView } from "@codemirror/view";

export interface CodeEditorHandle {
  setDocument: (docString: string) => void;
  getEditorView: () => EditorView | null;
  containerRef: HTMLDivElement | null;
}