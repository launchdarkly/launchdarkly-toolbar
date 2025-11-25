import { ToggleOffIcon } from '../icons/ToggleOffIcon';
import { ClickIcon } from '../icons/ClickIcon';
import { GearIcon } from '../icons/GearIcon';
import { ChartHistogram } from '../icons/ChartHistogram';
import { Tooltip } from './Tooltip';
import * as styles from './IconBar.module.css';
import { showInteractiveIcon } from '../../../../../flags/toolbarFlags';

export const IconBar = () => {
  const showInteractiveIconFlag = showInteractiveIcon();
  const icons = [
    { id: 'flags', Icon: ToggleOffIcon, label: 'Flags', tooltip: 'Feature Flags' },
    { id: 'chart', Icon: ChartHistogram, label: 'Analytics', tooltip: 'Monitoring' },
    { id: 'settings', Icon: GearIcon, label: 'Settings', tooltip: 'Settings' },
  ];

  if (showInteractiveIconFlag) {
    icons.push({ id: 'click', Icon: ClickIcon, label: 'Click tracking', tooltip: 'Interactive Mode' });
  }

  return (
    <div className={styles.container}>
      {icons.map(({ id, Icon, label, tooltip }) => (
        <Tooltip key={id} content={tooltip}>
          <button className={`${styles.iconButton} ${id === 'flags' ? styles.active : ''}`} aria-label={label}>
            <Icon className={styles.icon} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};
