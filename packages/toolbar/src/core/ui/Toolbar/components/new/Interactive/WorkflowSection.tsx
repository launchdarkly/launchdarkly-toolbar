import React from 'react';
import * as styles from './WorkflowSection.module.css.ts';

export interface WorkflowSectionProps {
  title: string;
  children: React.ReactNode;
}

export function WorkflowSection({ title, children }: WorkflowSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.cards}>{children}</div>
    </div>
  );
}
