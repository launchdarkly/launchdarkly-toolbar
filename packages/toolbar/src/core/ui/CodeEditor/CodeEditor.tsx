import { useCallback, useEffect, useMemo, useRef, type FocusEvent, useImperativeHandle } from 'react';
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { Annotation, EditorState, Extension, StateEffect } from '@codemirror/state';
import type { Ref } from 'react';
import type { CodeEditorHandle } from './types';
import { getDocumentSize } from './utils';
import { getFoldEffects } from './folding';

interface BaseProps {
  id?: string;
  docString: string;
  className?: string;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>, value: string) => void;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  codeEditorHandle?: Ref<CodeEditorHandle | null>;
  initialState?: {
    startCursorAtLine?: number;
    autoFocus?: boolean;
  };
}

const MAX_DOC_SIZE = 250;
const External = Annotation.define<boolean>();

export const CodeEditor = (props: BaseProps) => {
  const { id, docString, className, onFocus, onBlur, onChange, codeEditorHandle, initialState } = props;
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

  const dynamicExtensions = useMemo<Extension[]>(() => {
    const extensions: Extension[] = [EditorView.updateListener.of(onChangeCallback)];

    return extensions;
  }, [onChangeCallback]);

  useEffect(() => {
    // This happens on initialization - only create editor if mode is loaded and extensions are ready
    if (containerRef.current && !editorRef.current && dynamicExtensions.length > 0) {
      const state = EditorState.create({
        doc: docString,
        selection: initialState?.startCursorAtLine ? { anchor: initialState.startCursorAtLine } : undefined,
      });

      editorRef.current = new EditorView({
        state,
        parent: containerRef.current,
        extensions: dynamicExtensions,
      });
    }
  }, [docString, dynamicExtensions, initialState?.startCursorAtLine]);

  // If the onChange callback/disabled state, mode, or customErrors changes externally, update the editor extension
  useEffect(() => {
    const { current: editorView } = editorRef;
    if (editorView) {
      let effects: Array<StateEffect<unknown>> = [];
      const docSize = getDocumentSize(editorView.state.doc.toString());

      if (docSize > MAX_DOC_SIZE) {
        effects = getFoldEffects(editorView, 3);
      }

      effects.push(StateEffect.reconfigure.of(dynamicExtensions));

      editorView.dispatch({
        effects,
      });
    }
  }, [dynamicExtensions]);

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

  useImperativeHandle(
    codeEditorHandle,
    () => ({
      containerRef: containerRef.current,
      getEditorView: () => editorRef.current,
      setDocument: (doc: string) => {
        const editor = editorRef.current;
        if (editor) {
          const selection = editor.state.selection.ranges[0];
          
          if (selection) {
            editor.dispatch({
              changes: {
                from: 0,
                to: editor.state.doc.length,
                insert: doc,
              },
              selection: {
                anchor: doc.length < selection.anchor ? doc.length : selection.anchor,
              },
            });
          }
        }
      },
    }),
    [],
  );

  return (
    <div
      role="textbox"
      data-enable-grammarly="false"
      id={id}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={(e) => {
        onBlur?.(e, codeEditor?.contentDOM.textContent ?? '');
      }}
      className={className}
      ref={containerRef}
    />
  );
}