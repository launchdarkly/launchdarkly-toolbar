import { http, HttpResponse } from 'msw';

// Mock flag data for demo
export const MOCK_FLAGS = {
  'boolean-flag': { value: false, version: 1 },
  'string-flag': { value: 'demo-default-value', version: 2 },
  'number-flag': { value: 100, version: 3 },
  'json-object-flag': {
    value: {
      theme: 'dark',
      features: ['feature1', 'feature2'],
      config: { timeout: 5000 },
    },
    version: 4,
  },
  'demo-welcome-message': { value: 'Welcome to LaunchDarkly Toolbar Demo!', version: 5 },
  'demo-feature-enabled': { value: true, version: 6 },
};

export const handlers = [
  // Mock LaunchDarkly SDK evaluation endpoint
  http.get('https://app.launchdarkly.com/sdk/evalx/*', () => {
    return HttpResponse.json(MOCK_FLAGS);
  }),

  // Mock LaunchDarkly SDK evaluation endpoint (alternative URL)
  http.get('https://app.ld.catamorphic.com/sdk/evalx/*', () => {
    return HttpResponse.json(MOCK_FLAGS);
  }),

  // Mock LaunchDarkly streaming endpoint
  http.get('https://clientstream.launchdarkly.com/eval/*', () => {
    // Return empty response for streaming to prevent real-time updates
    return new HttpResponse(undefined, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }),

  // Mock LaunchDarkly streaming endpoint (alternative URL)
  http.get('https://stream.ld.catamorphic.com/eval/*', () => {
    return new HttpResponse(undefined, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }),

  // Mock LaunchDarkly events endpoint
  http.post('https://events.launchdarkly.com/bulk/*', () => {
    return HttpResponse.json({ success: true }, { status: 202 });
  }),

  // Mock LaunchDarkly events endpoint (alternative URL)
  http.post('https://events.ld.catamorphic.com/bulk/*', () => {
    return HttpResponse.json({ success: true }, { status: 202 });
  }),

  // Mock LaunchDarkly goals endpoint
  http.get('https://app.launchdarkly.com/sdk/goals/*', () => {
    return HttpResponse.json([]);
  }),

  // Mock LaunchDarkly goals endpoint (alternative URL)
  http.get('https://app.ld.catamorphic.com/sdk/goals/*', () => {
    return HttpResponse.json([]);
  }),
];
