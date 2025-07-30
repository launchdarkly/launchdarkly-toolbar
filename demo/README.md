# LaunchDarkly Toolbar Demo

This is a demo application showcasing the LaunchDarkly Toolbar component. It provides an interactive environment to test and explore all the features of the toolbar.

## Features Demonstrated

- ✅ **Animated toolbar** that expands from a circle
- ✅ **Position configuration** (left/right)
- ✅ **Dev server connection** with configurable URL
- ✅ **Project key configuration** with auto-detection fallback
- ✅ **Flag management** and toggling
- ✅ **Event monitoring**
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
   pnpm demo:dev
   ```

### From the demo directory:

1. **Install dependencies** (if not already done):

   ```bash
   cd demo
   pnpm install
   ```

2. **Start the dev server:**
   ```bash
   pnpm dev
   ```

## Using the Demo

1. **Configure the toolbar** using the configuration panel on the left:
   - **Position**: Choose between left or right positioning
   - **Dev Server URL**: Set your LaunchDarkly dev server URL (default: http://localhost:8765)
   - **Project Key**: Optionally specify a project key (auto-detects if empty)

2. **Interact with the toolbar:**
   - Look for the circular toolbar in the bottom corner
   - Hover over it to expand the full interface
   - Explore the different tabs (Flags, Events, Settings)
   - Test the search functionality
   - Toggle feature flags to see real-time updates

## Prerequisites

- **LaunchDarkly Dev Server**: Make sure you have a LaunchDarkly development server running
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (used by the workspace)

## Configuration

The demo allows you to test different configurations:

- **Position**: Test toolbar positioning on left or right side
- **Dev Server URL**: Connect to different LaunchDarkly environments
- **Project Key**: Test auto-detection vs explicit project selection

## Development

This demo is part of a pnpm workspace and automatically uses the local version of the LaunchDarkly Toolbar. Any changes to the main toolbar library will be reflected after rebuilding.

## Troubleshooting

1. **Toolbar not appearing**: Check if the dev server URL is correct and accessible
2. **Connection issues**: Verify your LaunchDarkly dev server is running
3. **Build errors**: Make sure to run `pnpm build` from the root directory first
4. **Missing styles**: Ensure CSS imports are working properly

## Tech Stack

- **Vite**: Build tool and dev server
- **React 19**: UI framework
- **TypeScript**: Type safety
- **LaunchDarkly Toolbar**: Local workspace package
