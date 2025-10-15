import { http, HttpResponse } from 'msw';

const LD_BASE_URL = import.meta.env.VITE_LD_BASE_URL || 'https://app.launchdarkly.com';
const LD_STREAM_URL = import.meta.env.VITE_LD_STREAM_URL || 'https://clientstream.launchdarkly.com';
const LD_EVENTS_URL = import.meta.env.VITE_LD_EVENTS_URL || 'https://events.launchdarkly.com';

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
  http.get(`${LD_BASE_URL}/sdk/evalx/*`, () => {
    return HttpResponse.json(MOCK_FLAGS);
  }),

  // Mock LaunchDarkly streaming endpoint
  http.get(`${LD_STREAM_URL}/eval/*`, () => {
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

  // Mock LaunchDarkly events endpoint
  http.post(`${LD_EVENTS_URL}/bulk/*`, () => {
    return HttpResponse.json({ success: true }, { status: 202 });
  }),

  // Mock LaunchDarkly goals endpoint
  http.get(`${LD_BASE_URL}/sdk/goals/*`, () => {
    return HttpResponse.json([]);
  }),
];
