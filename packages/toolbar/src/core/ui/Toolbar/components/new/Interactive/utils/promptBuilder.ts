import { ElementInfo } from './elementUtils';

export interface FeatureFlagPromptOptions {
  elementContext: string;
  projectKey: string;
  environmentKey?: string;
  suggestedFlagKey?: string;
  intent?: 'hide' | 'show' | 'replace' | 'experiment';
}

/**
 * Builds context string from element info for AI prompts
 */
export function buildElementContext(elementInfo: ElementInfo): string {
  const lines: string[] = [];

  lines.push(`Element: ${elementInfo.primaryIdentifier}`);
  lines.push(`Selector: ${elementInfo.selector}`);

  if (elementInfo.id) {
    lines.push(`ID: ${elementInfo.id}`);
  }

  if (elementInfo.classes.length > 0) {
    lines.push(`Classes: ${elementInfo.classes.join(', ')}`);
  }

  if (elementInfo.dataAttributes.length > 0) {
    const attrs = elementInfo.dataAttributes.map((a) => `${a.name}="${a.value}"`).join(', ');
    lines.push(`Data attributes: ${attrs}`);
  }

  if (elementInfo.htmlAttributes.length > 0) {
    const attrs = elementInfo.htmlAttributes.map((a) => `${a.name}="${a.value}"`).join(', ');
    lines.push(`HTML attributes: ${attrs}`);
  }

  if (elementInfo.textContent) {
    lines.push(`Text content: "${elementInfo.textContent}"`);
  }

  return lines.join('\n');
}

/**
 * Builds a condensed prompt for URL-based delivery (under 8KB when encoded).
 * Includes all essential steps but with less verbose examples.
 */
export function buildCondensedFeatureFlagPrompt(options: FeatureFlagPromptOptions): string {
  const {
    elementContext,
    projectKey,
    environmentKey = 'development',
    suggestedFlagKey,
    intent = 'show',
  } = options;

  return `## Objective
Wrap the specified UI element in a LaunchDarkly feature flag. You have access to LaunchDarkly MCP tools.

## Target Element
${elementContext}

## Configuration
- Project: \`${projectKey}\`
- Environment: \`${environmentKey}\`
${suggestedFlagKey ? `- Suggested flag key: \`${suggestedFlagKey}\`\n` : ''}- Intent: ${intent} (when flag is ON, ${intent === 'hide' ? 'hide this element' : intent === 'show' ? 'show this element' : intent === 'replace' ? 'show new variant' : 'run experiment'})

## Step 1: Find the Source Code
Search the codebase to locate the file rendering this element:
1. Search by text content if available (most reliable)
2. Search by class names - look for className containing these values
3. Search by data attributes or ID
4. Search by HTML structure - grep for tag + attribute combination

Identify: file path, component name, rendering pattern (JSX/template/innerHTML).
**Stop and ask for help if you cannot locate the source.**

## Step 2: Discover Existing Patterns
Search for existing LaunchDarkly usage:
1. Find flag imports: \`useFlags\`, \`useLDClient\`, \`launchdarkly\`
2. Check for wrapper components like \`<FeatureFlag>\`
3. Review naming conventions (prefixes, casing)
**Adopt existing patterns if found.**

## Step 3: Create the Feature Flag
Use \`createFeatureFlag\` MCP tool:
\`\`\`json
{
  "projectKey": "${projectKey}",
  "key": "<kebab-case-key>",
  "name": "<Human Readable Name>",
  "description": "Controls visibility of [element]. Source: [file:line]",
  "tags": ["dev-toolbar", "ui-element"],
  "variations": [{"value": true, "name": "Enabled"}, {"value": false, "name": "Disabled"}],
  "defaults": {"onVariation": 0, "offVariation": 1},
  "clientSideAvailability": {"usingMobileKey": false, "usingEnvironmentId": true}
}
\`\`\`

## Step 4: Implement the Flag
React example:
\`\`\`tsx
import { useFlags } from 'launchdarkly-react-client-sdk';
function Component() {
  const { flagKey } = useFlags(); // camelCase
  if (!flagKey) return null;
  return <TargetElement />;
}
\`\`\`
- Add comment: \`// TODO(feature-flag): flag-key - description\`
- Preserve existing conditional logic (combine with &&)

## Step 5: Verify
- Use \`getFeatureFlag\` to confirm flag exists with correct config
- Run \`tsc --noEmit\` to verify TypeScript compiles
- Flag key in code must match created flag (camelCase for React)

## Step 6: Output Summary
\`\`\`
Flag: \`{flag-key}\`
Dashboard: https://app.launchdarkly.com/${projectKey}/${environmentKey}/features/{flag-key}
Files modified: path/to/file.tsx (lines X-Y)
Current state: Flag is OFF (safe default)
\`\`\``;
}

