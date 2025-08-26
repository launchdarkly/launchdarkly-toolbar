# LaunchDarkly Toolbar

> ⚠️ **Warning:** This package is currently not ready for production use and is considered unsupported. Features, APIs, and behavior may change without notice.

A React component that provides a developer-friendly toolbar for interacting with LaunchDarkly during development. The toolbar supports two modes:

- **Dev Server Mode**: Connect to a LaunchDarkly CLI dev server for flag browsing and real-time updates
- **SDK Mode**: Integrate with debug override plugins for local flag testing

## Installation

```bash
npm install @launchdarkly/toolbar
# or
yarn add @launchdarkly/toolbar
# or
pnpm add @launchdarkly/toolbar
```

1. **Import the component and styles:**

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
```

2. **Add the toolbar to your app:**

**Dev Server Mode** (connects to LaunchDarkly CLI dev server):

```tsx
function App() {
  return (
    <div>
      {/* Your app content */}
      <h1>My App</h1>

      {/* LaunchDarkly Toolbar - Dev Server Mode */}
      <LaunchDarklyToolbar devServerUrl="http://localhost:8765" position="right" />
    </div>
  );
}
```

**SDK Mode** (integrates with debug override plugins):

```tsx
import { debugOverridePlugin } from './your-debug-plugin';

function App() {
  return (
    <div>
      {/* Your app content */}
      <h1>My App</h1>

      {/* LaunchDarkly Toolbar - SDK Mode */}
      <LaunchDarklyToolbar debugOverridePlugin={debugOverridePlugin} position="right" />
    </div>
  );
}
```

3. **Setup your environment:**

**For Dev Server Mode**: Start your LaunchDarkly dev server:

```bash
# Make sure your LaunchDarkly dev server is running
ldcli dev-server start --project your-project --cors-enabled true
```

**For SDK Mode**: No additional setup required - the toolbar integrates directly with your debug plugin.

## Props

| Prop                  | Type                   | Default     | Description                                                               |
| --------------------- | ---------------------- | ----------- | ------------------------------------------------------------------------- |
| `devServerUrl`        | `string` (optional)    | `undefined` | URL of your LaunchDarkly dev server. If provided, enables Dev Server Mode |
| `debugOverridePlugin` | `IDebugOverridePlugin` | `undefined` | Debug override plugin for SDK Mode. Shows Overrides tab when provided     |
| `position`            | `"left" \| "right"`    | `"right"`   | Position of the toolbar on screen                                         |
| `projectKey`          | `string` (optional)    | `undefined` | Optional project key for multi-project setups (Dev Server Mode only)      |
| `pollIntervalInMs`    | `number` (optional)    | `5000`      | Polling interval for dev server updates (Dev Server Mode only)            |

### Mode Determination

The toolbar automatically determines its mode based on the props provided:

- **Dev Server Mode**: When `devServerUrl` is provided
- **SDK Mode**: When `devServerUrl` is omitted (undefined/null)

### Available Tabs by Mode

| Mode                | Available Tabs                                          |
| ------------------- | ------------------------------------------------------- |
| **Dev Server Mode** | Flags, Settings                                         |
| **SDK Mode**        | Overrides (if `debugOverridePlugin` provided), Settings |

## Usage Examples

### Dev Server Mode Examples

#### Basic Dev Server Usage

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App() {
  return (
    <>
      <main>
        <h1>My Application</h1>
        {/* Your app content */}
      </main>

      {/* Connect to dev server on default port */}
      <LaunchDarklyToolbar devServerUrl="http://localhost:8765" />
    </>
  );
}
```

#### Custom Dev Server Configuration

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      <LaunchDarklyToolbar
        devServerUrl="http://localhost:3001"
        position="left"
        projectKey="my-project"
        pollIntervalInMs={3000}
      />
    </>
  );
}
```

### SDK Mode Examples

#### Basic SDK Mode Usage

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { createDebugOverridePlugin } from './your-debug-plugin';

function App() {
  const debugPlugin = createDebugOverridePlugin();

  return (
    <>
      <main>{/* Your app content */}</main>

      {/* SDK Mode - no devServerUrl provided */}
      <LaunchDarklyToolbar debugOverridePlugin={debugPlugin} />
    </>
  );
}
```

#### SDK Mode with Settings Only

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      {/* Shows only Settings tab (no overrides plugin) */}
      <LaunchDarklyToolbar position="left" />
    </>
  );
}
```

### Conditional Usage

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { debugOverridePlugin } from './debug-plugin';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      {/* Show different modes based on environment */}
      {process.env.NODE_ENV === 'development' &&
        (process.env.REACT_APP_USE_DEV_SERVER === 'true' ? (
          <LaunchDarklyToolbar devServerUrl="http://localhost:8765" />
        ) : (
          <LaunchDarklyToolbar debugOverridePlugin={debugOverridePlugin} />
        ))}
    </>
  );
}
```

