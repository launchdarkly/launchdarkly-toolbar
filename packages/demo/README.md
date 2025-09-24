# LaunchDarkly Toolbar Demo

This is a demo application showcasing the LaunchDarkly Toolbar component. It provides an interactive environment to test and explore all the features of the toolbar.

## Features Demonstrated

- ✅ **Dual Mode Operation** (Dev Server Mode + SDK Mode)
- ✅ **Animated toolbar** that expands from a circle
- ✅ **Position configuration** (left/right)
- ✅ **Dev server connection** with configurable URL
- ✅ **Project key configuration** with auto-detection fallback
- ✅ **Flag override plugin** integration
- ✅ **Event interception plugin** integration
- ✅ **Flag management** and toggling
- ✅ **Local override testing**
- ✅ **Event monitoring** and tracking
- ✅ **Settings configuration**
- ✅ **Search functionality**
- ✅ **Responsive design**
- ✅ **Keyboard navigation**

## Getting Started

### From the root project directory:

1. **Start the demo:**

   ```bash
   pnpm demo
   ```

   This will build the toolbar library and start the demo development server.

2. **Development mode** (if you're actively developing the toolbar):

   ```bash
   # Terminal 1: Watch and rebuild the toolbar
   pnpm dev

   # Terminal 2: Run the demo
   pnpm demo
   ```

### From the demo directory:

1. **Install dependencies** (if not already done):

   ```bash
   cd packages/demo
   pnpm install
   ```

2. **Start the dev server:**
   ```bash
   pnpm dev
   ```

## Using the Demo

1. **Configure the toolbar** using the configuration panel on the left:
   - **Mode**: Choose between Dev Server Mode and SDK Mode
   - **Position**: Choose between left or right positioning
   - **Dev Server URL**: Set your LaunchDarkly dev server URL (Dev Server Mode only)
   - **Project Key**: Optionally specify a project key (Dev Server Mode only)
   - **Flag Override Plugin**: Enable/disable the flag override plugin (SDK Mode)
   - **Event Plugin**: Enable/disable the event interception plugin (SDK Mode)

2. **Interact with the toolbar:**
   - Look for the circular toolbar in the bottom corner
   - Hover over it to expand the full interface
   - **Dev Server Mode**: Explore the Flags and Settings tabs
   - **SDK Mode**: Explore the Overrides (if flag override plugin enabled), Events (if event plugin enabled), and Settings tabs
   - Test the search functionality
   - Toggle feature flags or set local overrides

## Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (used by the workspace)
- **LaunchDarkly Dev Server** (optional): Only required for Dev Server Mode testing

## Configuration

The demo allows you to test different configurations:

- **Mode Selection**: Switch between Dev Server Mode and SDK Mode
- **Position**: Test toolbar positioning on left or right side
- **Dev Server URL**: Connect to different LaunchDarkly environments (Dev Server Mode)
- **Project Key**: Test auto-detection vs explicit project selection (Dev Server Mode)
- **Flag Override Plugin**: Enable/disable override functionality (SDK Mode)
- **Event Plugin**: Enable/disable event interception and monitoring (SDK Mode)

## Development

This demo is part of a pnpm monorepo workspace and automatically uses the local version of the LaunchDarkly Toolbar from `packages/toolbar/`. Any changes to the toolbar library will be reflected after rebuilding the toolbar package.

## Troubleshooting

### Dev Server Mode Issues

1. **Toolbar not appearing**: Check if the dev server URL is correct and accessible
2. **Connection issues**: Verify your LaunchDarkly dev server is running with CORS enabled
3. **No flags showing**: Ensure the project key is correct and flags exist in the environment

### SDK Mode Issues

1. **No Overrides tab**: Make sure the flag override plugin is enabled in the demo configuration
2. **No Events tab**: Make sure the event interception plugin is enabled in the demo configuration
3. **Overrides not working**: Check the browser console for plugin errors
4. **Events not showing**: Verify the event plugin is properly configured and LaunchDarkly events are being generated

### General Issues

1. **Build errors**: Make sure to run `pnpm build` from the root directory first
2. **Missing styles**: Ensure CSS imports are working properly
3. **Mode switching**: Refresh the page after changing between modes in the demo

## Tech Stack

- **Vite**: Build tool and dev server
- **React 19**: UI framework
- **TypeScript**: Type safety
- **LaunchDarkly Toolbar**: Local workspace package
