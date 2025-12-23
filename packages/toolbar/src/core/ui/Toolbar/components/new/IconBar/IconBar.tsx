import { useEffect, useState, useMemo } from 'react';
import { ToggleOffIcon } from '../../icons/ToggleOffIcon';
import { ClickIcon } from '../../icons/ClickIcon';
import { GearIcon } from '../../icons/GearIcon';
import { ChartHistogram } from '../../icons/ChartHistogram';
import { ChipAiIcon } from '../../icons/ChipAiIcon';
import { FlaskIcon } from '../../icons/FlaskIcon';
import { Tooltip } from '../Tooltip';
import * as styles from './IconBar.module.css';
import { enableInteractiveIcon, enableAiIcon, enableOptimizeIcon } from '../../../../../../flags/toolbarFlags';
import { useActiveTabContext, useElementSelection, useAnalytics } from '../../../context';
import { TabId } from '../../../types/toolbar';

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
  const { startSelection } = useElementSelection();
  const analytics = useAnalytics();
  const [hoveredIcon, setHoveredIcon] = useState<TabId | null>(null);

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, activeTab, setActiveTab]);

  const icons: Icon[] = [
    {
      id: 'interactive',
      Icon: ClickIcon,
      label: 'Interactive mode',
      tooltip: interactiveIconEnabled ? 'Interactive mode' : 'Interactive mode (coming soon)',
      disabled: !interactiveIconEnabled,
    },
    { id: 'flags', Icon: ToggleOffIcon, label: '  Flags', tooltip: 'Feature flags' },
    {
      id: 'optimize',
      Icon: FlaskIcon,
      label: 'Optimize',
      tooltip: optimizeIconEnabled ? 'Optimization' : 'Optimization (coming soon)',
      disabled: !optimizeIconEnabled,
    },
    {
      id: 'ai',
      Icon: ChipAiIcon,
      label: 'AI',
      tooltip: aiIconEnabled ? 'AI' : 'AI (coming soon)',
      disabled: !aiIconEnabled,
    },
    { id: 'monitoring', Icon: ChartHistogram, label: 'Analytics', tooltip: 'Monitoring' },
    { id: 'settings', Icon: GearIcon, label: 'Settings', tooltip: 'Settings' },
  ];

  const handleIconClick = (id: TabId, disabled?: boolean) => {
    if (disabled) return;

    // If clicking the interactive icon
    if (id === 'interactive') {
      if (activeTab === 'interactive') {
        // Already in interactive mode - start selection
        startSelection();
      } else {
        // Switch to interactive mode AND start selection
        analytics.trackTabChange(activeTab || null, id);
        setActiveTab(id);
        startSelection();
      }
    } else {
      // Only track if actually changing tabs
      if (activeTab !== id) {
        analytics.trackTabChange(activeTab || null, id);
      }
      setActiveTab(id);
    }
  };

  // Get dynamic tooltip for interactive icon
  const getTooltip = (icon: Icon): string => {
    if (icon.id === 'interactive' && activeTab === 'interactive' && !icon.disabled) {
      return 'Select element';
    }
    return icon.tooltip;
  };

  // Check if the interactive icon should show the "select" hover state
  const isInteractiveSelectMode = (id: TabId): boolean => {
    return id === 'interactive' && activeTab === 'interactive' && hoveredIcon === 'interactive';
  };

  return (
    <div className={styles.container}>
      {icons.map(({ id, Icon, label, tooltip, disabled }) => {
        const icon = useMemo(() => ({ id, Icon, label, tooltip, disabled }), [id, Icon, label, tooltip, disabled]);
        const showSelectState = isInteractiveSelectMode(id);

        return (
          <Tooltip key={id} content={getTooltip(icon)}>
            <button
              onClick={() => handleIconClick(id as TabId, disabled)}
              onMouseEnter={() => setHoveredIcon(id)}
              onMouseLeave={() => setHoveredIcon(null)}
              className={`${styles.iconButton} ${id === activeTab ? styles.active : ''} ${disabled ? styles.disabled : ''} ${showSelectState ? styles.selectMode : ''}`}
              aria-label={label}
              disabled={disabled}
            >
              <Icon className={styles.icon} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
