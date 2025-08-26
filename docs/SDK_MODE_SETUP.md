# LaunchDarkly Toolbar SDK Mode Setup

The LaunchDarkly Toolbar **in SDK Mode** integrates directly with your application without requiring an external dev server. This mode is perfect for testing local flag overrides during development.

## Overview

SDK Mode provides:

- **Local Flag Overrides**: Test different flag values locally without affecting production
- **Direct SDK Integration**: Works with your existing LaunchDarkly SDK setup
- **Debug Plugin Architecture**: Extensible plugin system for custom integrations

## Basic Setup

### 1. Use the Toolbar Without Dev Server

Simply omit the `devServerUrl` prop to enable SDK Mode:

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      {/* SDK Mode - no devServerUrl provided */}
      <LaunchDarklyToolbar />
    </>
  );
}
```

This will show the toolbar with only the **Settings** tab available.

### 2. Add Debug Override Plugin (Optional)

To enable the **Overrides** tab for local flag testing, provide a debug override plugin:

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { myDebugOverridePlugin } from './debug-plugin';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      {/* SDK Mode with Overrides support */}
      <LaunchDarklyToolbar debugOverridePlugin={myDebugOverridePlugin} />
    </>
  );
}
```

## Debug Override Plugin

The debug override plugin is the bridge between the toolbar and your LaunchDarkly SDK. It implements the `IDebugOverridePlugin` interface:

```tsx
interface IDebugOverridePlugin {
  // Plugin implementation details
  // See plugin architecture documentation for complete interface
}
```

### Example Plugin Implementation

Here's a basic example of how you might implement a debug override plugin:

```tsx
import type { IDebugOverridePlugin } from '@launchdarkly/toolbar';

export const createDebugOverridePlugin = (): IDebugOverridePlugin => {
  const overrides = new Map<string, any>();

  return {
    // Get current overrides
    getOverrides: () => Object.fromEntries(overrides),

    // Set a flag override
    setOverride: (flagKey: string, value: any) => {
      overrides.set(flagKey, value);
      // Notify your SDK about the override
      // Implementation depends on your SDK setup
    },

    // Clear a specific override
    clearOverride: (flagKey: string) => {
      overrides.delete(flagKey);
      // Notify your SDK to remove the override
    },

    // Clear all overrides
    clearAllOverrides: () => {
      overrides.clear();
      // Notify your SDK to remove all overrides
    },

    // Get available flags (optional)
    getAvailableFlags: () => {
      // Return flags available for override
      // This could come from your SDK or a static list
      return [];
    },
  };
};
```

## Integration Patterns

### React Context Integration

If you're using React Context for your LaunchDarkly integration:

```tsx
import { createContext, useContext } from 'react';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

const FlagContext = createContext(null);

export const FlagProvider = ({ children }) => {
  const [overrides, setOverrides] = useState({});

  const debugPlugin = useMemo(
    () => ({
      getOverrides: () => overrides,
      setOverride: (key, value) => {
        setOverrides((prev) => ({ ...prev, [key]: value }));
      },
      clearOverride: (key) => {
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      },
      clearAllOverrides: () => setOverrides({}),
    }),
    [overrides],
  );

  return (
    <FlagContext.Provider value={{ overrides }}>
      {children}
      <LaunchDarklyToolbar debugOverridePlugin={debugPlugin} />
    </FlagContext.Provider>
  );
};
```

### SDK Client Integration

For direct SDK client integration:

```tsx
import { LDClient } from 'launchdarkly-js-client-sdk';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

const createSDKDebugPlugin = (ldClient: LDClient) => ({
  setOverride: (flagKey: string, value: any) => {
    // Store override in localStorage or memory
    localStorage.setItem(`ld-override-${flagKey}`, JSON.stringify(value));

    // Trigger re-evaluation if your SDK supports it
    // Implementation depends on your SDK version and setup
  },

  clearOverride: (flagKey: string) => {
    localStorage.removeItem(`ld-override-${flagKey}`);
    // Trigger re-evaluation
  },

  getOverrides: () => {
    const overrides = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ld-override-')) {
        const flagKey = key.replace('ld-override-', '');
        overrides[flagKey] = JSON.parse(localStorage.getItem(key) || 'null');
      }
    }
    return overrides;
  },
});
```

## Available Tabs in SDK Mode

| Plugin Provided | Available Tabs      |
| --------------- | ------------------- |
| ❌ No plugin    | Settings only       |
| ✅ With plugin  | Overrides, Settings |

## Benefits of SDK Mode

1. **No External Dependencies**: Works without a dev server
2. **Faster Setup**: No CLI installation or configuration required
3. **Offline Support**: Works even without internet connectivity
4. **Custom Integration**: Full control over how overrides are handled
5. **Production Safety**: Overrides are local and don't affect production data

## Common Use Cases

- **Local Development**: Test flag variations during development
- **QA Testing**: Quickly test different flag combinations
- **Demo Preparation**: Set up specific flag states for demos
- **Debugging**: Isolate issues by overriding specific flags
- **Feature Testing**: Test new features with flags enabled/disabled

## Troubleshooting

### Overrides Not Working

1. Verify your debug plugin implementation
2. Check that overrides are being applied in your flag evaluation logic
3. Ensure the plugin is properly connected to your SDK

### Missing Overrides Tab

1. Confirm you're providing the `debugOverridePlugin` prop
2. Verify the plugin implements the required interface
3. Check browser console for any plugin errors

### Performance Considerations

- Keep override logic lightweight
- Consider debouncing override updates if needed
- Avoid blocking the main thread in plugin methods
