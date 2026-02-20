# LaunchDarkly Toolbar

A framework-agnostic developer toolbar that provides real-time feature flag management and debugging capabilities during development. The toolbar integrates seamlessly with LaunchDarkly, allowing developers to inspect, override, and test feature flags without leaving their application.

## Features

- 🎯 **Dual Mode Operation**: Works with both LaunchDarkly Dev Server and SDK
- 🔄 **Real-time Flag Management**: View and toggle feature flags instantly
- 🎨 **Shadow DOM Isolation**: Zero CSS conflicts with your application
- 🔐 **Built-in Authentication**: Secure toolbar access with LaunchDarkly authentication
- 📍 **Flexible Positioning**: Place toolbar in any corner of your screen
- 🔌 **Plugin System**: Extend functionality with custom plugins
- 📊 **Event Monitoring**: Track and inspect LaunchDarkly events
- 🔍 **Search & Filter**: Quickly find flags in large projects
- ⭐ **Flag Starring**: Mark important flags for quick access
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

### React Hook

```tsx
import { render } from 'react-dom';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/react';
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: 'client-side-id-123abc',
    context: {
      kind: 'user',
      key: 'user-key-123abc',
      name: 'Sandy Smith',
      email: 'sandy@example.com',
    },
    options: {
      plugins: [
        flagOverridePlugin,
        eventInterceptionPlugin,
        // other plugins...
      ],
      // other options...
    },
  });

  function App() {
    // Initialize toolbar with the same plugin instances
    useLaunchDarklyToolbar({
      flagOverridePlugin, // For flag overrides (SDK Mode only)
      eventInterceptionPlugin, // For event monitoring (works in both modes)

      // OR Dev Server Mode: Connect to LaunchDarkly dev server
      devServerUrl: 'http://localhost:8080',
      projectKey: 'my-project', // Optional: auto-detects if not provided

      // Common options
      position: 'bottom-right',
      enabled: process.env.NODE_ENV === 'development',
    });

    return <YourApp />;
  }

  render(
    <LDProvider>
      <App />
    </LDProvider>,
    document.getElementById('root'),
  );
})();
```

### Vue Composable

```typescript
import { onMounted } from 'vue';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/vue';
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

// Initialize LaunchDarkly client
const client = LDClient.initialize(
  'client-side-id-123abc',
  {
    kind: 'user',
    key: 'user-key-123abc',
    name: 'Sandy Smith',
    email: 'sandy@example.com',
  },
  {
    plugins: [flagOverridePlugin, eventInterceptionPlugin],
  },
);

// In your Vue component or setup function
export default {
  setup() {
    onMounted(async () => {
      await client.waitForInitialization();
    });

    // Initialize toolbar with the same plugin instances
    useLaunchDarklyToolbar({
      flagOverridePlugin,
      eventInterceptionPlugin,

      // OR Dev Server Mode
      devServerUrl: 'http://localhost:8080',
      projectKey: 'my-project',

      position: 'bottom-right',
      enabled: import.meta.env.DEV, // Vite
      // enabled: process.env.NODE_ENV === 'development', // Webpack
    });

    return {
      // your component data
    };
  },
};
```

### Angular Service

```typescript
import { Component, OnInit } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import LaunchDarklyToolbarService from '@launchdarkly/toolbar/angular';
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  providers: [LaunchDarklyToolbarService],
})
export class AppComponent implements OnInit {
  private flagOverridePlugin = new FlagOverridePlugin();
  private eventInterceptionPlugin = new EventInterceptionPlugin();
  private ldClient: LDClient.LDClient;

  constructor(private toolbarService: LaunchDarklyToolbarService) {
    // Initialize LaunchDarkly client
    this.ldClient = LDClient.initialize(
      'client-side-id-123abc',
      {
        kind: 'user',
        key: 'user-key-123abc',
        name: 'Sandy Smith',
        email: 'sandy@example.com',
      },
      {
        plugins: [this.flagOverridePlugin, this.eventInterceptionPlugin],
      },
    );
  }

  async ngOnInit() {
    await this.ldClient.waitForInitialization();

    // Initialize toolbar with the same plugin instances
    if (!environment.production) {
      await this.toolbarService.initialize({
        flagOverridePlugin: this.flagOverridePlugin,
        eventInterceptionPlugin: this.eventInterceptionPlugin,

        // OR Dev Server Mode
        devServerUrl: 'http://localhost:8080',
        projectKey: 'my-project',

        position: 'bottom-right',
        enabled: true,
      });
    }
  }
}
```

### CDN Script Tag

Works with any JavaScript framework or vanilla JS. Add this script to your `index.html` file.

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
  key: 'context-key-123abc',
};

const client = LDClient.initialize('client-side-id-123abc', context, {
  plugins: [
    // any other plugins you might want
    flagOverridePlugin,
    eventInterceptionPlugin,
  ],
});

