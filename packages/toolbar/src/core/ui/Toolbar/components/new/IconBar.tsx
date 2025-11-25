import { ToggleOffIcon } from '../icons/ToggleOffIcon';
import { ClickIcon } from '../icons/ClickIcon';
import { GearIcon } from '../icons/GearIcon';
import { ChartHistogram } from '../icons/ChartHistogram';
import { Tooltip } from './Tooltip';
import * as styles from './IconBar.module.css';
import { showInteractiveIcon } from '../../../../../flags/toolbarFlags';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { NewActiveTabId } from '../../types/toolbar';
import { useEffect } from 'react';

type Icon = {
  id: NewActiveTabId;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
};

export const IconBar = ({ defaultActiveTab }: { defaultActiveTab: NewActiveTabId }) => {
  const showInteractiveIconFlag = showInteractiveIcon();
  const { activeTab, setActiveTab } = useActiveTabContext();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, activeTab, setActiveTab]);

  const icons: Icon[] = [
    { id: 'flags', Icon: ToggleOffIcon, label: 'Flags', tooltip: 'Feature Flags' },
    { id: 'monitoring', Icon: ChartHistogram, label: 'Analytics', tooltip: 'Monitoring' },
    { id: 'settings', Icon: GearIcon, label: 'Settings', tooltip: 'Settings' },
  ];

  if (showInteractiveIconFlag) {
    icons.push({ id: 'interactive', Icon: ClickIcon, label: 'Click tracking', tooltip: 'Interactive Mode' });
  }

  return (
    <div className={styles.container}>
      {icons.map(({ id, Icon, label, tooltip }) => (
        <Tooltip key={id} content={tooltip}>
          <button
            onClick={() => setActiveTab(id as NewActiveTabId)}
            className={`${styles.iconButton} ${id === activeTab ? styles.active : ''}`}
            aria-label={label}
          >
            <Icon className={styles.icon} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};