## How It Works

The LaunchDarkly Toolbar operates in two distinct modes, each designed for different development workflows:

### Dev Server Mode

When `devServerUrl` is provided, the toolbar connects to your LaunchDarkly CLI dev server:

1. **Automatic Discovery** - The toolbar automatically discovers available flags from your dev server
2. **Real-time Updates** - Flag changes are reflected immediately in your application
3. **Project Management** - Switch between multiple projects if configured
4. **Search & Filter** - Quickly find flags using the built-in search functionality
5. **Live Polling** - Continuously polls the dev server for updates

### SDK Mode

When no `devServerUrl` is provided, the toolbar integrates directly with your application:

1. **Plugin Integration** - Works with debug override plugins to provide local flag testing
2. **Local Overrides** - Test different flag values without affecting remote flags
3. **Settings Management** - Access toolbar configuration and controls
4. **No External Dependencies** - Works entirely within your application context

### Mode-Specific Features

| Feature           | Dev Server Mode          | SDK Mode            |
| ----------------- | ------------------------ | ------------------- |
| Flag Browsing     | ✅ Full flag catalog     | ❌ Not available    |
| Local Overrides   | ❌ Not available         | ✅ Via debug plugin |
| Real-time Updates | ✅ From dev server       | ❌ Not available    |
| Project Switching | ✅ Multi-project support | ❌ Not available    |
| Settings          | ✅ Available             | ✅ Available        |

## Toolbar Visibility Control

The toolbar includes built-in visibility controls that allow developers to easily show/hide the toolbar during development. When the toolbar loads, it automatically exposes a global API on the browser's window object.

### Global API

The toolbar provides a `window.ldToolbar` API with the following methods:

```javascript
// Enable the toolbar (removes it from localStorage and shows the toolbar)
window.ldToolbar.enable();

// Disable the toolbar (saves preference to localStorage and hides the toolbar)
window.ldToolbar.disable();

// Toggle the toolbar visibility
window.ldToolbar.toggle();

// Check current status (returns true if enabled, false if disabled)
window.ldToolbar.status();
```

### Console Information

When the toolbar loads, you'll see helpful console output showing the available commands:

```
🔧 LaunchDarkly toolbar controls available:
   window.ldToolbar.enable() - Enable toolbar
   window.ldToolbar.disable() - Disable toolbar
   window.ldToolbar.toggle() - Toggle toolbar
   window.ldToolbar.status() - Check current status
```

### Persistent State

The toolbar's visibility state is automatically saved to localStorage and persists across browser sessions. The state is also synchronized across multiple tabs of the same application.

### Usage Examples

```javascript
// Hide the toolbar for focused development
window.ldToolbar.disable();
// Console: ✅ LaunchDarkly toolbar disabled.

// Show the toolbar when you need it
window.ldToolbar.enable();
// Console: ✅ LaunchDarkly toolbar enabled.

// Check if the toolbar is currently visible
const isEnabled = window.ldToolbar.status();
// Console: LaunchDarkly toolbar is currently: ✅ ENABLED
// Returns: true

// Quick toggle
window.ldToolbar.toggle();
```

## Setup Instructions

### Dev Server Mode Setup

For Dev Server Mode, you need a LaunchDarkly CLI dev-server running with CORS enabled:

```bash
ldcli dev-server start --project demo-project --cors-enabled true
```

See [Dev Server Setup Guide](./docs/DEV_SERVER_SETUP.md) for detailed instructions.

### SDK Mode Setup

For SDK Mode, you can use the toolbar immediately without any setup, or optionally provide a debug override plugin for local flag testing.

See [SDK Mode Setup Guide](./docs/SDK_MODE_SETUP.md) for detailed instructions and examples.

Basic usage (Settings tab only):

```tsx
<LaunchDarklyToolbar />
```

With debug overrides:

```tsx
<LaunchDarklyToolbar debugOverridePlugin={myDebugPlugin} />
```

## TypeScript

The package includes complete TypeScript definitions. No additional `@types` packages needed.

```tsx
import type { LaunchDarklyToolbarProps } from '@launchdarkly/toolbar';

// Dev Server Mode configuration
const devServerConfig: LaunchDarklyToolbarProps = {
  devServerUrl: 'http://localhost:8765',
  position: 'right',
  projectKey: 'my-project',
  pollIntervalInMs: 5000,
};

// SDK Mode configuration
const sdkModeConfig: LaunchDarklyToolbarProps = {
  debugOverridePlugin: myDebugPlugin,
  position: 'left',
};
```

Built with ❤️ for the LaunchDarkly developer community.
