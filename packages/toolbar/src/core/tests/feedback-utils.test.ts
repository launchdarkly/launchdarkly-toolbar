import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { LDClient } from 'launchdarkly-js-client-sdk';

vi.mock('@launchdarkly/session-replay', () => ({
  LDRecord: {
    getSession: vi.fn(),
  },
}));

import { LDRecord } from '@launchdarkly/session-replay';
import { sendFeedback } from '../utils/feedback';

describe('sendFeedback', () => {
  const mockClient = {
    track: vi.fn(),
    flush: vi.fn(),
  } as unknown as LDClient;

  const mockLDRecordMethods = vi.mocked(LDRecord);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('sends feedback with default sentiment', () => {
    mockLDRecordMethods.getSession.mockReturnValue(undefined);

    sendFeedback(mockClient, {
      flagKey: 'use-new-toolbar-design',
      feedback: 'Looks good',
    });

    expect(mockClient.track).toHaveBeenCalledWith(
      '$ld:feedback',
      expect.objectContaining({
        feedback_answer: 'Looks good',
        flag_key: 'use-new-toolbar-design',
        sentiment: 'neutral',
      }),
    );
    expect(mockClient.flush).toHaveBeenCalled();
  });

  test('includes prompt, custom properties, and session id when available', () => {
    mockLDRecordMethods.getSession.mockReturnValue({ sessionSecureID: 'session-123' });

    sendFeedback(mockClient, {
      flagKey: 'use-new-toolbar-design',
      feedback: 'Could be better',
      sentiment: 'negative',
      prompt: "How's your experience?",
      customProperties: { surface: 'settings' },
    });

    expect(mockClient.track).toHaveBeenCalledWith(
      '$ld:feedback',
      expect.objectContaining({
        feedback_answer: 'Could be better',
        flag_key: 'use-new-toolbar-design',
        sentiment: 'negative',
        feedback_prompt: "How's your experience?",
        o11y_session_id: 'session-123',
        custom_properties: { surface: 'settings' },
      }),
    );
    expect(mockClient.flush).toHaveBeenCalled();
  });
});
