import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { useToolbarContext } from '../context/LaunchDarklyToolbarProvider';
import { GenericHelpText } from '../components/GenericHelpText';
import { ActionButtonsContainer } from '../components';
import { ANIMATION_CONFIG } from '../constants/animations';

import * as styles from './EventsTabContent.css';

import * as actionStyles from '../components/ActionButtonsContainer.css';
import { useCurrentDate, useEvents } from '../hooks';

interface EventsTabContentProps {}

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

export function EventsTabContent(_props: EventsTabContentProps) {
  const { eventInterceptionPlugin } = useToolbarContext();
  const { searchTerm } = useSearchContext();
  const { events, eventStats } = useEvents(eventInterceptionPlugin, searchTerm);
  const currentDate = useCurrentDate(); // Updates every second by default
  const parentRef = useRef<HTMLDivElement>(null);

  const handleClearEvents = () => {
    if (eventInterceptionPlugin) {
      eventInterceptionPlugin.clearEvents();
    }
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

  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 85,
    overscan: 5,
  });

  if (!eventInterceptionPlugin) {
    return (
      <GenericHelpText
        title="Event interception not available"
        subtitle="The event interception plugin is not configured"
      />
    );
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
        <List>
          <div
            className={styles.virtualInner}
            style={{
              height: virtualizer.getTotalSize(),
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const event = events[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  className={styles.virtualItem}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    borderBottom: '1px solid var(--lp-color-gray-800)',
                    cursor: 'pointer',
                  }}
                >
                  <ListItem
                    onClick={() => {
                      console.group(`📝 Event Details: [kind: ${event.kind}, displayName: ${event.displayName}]`);
                      console.table(event);
                      console.groupEnd();
                    }}
                  >
                    <div className={styles.eventInfo}>
                      <span className={styles.eventName}>{event.displayName}</span>
                      <span className={styles.eventMeta}>{formatTimeAgo(event.timestamp, currentDate)}</span>
                    </div>
                    <div className={getBadgeClass(event.kind)}>{event.kind}</div>
                  </ListItem>
                </div>
              );
            })}
          </div>
        </List>
      </div>
    </div>
  );
}
