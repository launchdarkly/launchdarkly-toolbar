# LaunchDarkly Toolbar

> ⚠️ **Warning:** This package is currently not ready for production use and is considered unsupported. Features, APIs, and behavior may change without notice.

A React component that provides a developer-friendly toolbar for interacting with LaunchDarkly during development. The toolbar supports two modes:

- **Dev Server Mode**: Connect to a LaunchDarkly CLI dev server for flag browsing and real-time updates
- **SDK Mode**: Integrate with flag override plugins for local flag testing

## Installation

```bash
npm install @launchdarkly/toolbar
```

## Quick Start

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

**SDK Mode** (integrates with flag override override plugins):

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { debugOverridePlugin } from './your-flag-override-plugin';
import { eventInterceptionPlugin } from './your-event-interception-plugin';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <LaunchDarklyToolbar
        debugOverridePlugin={debugOverridePlugin}
        eventInterceptionPlugin={eventInterceptionPlugin}
      />
    </div>
  );
}
```

## Props

| Prop                      | Type                       | Default     | Description                                                               |
| ------------------------- | -------------------------- | ----------- | ------------------------------------------------------------------------- |
| `devServerUrl`            | `string` (optional)        | `undefined` | URL of your LaunchDarkly dev server. If provided, enables Dev Server Mode |
| `debugOverridePlugin`     | `IDebugOverridePlugin`     | `undefined` | Debug override plugin for SDK Mode. Shows Overrides tab when provided     |
| `eventInterceptionPlugin` | `IEventInterceptionPlugin` | `undefined` | Event interception plugin for SDK Mode. Enables Events tab functionality  |
| `position`                | `"left" \| "right"`        | `"right"`   | Position of the toolbar on screen                                         |
| `projectKey`              | `string` (optional)        | `undefined` | Optional project key for multi-project setups (Dev Server Mode only)      |
| `pollIntervalInMs`        | `number` (optional)        | `5000`      | Polling interval for dev server updates (Dev Server Mode only)            |

## Configuration

### Mode Determination

The toolbar automatically determines its mode:

- **Dev Server Mode**: When `devServerUrl` is provided
- **SDK Mode**: When `devServerUrl` is omitted

### Available Features by Mode

| Mode                | Available Tabs                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Dev Server Mode** | Flags, Settings                                                                                         |
| **SDK Mode**        | Overrides (if `debugOverridePlugin` provided), Events (if `eventInterceptionPlugin` provided), Settings |

## Setup

**Dev Server Mode**: Start your LaunchDarkly dev server with CORS enabled:

```bash
ldcli dev-server start --project your-project --cors-enabled true
```

**SDK Mode**: No additional setup required.

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
import type { LaunchDarklyToolbarProps, IDebugOverridePlugin, IEventInterceptionPlugin } from '@launchdarkly/toolbar';
```

---

Built with ❤️ for the LaunchDarkly developer community.
