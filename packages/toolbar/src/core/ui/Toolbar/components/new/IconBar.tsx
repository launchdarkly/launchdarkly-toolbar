import { ToggleOffIcon } from '../icons/ToggleOffIcon';
import { ClickIcon } from '../icons/ClickIcon';
import { EditIcon } from '../icons/EditIcon';
import { GearIcon } from '../icons/GearIcon';
import { ChartHistogram } from '../icons/ChartHistogram';
import { Tooltip } from './Tooltip';
import * as styles from './IconBar.module.css';

// Placeholder for chip/processor icon
const ChipIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 2a1 1 0 0 0-1 1v1H5a1 1 0 0 0 0 2h1v1a1 1 0 1 0 2 0V6h1a1 1 0 1 0 0-2H8V3a1 1 0 0 0-1-1m7 0a1 1 0 0 0-1 1v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V6h1a1 1 0 1 0 0-2h-1V3a1 1 0 0 0-1-1M7 13a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2H8v-1a1 1 0 0 0-1-1m7 0a1 1 0 0 0-1 1v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1a1 1 0 0 0-1-1M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

export const IconBar = () => {
  const icons = [
    { id: 'flags', Icon: ToggleOffIcon, label: 'Flags', tooltip: 'Feature Flags' },
    { id: 'click', Icon: ClickIcon, label: 'Click tracking', tooltip: 'Interactive Mode' },
    { id: 'chart', Icon: ChartHistogram, label: 'Analytics', tooltip: 'Monitoring' },
    { id: 'settings', Icon: GearIcon, label: 'Settings', tooltip: 'Settings' },
  ];

  return (
    <div className={styles.container}>
      {icons.map(({ id, Icon, label, tooltip }) => (
        <Tooltip key={id} content={tooltip}>
          <button
            className={`${styles.iconButton} ${id === 'flags' ? styles.active : ''}`}
            aria-label={label}
          >
            <Icon className={styles.icon} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

