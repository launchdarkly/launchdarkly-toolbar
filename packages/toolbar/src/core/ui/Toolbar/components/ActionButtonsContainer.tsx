import React from 'react';
import * as styles from './ActionButtonsContainer.css';

interface ActionButtonsContainerProps {
  children: React.ReactNode;
}

export const ActionButtonsContainer: React.FC<ActionButtonsContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