/**
 * Builds a detailed prompt for an AI agent to wrap an element in a LaunchDarkly feature flag.
 * This prompt is designed for agents with access to LaunchDarkly MCP tools.
 */
export function buildFeatureFlagAgentPrompt(options: FeatureFlagPromptOptions): string {
  const {
    elementContext,
    projectKey,
    environmentKey = 'development',
    suggestedFlagKey,
    intent = 'show',
  } = options;

  return `
## Objective

Wrap the specified UI element in a LaunchDarkly feature flag. You have access to LaunchDarkly MCP tools and the project codebase.

## Target Element

${elementContext}

## Configuration

- Project: \`${projectKey}\`
- Environment: \`${environmentKey}\`
${suggestedFlagKey ? `- Suggested flag key: \`${suggestedFlagKey}\`` : ''}
- Intent: ${intent} (when flag is ON, ${intent === 'hide' ? 'hide this element' : intent === 'show' ? 'show this element' : intent === 'replace' ? 'show new variant' : 'run experiment'})

---

## Step 1: Find the Source Code

Search the codebase to locate the file rendering this element. Try these strategies in order:

1. **Search by text content** if available (most reliable for unique text)
2. **Search by class names** - look for className containing these values
3. **Search by data attributes** - often map directly to component props
4. **Search by ID** - check for id props or DOM manipulation
5. **Search by HTML structure** - grep for the tag + attribute combination

Once found, identify:

- The exact file path and line number
- The component or function name
- The rendering pattern (JSX, template, innerHTML, etc.)
- Any existing conditional rendering logic

**Stop and ask for help if you cannot locate the source after trying all strategies.**

---

## Step 2: Discover Existing Patterns

Before implementing, search the codebase for existing LaunchDarkly usage to match conventions:

