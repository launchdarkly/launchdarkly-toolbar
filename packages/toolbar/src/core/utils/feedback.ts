import { LDRecord } from '@launchdarkly/session-replay';
import type { LDClient } from '@launchdarkly/js-client-sdk';

export type LDFeedbackSentiment = 'positive' | 'neutral' | 'negative';

export type LDFeedbackData = {
  feedback_answer: string;
  flag_key: string;
  sentiment?: LDFeedbackSentiment;
  feedback_prompt?: string;
  o11y_session_id?: string;
  custom_properties?: Record<string, unknown>;
};

export interface SendFeedbackOptions {
  flagKey: string;
  feedback: string;
  sentiment?: LDFeedbackSentiment;
  prompt?: string;
  customProperties?: Record<string, unknown>;
}

export function sendFeedback(client: LDClient, options: SendFeedbackOptions): void {
  const { flagKey, feedback, sentiment, prompt, customProperties } = options;
  const feedbackData: LDFeedbackData = {
    feedback_answer: feedback,
    flag_key: flagKey,
    sentiment: sentiment ?? 'neutral',
    custom_properties: customProperties,
  };
  const sessionId = LDRecord?.getSession()?.sessionSecureID;
  if (sessionId) {
    feedbackData.o11y_session_id = sessionId;
  }
  if (prompt) {
    feedbackData.feedback_prompt = prompt;
  }

  client.track('$ld:feedback', feedbackData);
  client.flush();
}
