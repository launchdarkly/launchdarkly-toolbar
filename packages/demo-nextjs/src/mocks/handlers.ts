import { http, HttpResponse } from 'msw';

// Mock feature flags for demo purposes
export const MOCK_FLAGS = {
  'demo-boolean-flag': true,
  'demo-string-flag': 'hello-world',
  'demo-number-flag': 42,
  'demo-json-flag': {
    message: 'Hello from LaunchDarkly!',
    enabled: true,
    count: 123,
  },
  'feature-toggle': false,
  'welcome-message': 'Welcome to the LaunchDarkly Toolbar Demo!',
  'theme-color': '#007bff',
  'max-items': 10,
  'user-preferences': {
    notifications: true,
    theme: 'light',
    language: 'en',
  },
};

export const handlers = [
  // Mock LaunchDarkly client-side SDK endpoints
  http.get('https://clientsdk.launchdarkly.com/sdk/evalx/:envId/contexts/:contextHash', () => {
    return HttpResponse.json(MOCK_FLAGS);
  }),

  // Mock LaunchDarkly streaming endpoint
  http.get('https://clientstream.launchdarkly.com/eval/:envId/:contextHash', () => {
    // Return a Server-Sent Events response
    const stream = new ReadableStream({
      start(controller) {
        // Send initial data
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(MOCK_FLAGS)}\n\n`));

        // Keep connection alive
        const interval = setInterval(() => {
          controller.enqueue(new TextEncoder().encode('data: {"type":"ping"}\n\n'));
        }, 30000);

        // Clean up on close
        return () => clearInterval(interval);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),

  // Mock LaunchDarkly events endpoint
  http.post('https://events.launchdarkly.com/bulk', () => {
    return HttpResponse.json({ success: true });
  }),

  // Mock LaunchDarkly mobile events endpoint
  http.post('https://mobile.launchdarkly.com/meval', () => {
    return HttpResponse.json({ success: true });
  }),
];
