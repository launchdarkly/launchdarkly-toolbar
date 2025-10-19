import { Button, ListBox, Popover, Select, SelectValue, ListBoxItem, Switch } from '../../../vendor/launchpad';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { useDevServerContext } from '../context/DevServerProvider';
import { useToolbarUIContext } from '../context/ToolbarUIProvider';
import { useAnalytics } from '../context/AnalyticsProvider';
import { StatusDot } from '../components/StatusDot';
import { GenericHelpText } from '../components/GenericHelpText';
import { ChevronDownIcon } from '../components/icons';
import { TOOLBAR_POSITIONS, type ToolbarPosition, type ToolbarMode } from '../types/toolbar';

import * as styles from './SettingsTab.css';
import * as popoverStyles from '../components/Popover.css';

interface SettingsItem {
  id: string;
  name: string;
  icon: string;
  isProjectSelector?: boolean;
  isPositionSelector?: boolean;
  isConnectionStatus?: boolean;
  isPinToggle?: boolean;
  value?: string;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

interface ProjectSelectorProps {
  availableProjects: string[];
  currentProject: string | null;
  onProjectChange: (projectKey: string) => void;
  isLoading: boolean;
}

function ProjectSelector(props: ProjectSelectorProps) {
  const { availableProjects, currentProject, onProjectChange, isLoading } = props;

  const handleProjectSelect = (key: React.Key | null) => {
    if (key && typeof key === 'string') {
      const projectKey = key;
      if (projectKey !== currentProject && !isLoading) {
        onProjectChange(projectKey);
      }
    }
  };

  return (
    <Select
      selectedKey={currentProject}
      onSelectionChange={handleProjectSelect}
      aria-label="Select project"
      placeholder="Select project"
      data-theme="dark"
      className={styles.select}
      isDisabled={isLoading}
    >
      <Button>
        <SelectValue />
        <ChevronDownIcon className={styles.icon} />
      </Button>
      <Popover data-theme="dark" className={popoverStyles.popover}>
        <ListBox>
          {availableProjects.map((projectKey) => (
            <ListBoxItem id={projectKey} key={projectKey}>
              {projectKey}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

interface PositionSelectorProps {
  currentPosition: ToolbarPosition;
  onPositionChange: (position: ToolbarPosition) => void;
}

function PositionSelector(props: PositionSelectorProps) {
  const { currentPosition, onPositionChange } = props;

  function getPositionsDisplayName(position: ToolbarPosition): string {
    // Convert kebab-case corner names to Title Case
    return position
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  const handlePositionSelect = (key: React.Key | null) => {
    if (key && typeof key === 'string') {
      const position = key as ToolbarPosition;
      if (position !== currentPosition) {
        onPositionChange(position);
      }
    }
  };

  return (
    <Select
      selectedKey={currentPosition}
      onSelectionChange={handlePositionSelect}
      aria-label="Select toolbar position"
      placeholder="Select position"
      data-theme="dark"
      className={styles.select}
    >
      <Button>
        <SelectValue />
        <ChevronDownIcon className={styles.icon} />
      </Button>
      <Popover data-theme="dark" className={popoverStyles.popover}>
        <ListBox>
          {TOOLBAR_POSITIONS.map((position) => (
            <ListBoxItem id={position} key={position}>
              {getPositionsDisplayName(position)}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

interface ConnectionStatusDisplayProps {
  status: 'connected' | 'disconnected' | 'error';
}

interface PinToggleProps {
  isPinned: boolean;
  onTogglePin: () => void;
}

function PinToggle(props: PinToggleProps) {
  const { isPinned, onTogglePin } = props;
  const analytics = useAnalytics();

  const handleToggle = (isSelected: boolean) => {
    // Track pin/unpin action
    analytics.trackPinToggle(isSelected ? 'pin' : 'unpin');
    onTogglePin();
  };

  return (
    <Switch
      className={styles.switch_}
      data-theme="dark"
      isSelected={isPinned}
      onChange={handleToggle}
      aria-label="Pin toolbar"
    />
  );
}

function ConnectionStatusDisplay(props: ConnectionStatusDisplayProps) {
  const { status } = props;

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className={styles.statusIndicator}>
      <span className={styles.statusText}>{getStatusText()}</span>
      <StatusDot status={status} />
    </div>
  );
}

interface SettingsTabContentProps {
  mode: ToolbarMode;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function SettingsTabContent(props: SettingsTabContentProps) {
  const { mode, isPinned, onTogglePin } = props;
  const { state, switchProject } = useDevServerContext();
  const { position, handlePositionChange } = useToolbarUIContext();
  const { searchTerm } = useSearchContext();
  const analytics = useAnalytics();

  const handleProjectSwitch = async (projectKey: string) => {
    try {
      await switchProject(projectKey);
    } catch (error) {
      console.error('Failed to switch project:', error);
    }
  };

  const handlePositionSelect = (newPosition: ToolbarPosition) => {
    // Track position change
    analytics.trackPositionChange(position, newPosition, 'settings');
    handlePositionChange(newPosition);
  };

  // Settings data based on mode
  const getSettingsGroups = (): SettingsGroup[] => {
    if (mode === 'dev-server') {
      return [
        {
          title: 'Dev Server Configuration',
          items: [
            {
              id: 'project',
              name: 'Project',
              icon: 'folder',
              isProjectSelector: true,
            },
            {
              id: 'environment',
              name: 'Environment',
              icon: 'globe',
              value: state.sourceEnvironmentKey || 'Unknown',
            },
            {
              id: 'connection',
              name: 'Connection status',
              icon: 'link',
              isConnectionStatus: true,
            },
          ],
        },
        {
          title: 'Toolbar Settings',
          items: [
            {
              id: 'position',
              name: 'Position',
              icon: 'move',
              isPositionSelector: true,
            },
            {
              id: 'pin',
              name: 'Pin toolbar',
              icon: '',
              isPinToggle: true,
            },
          ],
        },
      ];
    } else {
      // SDK Mode
      return [
        {
          title: 'Toolbar Settings',
          items: [
            {
              id: 'position',
              name: 'Position',
              icon: 'move',
              isPositionSelector: true,
            },
            {
              id: 'pin',
              name: 'Pin toolbar',
              icon: '',
              isPinToggle: true,
            },
          ],
        },
      ];
    }
  };

  const settingsGroups = getSettingsGroups();

  // Check if any groups have filtered results
  const hasResults = settingsGroups.some((group) =>
    group.items.some(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    ),
  );

  if (!hasResults && searchTerm.trim()) {
    return <GenericHelpText title="No settings found" subtitle="Try adjusting your search" />;
  }

  return (
    <div data-testid="settings-tab-content">
      {settingsGroups.map((group) => {
        const groupResults = group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        );

        if (groupResults.length === 0) {
          return null;
        }

        return (
          <div key={group.title} className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>{group.title}</h4>
            <List aria-label={group.title}>
              {group.items
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
                )
                .map((item) => (
                  <ListItem key={item.id} textValue={item.name} data-testid={`setting-item-${item.id}`}>
                    <div className={styles.settingInfo}>
                      <div className={styles.settingDetails}>
                        <span className={styles.settingName}>{item.name}</span>
                      </div>
                      {item.isConnectionStatus ? (
                        <ConnectionStatusDisplay status={state.connectionStatus} />
                      ) : item.isProjectSelector ? (
                        <ProjectSelector
                          availableProjects={state.availableProjects}
                          currentProject={state.currentProjectKey}
                          onProjectChange={handleProjectSwitch}
                          isLoading={state.isLoading}
                        />
                      ) : item.isPositionSelector ? (
                        <PositionSelector currentPosition={position} onPositionChange={handlePositionSelect} />
                      ) : item.isPinToggle ? (
                        <PinToggle isPinned={isPinned} onTogglePin={onTogglePin} />
                      ) : (
                        <span className={styles.settingValue}>{item.value}</span>
                      )}
                    </div>
                  </ListItem>
                ))}
            </List>
          </div>
        );
      })}
    </div>
  );
}
