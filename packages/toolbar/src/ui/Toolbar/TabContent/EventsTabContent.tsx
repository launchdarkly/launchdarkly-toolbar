import { useMemo, useRef } from 'react';
import { Virtualizer, ListLayout } from 'react-aria-components';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { motion } from 'motion/react';
import { useSearchContext, useAnalytics } from '../context';
import { GenericHelpText } from '../components/GenericHelpText';
import { ActionButtonsContainer, DoNotTrackWarning } from '../components';
import { ANIMATION_CONFIG, VIRTUALIZATION } from '../constants';
import { isDoNotTrackEnabled } from '../../../utils';

import * as styles from './EventsTabContent.css';

import * as actionStyles from '../components/ActionButtonsContainer.css';
import { useCurrentDate, useEvents } from '../hooks';
import type { IEventInterceptionPlugin } from '../../../types/plugin';
import { ProcessedEvent, SyntheticEventContext } from '../../../types/events';
import { AddIcon } from '../components/icons/AddIcon';
import { IconLinkButton } from '../components/IconLinkButton';

interface EventsTabContentProps {
  baseUrl: string;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}

function formatTimeAgo(timestamp: number, currentDate: Date): string {
  const now = currentDate.getTime();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function EventsTabContent(props: EventsTabContentProps) {
  const { eventInterceptionPlugin, baseUrl } = props;
  const { searchTerm } = useSearchContext();
  const analytics = useAnalytics();
  const { events, eventStats } = useEvents(eventInterceptionPlugin, searchTerm);
  const currentDate = useCurrentDate(); // Updates every second by default
  const parentRef = useRef<HTMLDivElement>(null);

  const doNotTrackEnabled = useMemo(() => isDoNotTrackEnabled(), []);

  const handleClearEvents = () => {
    if (eventInterceptionPlugin) {
      eventInterceptionPlugin.clearEvents();
    }
  };

  const handleEventClick = (event: ProcessedEvent) => {
    analytics.trackEventClick(event?.key ?? event.displayName);
    console.group(`📝 Event Details: [kind: ${event.kind}, displayName: ${event.displayName}]`);
    console.table(event);
    console.groupEnd();
  };

  const handleAddFeatureFlag = (flagKey: string) => {
    // Track deeplink opening
    analytics.trackOpenFlagDeeplink(flagKey, baseUrl);
  };

  const createFlagDeeplinkUrl = (flagKey: string): string => {
    return `${baseUrl}/flags/new?selectProject=1&flagKey=${flagKey}`;
  };

  const isFlagNotFound = (context: SyntheticEventContext): boolean => {
    if (!context.reason) {
      return false;
    }

    const { reason } = context;
    return reason.kind === 'ERROR' && reason.errorKind === 'FLAG_NOT_FOUND';
  };

  const getBadgeClass = (kind: string) => {
    switch (kind) {
      case 'feature':
        return styles.eventBadgeFeature;
      case 'identify':
        return styles.eventBadgeIdentify;
      case 'custom':
        return styles.eventBadgeCustom;
      case 'debug':
        return styles.eventBadgeDebug;
      case 'summary':
        return styles.eventBadgeSummary;
      case 'diagnostic':
        return styles.eventBadgeDiagnostic;
      default:
        return styles.eventBadgeDefault;
    }
  };

  // Convert events to items array with unique IDs for GridList
  const items = useMemo(
    () =>
      events.map((event, index) => ({
        id: `${event.timestamp}-${index}`,
        event,
      })),
    [events],
  );

  if (!eventInterceptionPlugin) {
    return (
      <GenericHelpText
        title="Event interception not available"
        subtitle="The event interception plugin is not configured"
      />
    );
  }

  if (doNotTrackEnabled) {
    return <DoNotTrackWarning />;
  }

  if (events.length === 0) {
    return (
      <motion.div
        className={styles.liveTailContainer}
        initial={ANIMATION_CONFIG.eventList.liveTail.container.initial}
        animate={ANIMATION_CONFIG.eventList.liveTail.container.animate}
        transition={ANIMATION_CONFIG.eventList.liveTail.container.transition}
      >
        <div className={styles.liveTailIndicator}>
          <motion.div
            className={styles.liveTailDot}
            animate={{
              scale: ANIMATION_CONFIG.eventList.liveTail.dot.scale,
              opacity: ANIMATION_CONFIG.eventList.liveTail.dot.opacity,
            }}
            transition={ANIMATION_CONFIG.eventList.liveTail.dot.transition}
          />
          <span className={styles.liveTailText}>
            {searchTerm ? 'No matching events - still listening...' : 'Listening for events...'}
          </span>
        </div>
        <div className={styles.liveTailSubtext}>Events will appear here in real-time as they occur</div>
      </motion.div>
    );
  }

  return (
    <div data-testid="events-tab-content">
      <ActionButtonsContainer>
        <button className={actionStyles.actionButton} onClick={handleClearEvents} disabled={events.length === 0}>
          Clear all events ({events.length})
        </button>
      </ActionButtonsContainer>

      <div className={styles.statsHeader}>
        <span className={styles.statsText}>{eventStats.totalEvents} events captured</span>
      </div>

      <div ref={parentRef} className={styles.virtualContainer}>
        <Virtualizer
          layout={ListLayout}
          layoutOptions={{
            estimatedRowHeight: VIRTUALIZATION.ITEM_HEIGHT,
            gap: 0,
            padding: 0,
          }}
        >
          <List
            aria-label="Events"
            items={items}
          >
            {(item) => (
              <ListItem
                textValue={item.event.displayName}
                className={styles.eventListItem}
                data-testid="event-item"
                onAction={() => handleEventClick(item.event)}
              >
                <div className={styles.eventInfo}>
                  <span className={styles.eventName}>{item.event.displayName}</span>
                  <span className={styles.eventMeta}>{formatTimeAgo(item.event.timestamp, currentDate)}</span>
                </div>
                <div className={getBadgeClass(item.event.kind)}>{item.event.kind}</div>
                {item.event.kind === 'feature' && isFlagNotFound(item.event.context) && (
                  <div className={styles.addButtonContainer}>
                    <IconLinkButton
                      className={styles.addButton}
                      data-testid="add-flag-button"
                      icon={<AddIcon />}
                      label="Add Feature Flag"
                      href={createFlagDeeplinkUrl(item.event.context.key || '')}
                      size="medium"
                      onClick={() => handleAddFeatureFlag(item.event.context.key || '')}
                    />
                  </div>
                )}
              </ListItem>
            )}
          </List>
        </Virtualizer>
      </div>
    </div>
  );
}
