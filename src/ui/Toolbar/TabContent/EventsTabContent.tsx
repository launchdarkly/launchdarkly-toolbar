import { List } from '../../List/List';
import { ListItem } from '../../List/ListItem';
import { useSearchContext } from '../context/SearchProvider';
import { GenericHelpText } from '../components/GenericHelpText';

import styles from './EventsTabContent.module.css';

export function EventsTabContent() {
  // Mock events data - replace with real data later
  const mockEvents = [
    { id: 'user-login', name: 'User Login Event', count: 1423, time: '2 min ago' },
    { id: 'feature-flag-toggle', name: 'Feature Flag Toggle', count: 89, time: '5 min ago' },
    { id: 'page-view', name: 'Page View Event', count: 3201, time: '1 min ago' },
    { id: 'click-event', name: 'Button Click Event', count: 567, time: '3 min ago' },
  ];

  const { searchTerm } = useSearchContext();

  const filteredEvents = mockEvents.filter((event) => {
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  if (filteredEvents.length === 0 && searchTerm.trim()) {
    return <GenericHelpText title="No events found" subtitle="Try adjusting your search" />;
  }

  return (
    <div data-testid="events-tab-content">
      <List>
        {filteredEvents.length > 0 &&
          filteredEvents.map((event) => (
            <ListItem
              key={event.id}
              onClick={() => {
                /* Event clicked: ${event.name} */
              }}
            >
              <div className={styles.eventInfo}>
                <span className={styles.eventName}>{event.name}</span>
                <span className={styles.eventMeta}>
                  {event.count} occurrences • {event.time}
                </span>
              </div>
            </ListItem>
          ))}
      </List>
    </div>
  );
}
