import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker for browser environment
export const worker = setupWorker(...handlers);

// Start the worker and return a promise
export const startMockWorker = async () => {
  if (typeof window !== 'undefined') {
    await worker.start({
      onUnhandledRequest: 'bypass', // Let non-mocked requests pass through
      quiet: true, // Reduce console noise
    });
    console.log('🎭 MSW: Mock Service Worker started for LaunchDarkly fallback');
  }
};

// Stop the worker
export const stopMockWorker = () => {
  if (typeof window !== 'undefined') {
    worker.stop();
    console.log('🎭 MSW: Mock Service Worker stopped');
  }
};
