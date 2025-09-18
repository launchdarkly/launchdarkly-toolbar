import type { ProcessedEvent } from '../types/events';

const MAX_EVENTS = 100;

export class EventStore {
  private events: ProcessedEvent[] = [];
  private listeners: Set<() => void> = new Set();

  addEvent(event: ProcessedEvent): void {
    try {
      this.events.push(event);
      if (this.events.length > MAX_EVENTS) {
        // Remove oldest events to maintain the limit
        this.events.splice(0, this.events.length - MAX_EVENTS);
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
