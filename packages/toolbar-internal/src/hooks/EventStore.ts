import type { ProcessedEvent } from '../types/events';

const DEFAULT_MAX_EVENTS = 100;
export interface EventStoreConfig {
  /** Maximum number of events to store */
  maxEvents?: number;
}

export class EventStore {
  private events: ProcessedEvent[] = [];
  private listeners: Set<() => void> = new Set();
  private maxEvents: number;

  constructor(config: EventStoreConfig = {}) {
    this.maxEvents = config.maxEvents ?? DEFAULT_MAX_EVENTS;
  }

  addEvent(event: ProcessedEvent): void {
    try {
      this.events.push(event);
      if (this.events.length > this.maxEvents) {
        // Remove oldest events to maintain the limit
        this.events.splice(0, this.events.length - this.maxEvents);
      }
      this.notifyListeners();
    } catch (error) {
      console.warn('Event store error:', error);
    }
  }

  getEvents(): ProcessedEvent[] {
    return [...this.events];
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    listener(); // Send initial notification
    return () => this.listeners.delete(listener);
  }

  clear(): void {
    this.events = [];
    this.notifyListeners();
  }

  destroy(): void {
    this.listeners.clear();
    this.events = [];
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.warn('Listener error:', error);
      }
    });
  }
}