1. **Find existing flag imports** - Search for \`useFlags\`, \`useLDClient\`, \`launchdarkly\`, or SDK imports
2. **Examine flag usage patterns** - How are flags typically consumed? (destructured, wrapped in custom hooks, etc.)
3. **Check for wrapper components** - Does the codebase have a custom \`<FeatureFlag>\` component or similar abstraction?
4. **Review naming conventions** - What flag key patterns are already in use? (prefixes, casing, etc.)
5. **Look for feature flag utilities** - Are there helper functions for flag evaluation?

**Adopt existing patterns.** If the codebase:
- Uses a custom hook like \`useFeatureFlag('flag-key')\` → use that instead of raw \`useFlags()\`
- Wraps flags in a \`<Feature flag="key">\` component → use that pattern
- Has specific naming conventions (e.g., \`release-*\`, \`experiment-*\`) → follow those
- Centralizes flag keys in a constants file → add the new key there

If no existing patterns are found, proceed with the standard SDK patterns below.

---

## Step 3: Create the Feature Flag

Use the \`createFeatureFlag\` MCP tool:

\`\`\`json
{
  "projectKey": "${projectKey}",
  "key": "<generated-kebab-case-key>",
  "name": "<Human Readable Name>",
  "description": "Controls visibility of [element description]. Source: [file:line]. Selector: [css-selector]",
  "tags": ["dev-toolbar", "ui-element"],
  "variations": [
    { "value": true, "name": "Enabled" },
    { "value": false, "name": "Disabled" }
  ],
  "defaults": {
    "onVariation": 0,
    "offVariation": 1
  },
  "clientSideAvailability": {
    "usingMobileKey": false,
    "usingEnvironmentId": true
  }
}
\`\`\`

**Flag key naming conventions:**

- show-* : Element visible when ON
- hide-* : Element hidden when ON  
- enable-* : Feature/functionality enabled when ON
- Use component or feature name, not generic terms
- Example: \`show-premium-upgrade-banner\`, \`enable-new-checkout-flow\`

---

## Step 4: Implement the Flag

Detect the SDK from imports and implement accordingly (but prefer existing patterns from Step 2):

### React (launchdarkly-react-client-sdk)

\`\`\`tsx
import { useFlags } from 'launchdarkly-react-client-sdk';

function Component() {
  const { flagKey } = useFlags(); // camelCase version of flag key
  
  // Pattern A: Conditional render
  if (!flagKey) return null;
  return <TargetElement />;
  
  // Pattern B: Inline conditional
  return (
    <>
      {flagKey && <TargetElement />}
    </>
  );
  
  // Pattern C: Variant swap
  return flagKey ? <NewElement /> : <OriginalElement />;
}
\`\`\`

### Vue (vue-ld)

\`\`\`vue
<template>
  <TargetElement v-if="$ld.flags.flagKey" />
</template>

<!-- Or with Composition API -->
<script setup>
import { useLDFlag } from 'launchdarkly-vue-client-sdk';
const flagKey = useLDFlag('flag-key', false);
</script>
\`\`\`

### Angular (@launchdarkly/angular)

\`\`\`typescript
import { LDFlagDirective } from '@launchdarkly/angular';

@Component({
  template: \`<target-element *ldFlag="'flag-key'"></target-element>\`
})
\`\`\`

### Vanilla JavaScript

\`\`\`javascript
import { ldClient } from './launchdarkly'; // or however initialized

if (ldClient.variation('flag-key', false)) {
  document.querySelector('${elementContext.includes('Selector:') ? 'extracted-selector' : '.target'}').style.display = 'block';
}

// Or with listener for real-time updates
ldClient.on('change:flag-key', (value) => {
  element.style.display = value ? 'block' : 'none';
});
\`\`\`

### Implementation Guidelines:

- Add cleanup comment: \`// TODO(feature-flag): flag-key - [brief description]\`
- Wrap at the highest sensible level (avoid deep nesting)
- Preserve existing conditional logic (combine with &&, not replace)
- Match surrounding code style (semicolons, quotes, etc.)
- Import the flag hook/function if not already imported

---

## Step 5: Verify the Implementation

### 5a. Verify flag creation

Use \`getFeatureFlag\` tool to confirm:

- Flag exists with correct key
- Variations are configured correctly
- Client-side availability is enabled

### 5b. Verify code changes

Run these checks:

- [ ] TypeScript compiles without errors (\`tsc --noEmit\` or equivalent)
- [ ] Linting passes (\`eslint\` / \`biome\` / etc.)
- [ ] Flag key in code exactly matches created flag (check camelCase conversion for React)
- [ ] Fallback (flag OFF) preserves current production behavior
- [ ] No unused imports introduced

---

## Step 6: Output Summary

Respond with:

\`\`\`
Feature flag created and implemented

Flag: \`{flag-key}\`
Dashboard: https://app.launchdarkly.com/${projectKey}/${environmentKey}/features/{flag-key}

Files modified:
- path/to/file.tsx (lines X-Y)

Current state: Flag is OFF (safe default)

To activate: Toggle flag ON in dashboard or use:
  ldcli flags update --project ${projectKey} --flag {flag-key} --env ${environmentKey} --on
\`\`\`

---

## Error Handling

If you encounter issues:

| Issue | Action |
|-------|--------|
| Cannot find source file | List search attempts and ask user for file path |
| SDK not installed | Stop and inform user SDK setup is required first |
| Flag key already exists | Use \`getFeatureFlag\` to check config, ask if should reuse |
| Multiple rendering locations | List all locations, ask which to wrap (or wrap all) |
| Complex conditional logic | Show proposed change and ask for confirmation before applying |
`;
}

/**
 * Builds a prompt for adding click tracking to an element
 */
export function buildClickTrackingPrompt(elementInfo: ElementInfo, eventName: string): string {
  const context = buildElementContext(elementInfo);

  return `I need help adding LaunchDarkly click tracking to a UI element.

## Element Details
${context}

## Event Name
\`${eventName}\`

## Task
1. Find this element in the codebase using the selector, classes, data attributes, or text content above
2. Identify the React component that renders this element
3. Add a click handler that tracks the click as a LaunchDarkly custom event using the \`track()\` method
4. Use the event name \`${eventName}\`

## Example Pattern
\`\`\`tsx
import { useLDClient } from 'launchdarkly-react-client-sdk';

function MyComponent() {
  const ldClient = useLDClient();
  
  const handleClick = () => {
    ldClient?.track('${eventName}', {
      // Add any relevant metadata
    });
    // ... existing click logic
  };
  
  return (
    <button onClick={handleClick}>
      Submit
    </button>
  );
}
\`\`\`

Please find the element and implement the click tracking with event name \`${eventName}\`.`;
}
