import { EditorState, Annotation } from '@codemirror/state';
import { EditorView, lineNumbers, ViewUpdate } from '@codemirror/view';
import { json } from '@codemirror/lang-json';
import { useCallback, useEffect, useRef } from 'react';
import * as styles from './JsonEditor.css';
import { getThemeForMode } from './theme';

interface JsonEditorProps {
  id: string;
  docString: string;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>, value: string) => void;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  initialState?: {
    startCursorAtLine?: number;
    autoFocus?: boolean;
  };
}

const External = Annotation.define<boolean>();

export function JsonEditor(props: JsonEditorProps) {
  const { id, docString, onFocus, onBlur, onChange, initialState } = props;

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

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const theme = getThemeForMode();
      const extensions = [EditorView.updateListener.of(onChangeCallback), lineNumbers(), json(), ...theme];
      const state = EditorState.create({
        doc: docString,
        selection: initialState?.startCursorAtLine ? { anchor: initialState.startCursorAtLine } : undefined,
        extensions,
      });

      editorRef.current = new EditorView({
        state,
        parent: containerRef.current,
        extensions,
      });
    }
  }, [docString, initialState, onChangeCallback]);

  useEffect(
    () => () => {
      editorRef.current?.destroy();
    },
    [],
  );

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
      id={id}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={(e) => {
        onBlur?.(e, codeEditor?.contentDOM.textContent ?? '');
      }}
      ref={containerRef}
    />
  );
}
