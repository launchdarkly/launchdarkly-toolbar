# LaunchDarkly Toolbar

> 🚧 **Beta:** This package is currently in beta. While functional and tested, APIs may still evolve based on feedback. Please report any issues or suggestions!

A developer-friendly React component that provides real-time feature flag management and debugging capabilities during development. The toolbar integrates seamlessly with LaunchDarkly, allowing developers to inspect, override, and test feature flags without leaving their application.

## Features

- 🎯 **Dual Mode Operation**: Works with both LaunchDarkly Dev Server and SDK
- 🔄 **Real-time Flag Management**: View and toggle feature flags instantly
- 🎨 **Shadow DOM Isolation**: Zero CSS conflicts with your application
- 📍 **Flexible Positioning**: Place toolbar in any corner of your screen
- 🔌 **Plugin System**: Extend functionality with custom plugins
- 📊 **Event Monitoring**: Track and inspect LaunchDarkly events
- 🔍 **Search & Filter**: Quickly find flags in large projects
- ⚡ **Hot Reload Support**: Automatically reflects flag changes

## Installation

```bash
npm install @launchdarkly/toolbar
# or
pnpm add @launchdarkly/toolbar
# or
yarn add @launchdarkly/toolbar
```

## Usage

The Developer Toolbar is intended for use during local development. As such, you should ensure that the way you are
instantiating it will keep it disabled in production environments.

The Developer Toolbar depends on your LaunchDarkly JS client having a reference to the same `FlagOverridePlugin` and
`EventInterceptionPlugin` that you pass into the Developer Toolbar. As such, ensure that you instantiate the Developer Toolbar at the same time or immediately after the LaunchDarkly JS client is instantiated.
Below are a few examples on how to instantiate the toolbar, one using the `useLaunchDarklyToolbar` react hook, and one using the CDN hosted toolbar script.

### React Hook (Recommended for React developers)

```tsx
import { 
  useLaunchDarklyToolbar,
  FlagOverridePlugin,
  EventInterceptionPlugin
} from '@launchdarkly/toolbar';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

(async () => {
  const flagOverridePlugin = new FlagOverridePlugin();
  const eventInterceptionPlugin = new EventInterceptionPlugin();

  const LDProvider = await asyncWithLDProvider({
    clientSideID: 'client-side-id-123abc',
    context: {
      "kind": "user",
      "key": "user-key-123abc",
      "name": "Sandy Smith",
      "email": "sandy@example.com"
    },
    options: {
      // the observability plugins require React Web SDK v3.7+
      plugins: [
        // other plugins...
        flagOverridePlugin,
        eventInterceptionPlugin,
      ],
      // other options...
    }
  });

  useLaunchDarklyToolbar({
    // Dev Server Mode: Connect to LaunchDarkly dev server
    devServerUrl: 'http://localhost:8080',
    projectKey: 'my-project', // Optional: auto-detects if not provided

    // OR SDK Mode: Use with LaunchDarkly React SDK
    flagOverridePlugin: myFlagOverridePlugin,
    eventInterceptionPlugin: myEventPlugin,

    // Common options
    position: 'bottom-right',
    enabled: process.env.NODE_ENV === 'development',
  });

  render(
    <LDProvider>
      <YourApp />
    </LDProvider>,
    document.getElementById('reactDiv'),
  )
})
```

### CDN Script Tag

Add this script to your `index.html` file.

```html
<script src="https://unpkg.com/@launchdarkly/toolbar@latest/cdn/toolbar.min.js"></script>
```

In your corresponding code, wherever you instantiate your LaunchDarkly JS client, be sure to pass in the following plugins:

```typescript
import * as LDClient from 'launchdarkly-js-client-sdk';
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

const context: LDClient.LDContext = {
  kind: 'user',
  key: 'context-key-123abc'
};

const client = LDClient.initialize('client-side-id-123abc', context, {
  plugins: [
    // any other plugins you might want
    flagOverridePlugin,
    eventInterceptionPlugin,
  ]
});

try {
  await client.waitForInitialization(5);
  // initialization succeeded, flag values are now available
  handleInitializedClient(client);
} catch (err) {
  // initialization failed or did not complete before timeout
}

if (process.node.NODE_ENV === 'development' && window.LaunchDarklyToolbar) {
  window.LaunchDarklyToolbar.init({
    flagOverridePlugin,
    eventInterceptionPlugin,
    position: 'bottom-right'
  });
}
```

Note: if you are using typescript and want type safety for the `window.LaunchDarklyToolbar.init` call,
you can add a `window.d.ts` file to your application with the following:

```typescript
import type { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

declare global {
  interface Window {
    LaunchDarklyToolbar?: LaunchDarklyToolbar;
  }
}
```

## Package Structure

