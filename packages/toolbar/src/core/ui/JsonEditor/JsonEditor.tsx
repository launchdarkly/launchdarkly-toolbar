import { EditorState, Annotation } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { EditorView, keymap, tooltips, ViewUpdate } from '@codemirror/view';
import { json } from '@codemirror/lang-json';
import { useCallback, useEffect, useRef } from 'react';
import * as styles from './JsonEditor.css';
import { getThemeForMode } from './theme';
import { jsonLint } from './linterPlugin';
import { lintKeymap, forEachDiagnostic, type Diagnostic } from '@codemirror/lint';

interface JsonEditorProps {
  editorId: string;
  docString: string;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>, value: string) => void;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  onLintErrors: (errors: Diagnostic[]) => void;
  initialState?: {
    startCursorAtLine?: number;
    autoFocus?: boolean;
  };
  onEditorHeightChange: (height: number) => void;
}

const External = Annotation.define<boolean>();

export function JsonEditor(props: JsonEditorProps) {
  const { editorId, docString, onFocus, onBlur, onChange, onLintErrors, initialState, onEditorHeightChange } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorView | null>(null);
  const { current: codeEditor } = editorRef;

  const onChangeCallback = useCallback(
    (viewUpdate: ViewUpdate) => {
      if (
        viewUpdate.docChanged &&
        typeof onChange === 'function' &&
        // Fix echoing of the remote changes:
        // If transaction is marked as remote we don't have to call `onChange` handler again
        !viewUpdate.transactions.some((tx) => tx.annotation(External))
      ) {
        const doc = viewUpdate.state.doc;
        const value = doc.toString();
        onChange(value, viewUpdate);
      }
    },
    [onChange],
  );

  const onLintChangeCallback = useCallback(
    (viewUpdate: ViewUpdate) => {
      if (onLintErrors) {
        const diagnostics: Diagnostic[] = [];
        forEachDiagnostic(viewUpdate.state, (diagnostic) => {
          diagnostics.push(diagnostic);
        });
        onLintErrors(diagnostics);
      }
    },
    [onLintErrors],
  );

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const theme = getThemeForMode();

      const keymaps = [...defaultKeymap, ...lintKeymap, ...historyKeymap, indentWithTab];
      const extensions = [
        EditorView.updateListener.of(onChangeCallback),
        EditorView.updateListener.of(onLintChangeCallback),
        json(),
        jsonLint(),
        history(),
        ...theme,
        EditorView.lineWrapping,
        keymap.of(keymaps),
        tooltips({
          position: 'fixed',
          parent: containerRef.current,
        }),
      ];
      const state = EditorState.create({
        doc: docString,
        selection: initialState?.startCursorAtLine ? { anchor: initialState.startCursorAtLine } : undefined,
        extensions,
      });

      editorRef.current = new EditorView({
        state,
        parent: containerRef.current,
      });
    }
  }, [docString, initialState, onChangeCallback, onLintChangeCallback, onLintErrors]);

  useEffect(
    () => () => {
      editorRef.current?.destroy();
    },
    [],
  );

  useEffect(() => {
    onEditorHeightChange(editorRef.current?.contentDOM.clientHeight ?? 0);
  }, [onEditorHeightChange, editorRef.current?.contentDOM.clientHeight]);

  // Called when the editor is mounted
  const initialized = editorRef.current !== null;
  useEffect(() => {
    if (initialized && initialState?.autoFocus) {
      editorRef.current?.focus();
    }
  }, [initialized, initialState?.autoFocus]);

  return (
    <div
      className={styles.jsonEditor}
      role="textbox"
      data-enable-grammarly="false"
      data-testid={editorId}
      id={editorId}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={(e) => {
        onBlur?.(e, codeEditor?.contentDOM.textContent ?? '');
      }}
      ref={containerRef}
    />
  );
}
