import React from 'react';
import styles from './ActionButtonsContainer.module.css';

interface ActionButtonsContainerProps {
  children: React.ReactNode;
}

export const ActionButtonsContainer: React.FC<ActionButtonsContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
