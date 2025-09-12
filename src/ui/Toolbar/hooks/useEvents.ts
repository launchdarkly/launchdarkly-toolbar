import { useState, useEffect, useMemo } from 'react';
import type { ProcessedEvent } from '../../../types/events';
import { IEventInterceptionPlugin } from '../../../types/plugin';

interface EventStats {
  totalEvents: number;
  eventsByKind: Record<string, number>;
  eventsByFlag: Record<string, number>;
}

interface UseEventsReturn {
  events: ProcessedEvent[];
  eventStats: EventStats;
}

export function useEvents(
  eventInterceptionPlugin: IEventInterceptionPlugin | undefined,
  searchTerm?: string,
): UseEventsReturn {
  const [events, setEvents] = useState<ProcessedEvent[]>([]);

  useEffect(() => {
    if (!eventInterceptionPlugin) {
      setEvents([]);
      return;
    }

    const updateEvents = () => {
      const allEvents = eventInterceptionPlugin.getEvents();
      setEvents([...allEvents].reverse());
    };

    updateEvents();

    const unsubscribe = eventInterceptionPlugin.subscribe(updateEvents);

    return unsubscribe;
  }, [eventInterceptionPlugin]);

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;

    const searchLower = searchTerm.toLowerCase();
    return events.filter(
      (event) =>
        event.displayName.toLowerCase().includes(searchLower) ||
        event.kind.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower) ||
        (event.key && event.key.toLowerCase().includes(searchLower)),
    );
  }, [events, searchTerm]);

  // Calculate stats from current events
  const eventStats = useMemo((): EventStats => {
    const eventsByKind: Record<string, number> = {};
    const eventsByFlag: Record<string, number> = {};

    filteredEvents.forEach((event) => {
      eventsByKind[event.kind] = (eventsByKind[event.kind] || 0) + 1;
      if (event.key) {
        eventsByFlag[event.key] = (eventsByFlag[event.key] || 0) + 1;
      }
    });

    return {
      totalEvents: filteredEvents.length,
      eventsByKind,
      eventsByFlag,
    };
  }, [filteredEvents]);

  return {
    events: filteredEvents,
    eventStats,
  };
}
