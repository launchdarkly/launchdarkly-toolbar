import React, { useMemo, useState, useCallback } from 'react';
import { Switch } from '@launchpad-ui/components';

import { useAnalytics, useDevServerContext, useToolbarState, useToolbarUIContext } from '../../../context';
import { usePlugins } from '../../../context';
import { useTabSearchContext } from '../context/TabSearchProvider';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { ProjectSelector } from './ProjectSelector';
import { PositionSelector } from './PositionSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { LogoutButton } from './LogoutButton';
import { ShareButton } from './ShareButton';
import { GenericHelpText } from '../../GenericHelpText';
import { Feedback } from '../../Feedback/Feedback';
import * as styles from './SettingsContent.module.css';
import * as settingsItemStyles from './SettingsItem.module.css';
import { EnvironmentSelector } from './EnvironmentSelector';
import { FeedbackSentiment } from '../../../../../../types';
import { ShareStatePopover, type ShareStateOptions } from '../../ShareStatePopover';
import { serializeToolbarState, SHARED_STATE_VERSION, MAX_STATE_SIZE_LIMIT } from '../../../../../utils/urlOverrides';
import { loadContexts, loadActiveContext, loadAllSettings, loadStarredFlags } from '../../../utils/localStorage';

interface SettingItemData {
  id: string;
  label: string;
  description?: string;
  type: 'project' | 'position' | 'switch' | 'status' | 'button' | 'text' | 'environment' | 'share';
  switchValue?: boolean;
  onSwitchChange?: () => void;
}

interface SettingsSectionData {
  title: string;
  items: SettingItemData[];
}

