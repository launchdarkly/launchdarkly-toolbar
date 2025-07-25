import React, { ElementType } from 'react';

import { useTabsContext } from './useTabsContext';

import styles from './Tabs.module.css';

export interface TabButtonProps {
  id: string;
  label: string;
  icon?: ElementType;
  disabled?: boolean;
}

export const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(function TabButton(props, ref) {
  const { id, label, icon: IconComponent, disabled } = props;
  const context = useTabsContext();
  const isActive = context.activeTab === id;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onTabChange(id)}
      disabled={disabled}
      className={`${styles.tab} ${isActive ? styles['tab--active'] : ''}`}
    >
      {IconComponent && <IconComponent className={styles.iconSvg} />}
      {label}
    </button>
  );
});

TabButton.displayName = 'TabButton';
