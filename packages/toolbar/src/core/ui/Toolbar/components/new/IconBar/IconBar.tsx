import { ToggleOffIcon } from '../../icons/ToggleOffIcon';
import { ClickIcon } from '../../icons/ClickIcon';
import { GearIcon } from '../../icons/GearIcon';
import { ChartHistogram } from '../../icons/ChartHistogram';
import { ChipAiIcon } from '../../icons/ChipAiIcon';
import { FlaskIcon } from '../../icons/FlaskIcon';
import { Tooltip } from '../Tooltip';
import * as styles from './IconBar.module.css';
import { enableInteractiveIcon, enableAiIcon, enableOptimizeIcon } from '../../../../../../flags/toolbarFlags';
import { useActiveTabContext } from '../../../context/state';
import { TabId } from '../../../types/toolbar';
import { useEffect } from 'react';

type Icon = {
  id: TabId;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
  disabled?: boolean;
};

interface IconBarProps {
  defaultActiveTab: TabId;
}

export function IconBar({ defaultActiveTab }: IconBarProps) {
  const interactiveIconEnabled = enableInteractiveIcon();
  const aiIconEnabled = enableAiIcon();
  const optimizeIconEnabled = enableOptimizeIcon();
  const { activeTab, setActiveTab } = useActiveTabContext();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, activeTab, setActiveTab]);

  const icons: Icon[] = [
    {
      id: 'interactive',
      Icon: ClickIcon,
      label: 'Click tracking',
      tooltip: interactiveIconEnabled ? 'Interactive Mode' : 'Interactive Mode (Coming Soon)',
      disabled: !interactiveIconEnabled,
    },
    { id: 'flags', Icon: ToggleOffIcon, label: '  Flags', tooltip: 'Feature Flags' },
    {
      id: 'optimize',
      Icon: FlaskIcon,
      label: 'Optimize',
      tooltip: optimizeIconEnabled ? 'Optimization' : 'Optimization (Coming Soon)',
      disabled: !optimizeIconEnabled,
    },
    {
      id: 'ai',
      Icon: ChipAiIcon,
      label: 'AI',
      tooltip: aiIconEnabled ? 'AI' : 'AI (Coming Soon)',
      disabled: !aiIconEnabled,
    },
    { id: 'monitoring', Icon: ChartHistogram, label: 'Analytics', tooltip: 'Monitoring' },
    { id: 'settings', Icon: GearIcon, label: 'Settings', tooltip: 'Settings' },
  ];

  const handleIconClick = (id: TabId, disabled?: boolean) => {
    if (!disabled) {
      setActiveTab(id);
    }
  };

  return (
    <div className={styles.container}>
      {icons.map(({ id, Icon, label, tooltip, disabled }) => (
        <Tooltip key={id} content={tooltip}>
          <button
            onClick={() => handleIconClick(id as TabId, disabled)}
            className={`${styles.iconButton} ${id === activeTab ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
            aria-label={label}
            disabled={disabled}
          >
            <Icon className={styles.icon} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