```
@launchdarkly/toolbar/
├── src/
│   ├── core/              # Framework-agnostic toolbar implementation
│   │   ├── context/       # React context providers
│   │   ├── services/      # Business logic (DevServerClient, FlagStateManager)
│   │   ├── ui/            # UI components (Toolbar, Tabs, List, etc.)
│   │   ├── tests/         # Unit tests
│   │   └── index.ts       # Core entry point (for CDN builds)
│   ├── react/             # React-specific integrations and utilities
│   │   ├── useLaunchDarklyToolbar.ts  # Main React hook
│   │   └── lazyLoadToolbar.ts         # Dynamic CDN loading
│   ├── types/             # TypeScript type definitions
│   │   ├── config.ts      # Configuration types
│   │   ├── events.ts      # Event types
│   │   ├── plugins.ts     # Plugin interfaces
│   │   └── index.ts       # Type exports
│   └── index.ts           # Main entry point (NPM package)
├── dist/                  # NPM package output
│   ├── index.js           # ES module build
│   ├── index.cjs          # CommonJS build
│   └── index.d.ts         # TypeScript definitions
├── cdn/                   # CDN bundle output
│   └── toolbar.min.js     # IIFE bundle for script tags
├── .storybook/            # Storybook configuration
└── stories/               # Component documentation
```

## Configuration Options

### Common Options

```typescript
interface ToolbarConfig {
  // LaunchDarkly configuration
  baseUrl?: string; // LaunchDarkly API base URL
  projectKey?: string; // Project key (auto-detected if not provided)

  // Dev Server Mode
  devServerUrl?: string; // URL to LaunchDarkly dev server

  // SDK Mode Plugins
  flagOverridePlugin?: IFlagOverridePlugin; // Enable flag overrides
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Monitor events

  // UI Configuration
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pollIntervalInMs?: number; // Polling interval (default: 1000ms)
}
```

### React Hook Options

```typescript
interface UseLaunchDarklyToolbarConfig extends ToolbarConfig {
  toolbarBundleUrl?: string; // Custom CDN URL for local development
  enabled?: boolean; // Toggle toolbar on/off (default: true)
}
```

## Modes

### Dev Server Mode

Connect directly to a LaunchDarkly dev server to manage server-side flags:

```tsx
useLaunchDarklyToolbar({
  devServerUrl: 'http://localhost:8080',
  projectKey: 'my-project', // Optional
  position: 'bottom-right',
});
```

or if you are using the CDN script:

```typescript
window.LaunchDarklyToolbar.init({
  devServerUrl: 'http://localhost:8080',
  projectKey: 'my-project', // Optional
  position: 'bottom-right',
});
```

**Features:**

- View all flags from your LaunchDarkly project
- Set flag overrides that persist in dev server
- Changes visible to all connected clients
- Ideal for backend/full-stack development

### SDK Mode

Integrate with LaunchDarkly React SDK for client-side flag management:

```tsx
import { useFlagOverridePlugin, useEventInterceptionPlugin } from './plugins';

useLaunchDarklyToolbar({
  flagOverridePlugin: useFlagOverridePlugin(),
  eventInterceptionPlugin: useEventInterceptionPlugin(),
  position: 'bottom-right',
});
```

or if you are using the CDN script:

```typescript
window.LaunchDarklyToolbar.init({
  flagOverridePlugin: new FlagOverridePlugin(),
  eventInterceptionPlugin: new EventInterceptionPlugin(),
  position: 'bottom-right',
})
```

**Features:**

- Local flag overrides (client-side only)
- Event monitoring and inspection
- No dev server required
- Ideal for frontend development

## Plugin System

### Flag Override Plugin

```typescript
interface IFlagOverridePlugin {
  getAllFlags(): Record<string, any>;
  setOverride(flagKey: string, value: any): void;
  clearOverride(flagKey: string): void;
  clearAllOverrides(): void;
  onFlagsChange(callback: (flags: Record<string, any>) => void): () => void;
}
```

### Event Interception Plugin

```typescript
interface IEventInterceptionPlugin {
  getEvents(): ProcessedEvent[];
  clearEvents(): void;
  onEvent(callback: (event: ProcessedEvent) => void): () => void;
}
```

## Development

### Building

```bash
# Build both NPM and CDN outputs
pnpm build

# Build only NPM package
pnpm build:npm

# Build only CDN bundle
pnpm build:cdn

# Watch mode for development
pnpm dev
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Storybook

```bash
# Start Storybook dev server
pnpm storybook

# Build Storybook for deployment
pnpm build:storybook
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Apache-2.0

## Links

- [Documentation](https://launchdarkly.com/docs/home/getting-started/dev-toolbar)
- [GitHub Repository](https://github.com/launchdarkly/launchdarkly-toolbar)
- [npm Package](https://www.npmjs.com/package/@launchdarkly/toolbar)
- [Issue Tracker](https://github.com/launchdarkly/launchdarkly-toolbar/issues)