export function GeneralSettings() {
  const { state } = useDevServerContext();
  const {
    isAutoCollapseEnabled,
    reloadOnFlagChangeIsEnabled,
    mode,
    handleToggleAutoCollapse,
    handleToggleReloadOnFlagChange,
  } = useToolbarState();
  const { position } = useToolbarUIContext();
  const analytics = useAnalytics();
  const { searchTerms } = useTabSearchContext();
  const searchTerm = useMemo(() => searchTerms['general'] || '', [searchTerms]);
  const { flagOverridePlugin } = usePlugins();
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const handleAutoCollapseToggle = () => {
    analytics.trackAutoCollapseToggle(!isAutoCollapseEnabled ? 'enable' : 'disable');
    handleToggleAutoCollapse();
  };

  const handleReloadToggle = () => {
    analytics.trackReloadOnFlagChangeToggle(!reloadOnFlagChangeIsEnabled);
    handleToggleReloadOnFlagChange();
  };

  const handleFeedbackSubmit = (feedback: string, sentiment: FeedbackSentiment) => {
    analytics.trackFeedback(feedback, sentiment);
  };

  const handleShare = useCallback(
    (options: ShareStateOptions) => {
      try {
        // Gather overrides based on mode
        let overrides: Record<string, any> = {};

        if (options.includeFlagOverrides) {
          if (mode === 'sdk' && flagOverridePlugin) {
            // SDK mode: get overrides from plugin
            overrides = flagOverridePlugin.getAllOverrides();
          } else if (mode === 'dev-server') {
            // Dev server mode: get overridden flags from dev server state
            Object.entries(state.flags).forEach(([flagKey, flag]) => {
              if (flag.isOverridden) {
                overrides[flagKey] = flag.currentValue;
              }
            });
          }
        }

        // Gather all toolbar state based on selected options
        const toolbarState = {
          version: SHARED_STATE_VERSION,
          overrides: options.includeFlagOverrides ? overrides : {},
          contexts: options.includeContexts ? loadContexts() : [],
          activeContext: options.includeContexts ? loadActiveContext() : null,
          settings: options.includeSettings ? loadAllSettings() : {},
          starredFlags: options.includeFlagOverrides ? Array.from(loadStarredFlags()) : [],
        };

        // Serialize the state
        const result = serializeToolbarState(toolbarState);

        // Check size limits
        if (result.exceedsLimit) {
          console.error(
            `Shared state is too large (${result.size} chars, limit: ${MAX_STATE_SIZE_LIMIT}). Cannot create shareable link.`,
          );
          alert(
            `The toolbar state is too large to share (${result.size} characters). Try reducing the number of overrides, contexts, or starred flags.`,
          );
          return;
        }

        if (result.exceedsWarning) {
          console.warn(
            `Shared state is large (${result.size} chars). Some browsers may have issues with URLs this long.`,
          );
        }

        // Copy to clipboard
        navigator.clipboard
          .writeText(result.url)
          .then(() => {
            console.log('Share URL copied to clipboard:', result.url);
            analytics.trackShareState({
              includeSettings: options.includeSettings,
              overrideCount: Object.keys(overrides).length,
              contextCount: toolbarState.contexts.length,
              starredFlagCount: toolbarState.starredFlags.length,
            });
          })
          .catch((error) => {
            console.error('Failed to copy share URL:', error);
            alert('Failed to copy URL to clipboard. Please copy it manually from the console.');
          });
      } catch (error) {
        console.error('Failed to create share URL:', error);
        alert('Failed to create shareable link. Check console for details.');
      }
    },
    [mode, flagOverridePlugin, state.flags, analytics],
  );

  // Calculate counts for the dialog
  const overrideCount = useMemo(() => {
    if (mode === 'sdk' && flagOverridePlugin) {
      return Object.keys(flagOverridePlugin.getAllOverrides()).length;
    } else if (mode === 'dev-server') {
      return Object.values(state.flags).filter((flag) => flag.isOverridden).length;
    }
    return 0;
  }, [mode, flagOverridePlugin, state.flags]);

  const contextCount = useMemo(() => {
    return loadContexts().length;
  }, []);

  // Build settings structure based on mode
  const getSettingsSections = (): SettingsSectionData[] => {
    if (mode === 'dev-server') {
      return [
        {
          title: 'Dev Server Configuration',
          items: [
            {
              id: 'project',
              label: 'Project',
              type: 'project',
            },
            {
              id: 'environment',
              label: 'Environment',
              type: 'text',
            },
            {
              id: 'connection',
              label: 'Connection status',
              type: 'status',
            },
          ],
        },
        {
          title: 'Toolbar Settings',
          items: [
            {
              id: 'position',
              label: 'Position',
              type: 'position',
            },
            {
              id: 'auto-collapse',
              label: 'Auto-collapse',
              description: 'Automatically collapses the toolbar when clicking outside.',
              type: 'switch',
              switchValue: isAutoCollapseEnabled,
              onSwitchChange: handleAutoCollapseToggle,
            },
            {
              id: 'reload-on-flag-change',
              label: 'Reload on flag change',
              type: 'switch',
              switchValue: reloadOnFlagChangeIsEnabled,
              onSwitchChange: handleReloadToggle,
            },
            {
              id: 'share',
              label: 'Share toolbar state',
              description: 'Create a shareable link with your current toolbar state',
              type: 'share',
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              id: 'logout',
              label: 'Log out',
              description: 'Sign the Toolbar out of LaunchDarkly',
              type: 'button',
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
              id: 'project',
              label: 'Project',
              type: 'project',
            },
            {
              id: 'environment',
              label: 'Environment',
              type: 'environment',
            },
            {
              id: 'position',
              label: 'Position',
              type: 'position',
            },
            {
              id: 'auto-collapse',
              label: 'Auto-collapse',
              description: 'Automatically collapses the toolbar when clicking outside.',
              type: 'switch',
              switchValue: isAutoCollapseEnabled,
              onSwitchChange: handleAutoCollapseToggle,
            },
            {
              id: 'reload-on-flag-change',
              label: 'Reload on flag change',
              type: 'switch',
              switchValue: reloadOnFlagChangeIsEnabled,
              onSwitchChange: handleReloadToggle,
            },
            {
              id: 'share',
              label: 'Share toolbar state',
              description: 'Create a shareable link with your current toolbar state',
              type: 'share',
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              id: 'logout',
              label: 'Log out',
              description: 'Sign the Toolbar out of LaunchDarkly',
              type: 'button',
            },
          ],
        },
      ];
    }
  };

  const settingsSections = getSettingsSections();

  // Check if any sections have filtered results
  const hasResults = settingsSections.some((section) =>
    section.items.some(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    ),
  );

  if (!hasResults && searchTerm.trim()) {
    return <GenericHelpText title="No settings found" subtitle="Try adjusting your search" />;
  }

  return (
    <div className={styles.container}>
      {settingsSections.map((section) => {
        const filteredItems = section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        );

        if (filteredItems.length === 0) {
          return null;
        }

        return (
          <SettingsSection key={section.title} title={section.title}>
            {filteredItems.map((item) => {
              // Render control based on item type
              let control: React.ReactNode;

              switch (item.type) {
                case 'project':
                  control = <ProjectSelector />;
                  break;
                case 'position':
                  control = <PositionSelector currentPosition={position} />;
                  break;
                case 'status':
                  control = <ConnectionStatus status={state.connectionStatus} />;
                  break;
                case 'switch':
                  control = (
                    <Switch
                      data-theme="dark"
                      className={settingsItemStyles.switch_}
                      isSelected={item.switchValue ?? false}
                      onChange={item.onSwitchChange}
                      aria-label={item.label}
                    />
                  );
                  break;
                case 'button':
                  control = <LogoutButton />;
                  break;
                case 'text':
                  control = <span className={styles.value}>{state.sourceEnvironmentKey || 'Unknown'}</span>;
                  break;
                case 'environment':
                  control = <EnvironmentSelector />;
                  break;
                case 'share':
                  control = (
                    <div style={{ position: 'relative' }}>
                      <ShareButton onClick={() => setIsSharePopoverOpen(!isSharePopoverOpen)} />
                      <ShareStatePopover
                        isOpen={isSharePopoverOpen}
                        onClose={() => setIsSharePopoverOpen(false)}
                        onShare={handleShare}
                        overrideCount={overrideCount}
                        contextCount={contextCount}
                      />
                    </div>
                  );
                  break;
                default:
                  control = null;
              }

              return (
                <SettingsItem key={item.id} label={item.label} description={item.description}>
                  {control}
                </SettingsItem>
              );
            })}
          </SettingsSection>
        );
      })}
      <div className={styles.feedbackSection}>
        <h3 className={styles.feedbackTitle}>Feedback</h3>
        <Feedback onSubmit={handleFeedbackSubmit} />
      </div>
    </div>
  );
}
