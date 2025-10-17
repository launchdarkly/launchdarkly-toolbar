import * as styles from './DoNotTrackWarning.css';

export function DoNotTrackWarning() {
  return (
    <div className={styles.warningContainer}>
      <div className={styles.warningMessage}>
        <div className={styles.warningTitle}>Do Not Track is enabled</div>
        <div className={styles.warningText}>
          No events will be captured due to your browser's "Do Not Track" setting. This affects both the toolbar and
          LaunchDarkly analytics.
        </div>
        <div className={styles.warningHelp}>
          To enable event tracking, disable "Do Not Track" in your browser settings.
        </div>
      </div>
    </div>
  );
}
