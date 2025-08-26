import { Button, ListBox, Popover, Select, SelectValue, ListBoxItem } from '@launchpad-ui/components';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { useToolbarContext } from '../context/LaunchDarklyToolbarProvider';
import { StatusDot } from '../components/StatusDot';
import { GenericHelpText } from '../components/GenericHelpText';
import { ChevronDownIcon } from '../components/icons';
import { TOOLBAR_POSITIONS, type ToolbarPosition } from '../types/toolbar';

import * as styles from './SettingsTab.css';

interface SettingsItem {
  id: string;
  name: string;
  icon: string;
  isProjectSelector?: boolean;
  isPositionSelector?: boolean;
  isConnectionStatus?: boolean;
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
      <Popover data-theme="dark">
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
    return position.charAt(0).toUpperCase() + position.slice(1);
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
      <Popover data-theme="dark">
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

export function SettingsTabContent() {
  const { state, switchProject, handlePositionChange } = useToolbarContext();
  const { searchTerm } = useSearchContext();
  const position = state.position;

  const handleProjectSwitch = async (projectKey: string) => {
    try {
      await switchProject(projectKey);
    } catch (error) {
      console.error('Failed to switch project:', error);
    }
  };

  const handlePositionSelect = (newPosition: ToolbarPosition) => {
    handlePositionChange(newPosition);
  };

  // Settings data with position selector
  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Configuration',
      items: [
        {
          id: 'project',
          name: 'Project',
          icon: 'folder',
          isProjectSelector: true,
        },
        {
          id: 'position',
          name: 'Position',
          icon: 'move',
          isPositionSelector: true,
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
  ];

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
            <List>
              {group.items
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
                )
                .map((item) => {
                  if (item.isConnectionStatus) {
                    return (
                      <ListItem key={item.id} onClick={undefined}>
                        <div className={styles.settingInfo}>
                          <div className={styles.settingDetails}>
                            <span className={styles.settingName}>{item.name}</span>
                          </div>
                          <ConnectionStatusDisplay status={state.connectionStatus} />
                        </div>
                      </ListItem>
                    );
                  }

                  return (
                    <ListItem key={item.id} onClick={undefined}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingDetails}>
                          <span className={styles.settingName}>{item.name}</span>
                        </div>
                        {item.isProjectSelector ? (
                          <ProjectSelector
                            availableProjects={state.availableProjects}
                            currentProject={state.currentProjectKey}
                            onProjectChange={handleProjectSwitch}
                            isLoading={state.isLoading}
                          />
                        ) : item.isPositionSelector ? (
                          <PositionSelector currentPosition={position} onPositionChange={handlePositionSelect} />
                        ) : (
                          <span className={styles.settingValue}>{item.value}</span>
                        )}
                      </div>
                    </ListItem>
                  );
                })}
            </List>
          </div>
        );
      })}
    </div>
  );
}
