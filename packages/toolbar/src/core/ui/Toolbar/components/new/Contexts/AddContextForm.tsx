import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContextsContext } from '../../../context/api/ContextsProvider';
import { CancelIcon } from '../../icons';
import { EASING } from '../../../constants';
import { JsonEditor } from '../../../../JsonEditor/JsonEditor';
import type { Diagnostic } from '@codemirror/lint';
import * as styles from './AddContextForm.module.css';
import { Context } from '../../../types/ldApi';

interface AddContextFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CONTEXT_JSON = `{
  "kind": "",
  "key": "",
  "name": ""
}`;

export function AddContextForm({ isOpen, onClose }: AddContextFormProps) {
  const { addContext } = useContextsContext();
  const [jsonValue, setJsonValue] = useState(DEFAULT_CONTEXT_JSON);
  const [lintErrors, setLintErrors] = useState<Diagnostic[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleJsonChange = useCallback((value: string) => {
    setJsonValue(value);
    setParseError(null);
  }, []);

  const handleLintErrors = useCallback((errors: Diagnostic[]) => {
    setLintErrors(errors);
  }, []);

  const handleEditorHeightChange = useCallback((_height: number) => {
    // Height is managed by the container
  }, []);

  const isValid = useMemo(() => {
    if (lintErrors.length > 0) {
      return false;
    }
    try {
      const parsed = JSON.parse(jsonValue);

      if (!parsed || typeof parsed !== 'object') {
        return false;
      }

      // Check if it's a multi-kind context
      if (parsed.kind === 'multi') {
        if (typeof parsed.name !== 'string' || parsed.name.trim() === '') {
          return false;
        }

        // For multi-kind, check that there's at least one nested context with a key
        const contextKinds = Object.keys(parsed).filter((k) => k !== 'kind');
        if (contextKinds.length === 0) {
          return false;
        }

        // At least one nested context must have a non-empty key
        return contextKinds.some((contextKind: string) => {
          const nestedContext = parsed[contextKind];
          return (
            nestedContext &&
            typeof nestedContext === 'object' &&
            typeof nestedContext.key === 'string' &&
            nestedContext.key.trim() !== ''
          );
        });
      }

      // For single-kind context, check that kind and key are present and valid
      return (
        typeof parsed.kind === 'string' &&
        parsed.kind.trim() !== '' &&
        typeof parsed.key === 'string' &&
        parsed.key.trim() !== '' &&
        typeof parsed.name === 'string' &&
        parsed.name.trim() !== ''
      );
    } catch {
      return false;
    }
  }, [jsonValue, lintErrors]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!isValid) {
        return;
      }

      try {
        const parsed = JSON.parse(jsonValue);

        if (!parsed || typeof parsed !== 'object') {
          setParseError('Invalid JSON: must be an object');
          return;
        }

        if (!parsed.kind || typeof parsed.kind !== 'string' || !parsed.kind.trim()) {
          setParseError('Context must have a "kind" field');
          return;
        }

        // Handle multi-kind contexts
        if (parsed.kind === 'multi') {
          const contextKinds = Object.keys(parsed).filter((k) => k !== 'kind');
          if (contextKinds.length === 0) {
            setParseError('Multi-kind context must have at least one nested context');
            return;
          }

          addContext(parsed);

          // Reset form
          setJsonValue(DEFAULT_CONTEXT_JSON);
          setParseError(null);
          setLintErrors([]);
          onClose();
          return;
        }

        // Handle single-kind contexts
        if (!parsed.key || typeof parsed.key !== 'string' || !parsed.key.trim()) {
          setParseError('Context must have a "key" field');
          return;
        }

        const context: Context = {
          kind: parsed.kind.trim(),
          key: parsed.key.trim(),
          name: parsed.name?.trim() || undefined,
          anonymous: parsed.anonymous === true,
        };

        addContext(context);
        // Reset form
        setJsonValue(DEFAULT_CONTEXT_JSON);
        setParseError(null);
        setLintErrors([]);
        onClose();
      } catch (error) {
        setParseError(error instanceof Error ? error.message : 'Invalid JSON');
      }
    },
    [jsonValue, isValid, addContext, onClose],
  );

  const handleCancel = useCallback(() => {
    setJsonValue(DEFAULT_CONTEXT_JSON);
    setParseError(null);
    setLintErrors([]);
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: EASING.smooth }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Add Context</h3>
            <button className={styles.closeButton} onClick={handleCancel} aria-label="Close">
              <CancelIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                Context JSON <span className={styles.required}>*</span>
              </label>
              <div className={styles.jsonEditorContainer}>
                <JsonEditor
                  editorId="add-context-json-editor"
                  docString={jsonValue}
                  onChange={handleJsonChange}
                  onLintErrors={handleLintErrors}
                  onEditorHeightChange={handleEditorHeightChange}
                  initialState={{ autoFocus: true }}
                />
              </div>
              {parseError && <div className={styles.errorText}>{parseError}</div>}
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={!isValid}>
                Add Context
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