try {
  await client.waitForInitialization(5);
  // initialization succeeded, flag values are now available
  handleInitializedClient(client);
} catch (err) {
  // initialization failed or did not complete before timeout
}

if (process.env.NODE_ENV === 'development' && window.LaunchDarklyToolbar) {
  window.LaunchDarklyToolbar.init({
    flagOverridePlugin,
    eventInterceptionPlugin,
    position: 'bottom-right',
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

## Framework Support

The toolbar provides first-class support for popular frameworks:

### Import Paths

```typescript
// Core toolbar (for CDN or vanilla JS)
import { init } from '@launchdarkly/toolbar';

// Plugins (framework-agnostic)
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

// React hook
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/react';

// Vue composable
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/vue';

// Angular service
import LaunchDarklyToolbarService from '@launchdarkly/toolbar/angular';

// TypeScript types
import type { InitializationConfig } from '@launchdarkly/toolbar/types';
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
│   ├── react/             # React hook and utilities
│   │   ├── useLaunchDarklyToolbar.ts  # Main React hook
│   │   └── lazyLoadToolbar.ts         # Dynamic CDN loading
│   ├── vue/               # Vue composable
│   │   └── useLaunchDarklyToolbar.ts  # Main Vue composable
│   ├── angular/           # Angular service
│   │   └── launchdarkly-toolbar.service.ts  # Injectable service
│   ├── types/             # TypeScript type definitions
│   │   ├── config.ts      # Configuration types
│   │   ├── events.ts      # Event types
│   │   ├── plugins.ts     # Plugin interfaces
│   │   └── index.ts       # Type exports
│   └── index.ts           # Main entry point (NPM package)
├── dist/                  # NPM package output
│   ├── js/                # ES module builds
│   │   ├── index.js
│   │   ├── react.js
│   │   ├── vue.js
│   │   └── angular.js
│   ├── *.cjs              # CommonJS builds
│   └── *.d.ts             # TypeScript definitions
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

### Framework-Specific Options

All framework integrations (React, Vue, Angular) support the same configuration options:

```typescript
interface UseLaunchDarklyToolbarConfig extends ToolbarConfig {
  toolbarBundleUrl?: string; // Custom CDN URL for local development
  enabled?: boolean; // Toggle toolbar on/off (default: true)
}
```

**Example for local development:**

```typescript
// React
useLaunchDarklyToolbar({
  toolbarBundleUrl: 'http://localhost:5764/toolbar.min.js',
  enabled: process.env.NODE_ENV === 'development',
  // ... other options
});

// Vue
useLaunchDarklyToolbar({
  toolbarBundleUrl: 'http://localhost:5764/toolbar.min.js',
  enabled: import.meta.env.DEV,
  // ... other options
});

// Angular
await toolbarService.initialize({
  toolbarBundleUrl: 'http://localhost:5764/toolbar.min.js',
  enabled: !environment.production,
  // ... other options
});
```

## Modes

### Dev Server Mode

Connect directly to a LaunchDarkly dev server to manage server-side flags:

**React:**

```tsx
useLaunchDarklyToolbar({
  devServerUrl: 'http://localhost:5764',
  projectKey: 'my-project', // Optional
  position: 'bottom-right',
});
```

**Vue:**

```typescript
useLaunchDarklyToolbar({
  devServerUrl: 'http://localhost:5764',
  projectKey: 'my-project',
  position: 'bottom-right',
});
```

**Angular:**

```typescript
await toolbarService.initialize({
  devServerUrl: 'http://localhost:5764',
  projectKey: 'my-project',
  position: 'bottom-right',
});
```

**CDN:**

```typescript
window.LaunchDarklyToolbar.init({
  devServerUrl: 'http://localhost:5764',
  projectKey: 'my-project',
  position: 'bottom-right',
});
```

**Features:**

- View all flags from your LaunchDarkly project
- Set flag overrides that persist in dev server
- Changes visible to all connected clients
- Ideal for backend/full-stack development

### SDK Mode

Integrate with LaunchDarkly JS SDK for client-side flag management:

**React:**

```tsx
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

useLaunchDarklyToolbar({
  flagOverridePlugin,
  eventInterceptionPlugin,
  position: 'bottom-right',
});
```

**Vue:**

```typescript
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

useLaunchDarklyToolbar({
  flagOverridePlugin,
  eventInterceptionPlugin,
  position: 'bottom-right',
});
```

**Angular:**

```typescript
import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';

const flagOverridePlugin = new FlagOverridePlugin();
const eventInterceptionPlugin = new EventInterceptionPlugin();

await toolbarService.initialize({
  flagOverridePlugin,
  eventInterceptionPlugin,
  position: 'bottom-right',
});
```

**CDN:**

```typescript
window.LaunchDarklyToolbar.init({
  flagOverridePlugin: new FlagOverridePlugin(),
  eventInterceptionPlugin: new EventInterceptionPlugin(),
  position: 'bottom-right',
});
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
pnpm build:lib

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
