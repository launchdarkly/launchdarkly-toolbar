# LaunchDarkly Toolbar

> 🚧 **Beta:** This package is currently in beta. While functional and tested, APIs may still evolve based on feedback. Please report any issues or suggestions!

A React component that provides a developer-friendly toolbar for interacting with LaunchDarkly during development. The toolbar supports two modes:

- **SDK Mode**: Integrate with your LaunchDarkly SDK for local flag overrides and testing (recommended)
- **Dev Server Mode**: Connect to a LaunchDarkly CLI dev server for flag browsing and real-time updates

## Installation

```bash
# npm
npm install @launchdarkly/toolbar@next

# yarn
yarn add @launchdarkly/toolbar@next

# pnpm
pnpm add @launchdarkly/toolbar@next
```

## Quick Start

**SDK Mode** (recommended - integrates with your LaunchDarkly SDK):

```tsx
import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { LaunchDarklyToolbar, FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar';

// Create the plugin instances
const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

function App() {
  const [LDProvider, setLDProvider] = useState(null);

  useEffect(() => {
    const initializeLD = async () => {
      const Provider = await asyncWithLDProvider({
        clientSideID: 'your-client-side-id',
        context: { key: 'user-key', name: 'User Name' },
        options: {
          // Pass the plugins to the SDK
          plugins: [flagOverridePlugin, eventInterceptionPlugin],
        },
      });
      setLDProvider(() => Provider);
    };

    initializeLD();
  }, []);

  if (!LDProvider) {
    return <div>Loading LaunchDarkly...</div>;
  }

  return (
    <LDProvider>
      <div>
        <h1>My App</h1>
        {/* Pass the same plugin instances to the toolbar */}
        <LaunchDarklyToolbar
          flagOverridePlugin={flagOverridePlugin}
          eventInterceptionPlugin={eventInterceptionPlugin}
        />
      </div>
    </LDProvider>
  );
}
```

**Dev Server Mode** (connects to LaunchDarkly CLI dev server):

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <LaunchDarklyToolbar devServerUrl="http://localhost:8765" />
    </div>
  );
}
```

## Props

| Prop                      | Type                       | Default     | Description                                                               |
| ------------------------- | -------------------------- | ----------- | ------------------------------------------------------------------------- |
| `flagOverridePlugin`      | `IFlagOverridePlugin`      | `undefined` | Flag override plugin for SDK Mode. Enables flag overrides and testing     |
| `eventInterceptionPlugin` | `IEventInterceptionPlugin` | `undefined` | Event interception plugin for SDK Mode. Enables Events tab functionality  |
| `devServerUrl`            | `string` (optional)        | `undefined` | URL of your LaunchDarkly dev server. If provided, enables Dev Server Mode |
| `position`                | `"left" \| "right"`        | `"right"`   | Position of the toolbar on screen                                         |
| `projectKey`              | `string` (optional)        | `undefined` | Optional project key for multi-project setups (Dev Server Mode only)      |
| `pollIntervalInMs`        | `number` (optional)        | `5000`      | Polling interval for dev server updates (Dev Server Mode only)            |

## Configuration

### Mode Determination

The toolbar automatically determines its mode:

- **SDK Mode**: When `flagOverridePlugin` is provided (recommended for most use cases)
- **Dev Server Mode**: When `devServerUrl` is provided

### Available Features by Mode

| Mode                | Available Tabs                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **SDK Mode**        | Overrides (if `flagOverridePlugin` provided), Events (if `eventInterceptionPlugin` provided), Settings |
| **Dev Server Mode** | Flags, Settings                                                                                        |

## Setup

### SDK Mode (Recommended)

SDK Mode integrates directly with your LaunchDarkly client, allowing you to:

- Override flag values locally without affecting other users
- Test different flag variations instantly
- Work offline or with any LaunchDarkly environment
- Maintain full type safety with your existing SDK setup

Setup is straightforward:

1. Create a `FlagOverridePlugin` instance
2. Pass the plugin to your LaunchDarkly SDK's `plugins` array
3. Pass the same plugin instance to the toolbar component
4. Wrap your app with the LaunchDarkly provider

```tsx
import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { LaunchDarklyToolbar, FlagOverridePlugin } from '@launchdarkly/toolbar';

// Create the plugin instance (outside component to avoid recreating)
const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'my-app-overrides', // Optional: customize storage key
});

function App() {
  const [LDProvider, setLDProvider] = useState(null);

  useEffect(() => {
    const initializeLD = async () => {
      const Provider = await asyncWithLDProvider({
        clientSideID: 'your-client-side-id',
        context: { key: 'user-key', name: 'User Name' },
        options: {
          plugins: [flagOverridePlugin], // Add plugin to SDK
        },
      });
      setLDProvider(() => Provider);
    };

    initializeLD();
  }, []);

  if (!LDProvider) return <div>Loading...</div>;

  return (
    <LDProvider>
      <YourAppContent />
      <LaunchDarklyToolbar flagOverridePlugin={flagOverridePlugin} />
    </LDProvider>
  );
}
```

#### Event Interception Plugin

To track and display LaunchDarkly events (flag evaluations, custom events, etc.), add the `EventInterceptionPlugin`:

```tsx
import { EventInterceptionPlugin } from '@launchdarkly/toolbar';

// Create plugin with optional configuration
const eventInterceptionPlugin = new EventInterceptionPlugin({
  eventCapacity: 250, // Maximum events to store (default: 100)
  enableLogging: true, // Console logging for debugging (default: false)
});

// Add to both SDK and toolbar
const Provider = await asyncWithLDProvider({
  // ... other config
  options: {
    plugins: [flagOverridePlugin, eventInterceptionPlugin],
  },
});

// Pass to toolbar
<LaunchDarklyToolbar flagOverridePlugin={flagOverridePlugin} eventInterceptionPlugin={eventInterceptionPlugin} />;
```

### Dev Server Mode

For teams using the LaunchDarkly CLI dev server, start it with CORS enabled:

```bash
ldcli dev-server start --project your-project --cors-enabled true
```

Then connect the toolbar:

```tsx
<LaunchDarklyToolbar devServerUrl="http://localhost:8765" />
```

## Visibility Control

The toolbar provides a global API for show/hide control:

```javascript
// Toggle visibility
window.ldToolbar.toggle();

// Enable/disable explicitly
window.ldToolbar.enable();
window.ldToolbar.disable();

// Check current status
window.ldToolbar.status(); // returns true/false
```

Visibility preferences are automatically saved to localStorage.

## TypeScript

The package includes complete TypeScript definitions. No additional `@types` packages needed.

```tsx
import type { LaunchDarklyToolbarProps, IFlagOverridePlugin, IEventInterceptionPlugin } from '@launchdarkly/toolbar';
```

---

Built with ❤️ for the LaunchDarkly developer community.
