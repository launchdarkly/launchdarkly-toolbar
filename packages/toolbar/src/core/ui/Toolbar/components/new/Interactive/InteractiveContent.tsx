import { useElementSelection } from '../../../context/ElementSelectionProvider';
import { SelectedElementInfo } from './SelectedElementInfo';
import { ClickIcon } from '../../icons/ClickIcon';
import * as styles from './InteractiveContent.module.css.ts';

export function InteractiveContent() {
  const { selectedElement } = useElementSelection();

  return (
    <div className={styles.container} data-testid="interactive-content">
      {selectedElement ? (
        <SelectedElementInfo />
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.message}>
            Click the <ClickIcon className={styles.inlineIcon} /> icon in the navbar to select an element
          </p>
        </div>
      )}
    </div>
  );
}
