import CodeMirror from 'codemirror';
import { TextareaHTMLAttributes, JSX, Ref } from 'react';

// Addons
import 'codemirror/keymap/sublime';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/selection/active-line';
// Linting
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';

// Styles
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import 'codemirror/addon/lint/lint.css';
import './styles.css';

import { useRef } from 'react';
import { useEffect } from 'react';

const editorSettings = {
  theme: 'neo',
  keyMap: 'sublime',
  autoCloseBrackets: true,
  matchTags: { bothTags: true },
  styleActiveLine: true,
};

export type CodeEditorProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  value?: string;
  lint?: boolean;
  keyMap?: CodeMirror.KeyMap;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  readOnly?: boolean;
  id?: string;
  options?: {};
  name?: string;
  label?: string | JSX.Element | null;
  screenReaderLabel?: string;
  startCursorAtLine?: number;
  bootstrapFn?: (editor: CodeMirror.EditorFromTextArea, codeMirror: typeof CodeMirror) => CodeMirror.EditorFromTextArea;
  swallowUnmountErrors?: boolean;
  description?: string | JSX.Element | null;
  innerRef?: Ref<unknown>;
};

export function CodeEditor(props: CodeEditorProps) {
  const {
    value,
    lint,
    keyMap,
    onChange,
    onFocus,
    onBlur,
    className,
    readOnly,
    id,
    options,
    name,
    label,
    screenReaderLabel,
    startCursorAtLine,
    bootstrapFn,
    swallowUnmountErrors,
    description,
    innerRef,
    ...rest
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  let cm: CodeMirror.EditorFromTextArea | undefined;

  useEffect(() => {
    if (!cm) {
      setup();
    }
  }, [cm]);

  const setup = () => {
    const editor = textareaRef.current;

    const finalOptions: CodeMirror.EditorConfiguration = {
      ...options,
      ...editorSettings,
      mode: 'json',
      readOnly: !!readOnly,
      lint,
      lineWrapping: true,
      screenReaderLabel: screenReaderLabel ?? 'Editor',
    };

    if (!editor) {
      return;
    }

    cm = CodeMirror.fromTextArea(editor, finalOptions);

    if (!cm) {
      return;
    }

    if (bootstrapFn) {
      cm = bootstrapFn(cm, CodeMirror);
    }

    if (typeof startCursorAtLine === 'number' && cm) {
      setTimeout(() => {
        if (cm) {
          const line = startCursorAtLine - 1; // Convert to 0-based index
          const lineContent = cm.getLine(line) || '';
          // Trim trailing whitespace to get the last non-whitespace character
          const lastNonWhitespacePos = lineContent.trimEnd().length;
          cm.setCursor({ line, ch: lastNonWhitespacePos });
        }
      }, 0);
    }

    if (keyMap) {
      cm.addKeyMap(keyMap);
    }

    cm.on('change', handleChange);
    cm.on('blur', handleBlur);
    cm.on('focus', handleFocus);

    // Codemirror has a non-hidden input field.
    // This is what we need to describe for accessibility, not the initial textarea that
    // codemirror mounts on and replaces.
    const inputId = id ?? 'editor';
    const inputField = cm.getInputField();
    inputField.setAttribute('id', inputId);
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    inputField.setAttribute(
      'aria-describedby',
      props['aria-describedby'] ?? `${[...inputId].join('')}-err`,
    ); /* eslint-enable @typescript-eslint/no-non-null-assertion */
    inputField.setAttribute('name', name ?? inputId);
  }

  const handleChange = (editor: CodeMirror.Editor) => {
    const value = editor.getValue();

    if (onChange) {
      onChange(value);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      {description && <>{description}</>}
      <textarea
        autoComplete="off"
        className="CodeEditor-textarea"
        defaultValue={value}
        ref={(element) => {
          textareaRef.current = element;

          if (typeof innerRef === 'function') {
            innerRef(element);
          } else if (innerRef) {
            innerRef.current = element;
          }
        }}
      />
    </div>
  );
}
