import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { LDClient } from 'launchdarkly-js-client-sdk';

vi.mock('../utils/browser', () => ({
  isDoNotTrackEnabled: vi.fn(),
}));

vi.mock('../utils/feedback', () => ({
  sendFeedback: vi.fn(),
}));

import { isDoNotTrackEnabled } from '../utils/browser';
import { sendFeedback } from '../utils/feedback';
import { ToolbarAnalytics } from '../utils/analytics';

describe('ToolbarAnalytics', () => {
  const mockClient = {
    track: vi.fn(),
  } as unknown as LDClient;

  const isDoNotTrackEnabledMock = vi.mocked(isDoNotTrackEnabled);
  const sendFeedbackMock = vi.mocked(sendFeedback);

  beforeEach(() => {
    vi.clearAllMocks();
    isDoNotTrackEnabledMock.mockReturnValue(false);
  });

  test('tracks feedback event and sends feedback when flag key is provided', () => {
    const analytics = new ToolbarAnalytics(mockClient, undefined, true);

    analytics.trackFeedback('Nice update', 'positive', {
      flagKey: 'use-new-toolbar-design',
      prompt: "How's your experience?",
    });

    expect(mockClient.track).toHaveBeenCalledWith(
      'ld.toolbar.feedback.submitted',
      expect.objectContaining({ sentiment: 'positive', comment: 'Nice update' }),
    );
    expect(sendFeedbackMock).toHaveBeenCalledWith(mockClient, {
      flagKey: 'use-new-toolbar-design',
      feedback: 'Nice update',
      sentiment: 'positive',
      prompt: "How's your experience?",
      customProperties: undefined,
    });
  });

  test('tracks feedback event without sending feedback when flag key is missing', () => {
    const analytics = new ToolbarAnalytics(mockClient, undefined, true);

    analytics.trackFeedback('Fine', 'negative');

    expect(mockClient.track).toHaveBeenCalledWith(
      'ld.toolbar.feedback.submitted',
      expect.objectContaining({ sentiment: 'negative', comment: 'Fine' }),
    );
    expect(sendFeedbackMock).not.toHaveBeenCalled();
  });

  test('does not send feedback when analytics is disabled', () => {
    const analytics = new ToolbarAnalytics(mockClient, undefined, false);

    analytics.trackFeedback('Great', 'positive', { flagKey: 'use-new-toolbar-design' });

    expect(mockClient.track).not.toHaveBeenCalled();
    expect(sendFeedbackMock).not.toHaveBeenCalled();
  });

  test('does not send feedback when Do Not Track is enabled', () => {
    isDoNotTrackEnabledMock.mockReturnValue(true);
    const analytics = new ToolbarAnalytics(mockClient, undefined, true);

    analytics.trackFeedback('Great', 'positive', { flagKey: 'use-new-toolbar-design' });

    expect(mockClient.track).not.toHaveBeenCalled();
    expect(sendFeedbackMock).not.toHaveBeenCalled();
  });
});
