# LaunchDarkly Toolbar

A React component that provides a developer-friendly toolbar for interacting with LaunchDarkly during development.

## Installation

```bash
npm install @launchdarkly/toolbar
# or
yarn add @launchdarkly/toolbar
# or
pnpm add @launchdarkly/toolbar
```

## Quick Start

1. **Import the component and styles:**

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import '@launchdarkly/toolbar/css';
```

2. **Add the toolbar to your app:**

```tsx
function App() {
  return (
    <div>
      {/* Your app content */}
      <h1>My App</h1>

      {/* LaunchDarkly Toolbar */}
      <LaunchDarklyToolbar devServerUrl="http://localhost:8765" position="right" />
    </div>
  );
}
```

3. **Start your LaunchDarkly dev server:**

```bash
# Make sure your LaunchDarkly dev server is running
# The toolbar will automatically connect and display your flags
```

## Props

| Prop           | Type                | Default                   | Description                                   |
| -------------- | ------------------- | ------------------------- | --------------------------------------------- |
| `devServerUrl` | `string`            | `"http://localhost:8765"` | URL of your LaunchDarkly development server   |
| `position`     | `"left" \| "right"` | `"right"`                 | Position of the toolbar on screen             |
| `projectKey`   | `string`            | `undefined`               | Optional project key for multi-project setups |

## Usage Examples

### Basic Usage

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import '@launchdarkly/toolbar/css';

function App() {
  return (
    <>
      <main>
        <h1>My Application</h1>
        {/* Your app content */}
      </main>

      <LaunchDarklyToolbar />
    </>
  );
}
```

### Custom Configuration

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import '@launchdarkly/toolbar/css';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      <LaunchDarklyToolbar devServerUrl="http://localhost:3001" position="left" projectKey="my-project" />
    </>
  );
}
```

### Usage

```tsx
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import '@launchdarkly/toolbar/css';

function App() {
  return (
    <>
      <main>{/* Your app content */}</main>

      {/* Only show toolbar in development */}
      {process.env.NODE_ENV === 'development' && <LaunchDarklyToolbar />}
    </>
  );
}
```

## How It Works

The LaunchDarkly Toolbar connects to your LaunchDarkly development server to provide real-time flag management capabilities:

1. **Automatic Discovery** - The toolbar automatically discovers available flags from your dev server
2. **Real-time Updates** - Flag changes are reflected immediately in your application
3. **Event Stream** - Monitor flag evaluation events as they happen
4. **Search & Filter** - Quickly find flags using the built-in search functionality

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

### Integration with Build Tools

You can also integrate these controls into your development workflow:

```javascript
// Hide toolbar during E2E tests
if (window.Cypress || window.playwright) {
  window.ldToolbar?.disable();
}

// Show toolbar only for specific team members
if (process.env.REACT_APP_SHOW_LD_TOOLBAR === 'true') {
  window.ldToolbar?.enable();
}
```

## Development Server Setup

The toolbar requires a LaunchDarkly CLI dev-server to be running with CORS enabled.

```bash
ldcli dev-server start --project subs-project --cors-enabled true
```

## TypeScript

The package includes complete TypeScript definitions. No additional `@types` packages needed.

```tsx
import type { LaunchDarklyToolbarProps } from '@launchdarkly/toolbar';

const toolbarConfig: LaunchDarklyToolbarProps = {
  devServerUrl: 'http://localhost:8765',
  position: 'right',
  projectKey: 'my-project',
};
```

Built with ❤️ for the LaunchDarkly developer community.
