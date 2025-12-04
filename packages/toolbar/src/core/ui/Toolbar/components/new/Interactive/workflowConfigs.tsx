import React from 'react';
import { ToggleOffIcon } from '../../icons/ToggleOffIcon';
import { ClickIcon } from '../../icons/ClickIcon';
import {
  buildFeatureFlagAgentPrompt,
  buildCondensedFeatureFlagPrompt,
  buildElementContext,
  buildClickTrackingPrompt,
} from './utils/promptBuilder';
import type { ElementInfo } from './utils/elementUtils';

/**
 * Available workflow types for the WorkflowCard component.
 */
export type WorkflowType = 'featureFlag' | 'clickTracking';

/**
 * Configuration for a single workflow type.
 */
export interface WorkflowConfig {
  /** Icon to display in the card header */
  icon: React.ReactNode;
  /** Title of the workflow card */
  title: string;
  /** Description text explaining what the workflow does */
  description: string;
  /** Label for the input field */
  inputLabel: string;
  /** Placeholder text for the input field */
  inputPlaceholder: string;
  /**
   * Builds the AI prompt given element info, project key, and user input.
   */
  buildPrompt: (elementInfo: ElementInfo, projectKey: string, inputValue: string) => string;
  /**
   * Optional function that builds a condensed version of the prompt for URL-based IDEs
   * (like GitHub Copilot) where URL length is limited.
   */
  buildCondensedPrompt?: (elementInfo: ElementInfo, projectKey: string, inputValue: string) => string;
}

/**
 * Registry of all available workflow configurations.
 * Each workflow knows how to build its own prompts using element context.
 */
export const WORKFLOW_CONFIGS: Record<WorkflowType, WorkflowConfig> = {
  featureFlag: {
    icon: <ToggleOffIcon />,
    title: 'Wrap in Feature Flag',
    description: 'Let an AI agent automatically wrap this element in a new or existing LaunchDarkly feature flag',
    inputLabel: 'Flag Key',
    inputPlaceholder: 'e.g., new-checkout-flow',
    buildPrompt: (elementInfo, projectKey, inputValue) =>
      buildFeatureFlagAgentPrompt({
        elementContext: buildElementContext(elementInfo),
        projectKey,
        suggestedFlagKey: inputValue,
        intent: 'show',
      }),
    buildCondensedPrompt: (elementInfo, projectKey, inputValue) =>
      buildCondensedFeatureFlagPrompt({
        elementContext: buildElementContext(elementInfo),
        projectKey,
        suggestedFlagKey: inputValue,
        intent: 'show',
      }),
  },
  clickTracking: {
    icon: <ClickIcon />,
    title: 'Track Element Click',
    description: 'Track clicks as a LaunchDarkly custom event',
    inputLabel: 'Event Name',
    inputPlaceholder: 'e.g., checkout-button-clicked',
    buildPrompt: (elementInfo, _projectKey, inputValue) => buildClickTrackingPrompt(elementInfo, inputValue),
  },
};

export function getWorkflowConfig(type: WorkflowType): WorkflowConfig {
  return WORKFLOW_CONFIGS[type];
}

