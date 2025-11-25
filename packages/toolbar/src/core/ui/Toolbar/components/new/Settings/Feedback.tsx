import React from 'react';
import * as styles from './Feedback.module.css';

export const Feedback: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Feedback component placeholder</p>
      <p className={styles.subtext}>Will integrate with legacy Feedback component</p>
    </div>
  );
};

