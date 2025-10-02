# LaunchDarkly Toolbar Demo - Next.js

This is a Next.js demo application showcasing the LaunchDarkly Toolbar component. It provides an interactive environment to test and explore all the features of the toolbar using Next.js App Router.

## Features Demonstrated

- ✅ **Dual Mode Operation** (Dev Server Mode + SDK Mode)
- ✅ **Animated toolbar** that expands from a circle
- ✅ **Position configuration** (top-left/top-right/bottom-left/bottom-right)
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
- ✅ **Next.js App Router** support
- ✅ **Server-side rendering** compatibility

## Getting Started

### From the root project directory:

1. **Start the Next.js demo:**

   ```bash
   pnpm demo:nextjs
   ```

   This will build the toolbar library and start the Next.js demo development server.

2. **Development mode** (if you're actively developing the toolbar):

   ```bash
   # Terminal 1: Watch and rebuild the toolbar
   pnpm dev

   # Terminal 2: Run the Next.js demo
   pnpm demo:nextjs
   ```

### From the demo-nextjs directory:

1. **Install dependencies** (if not already done):

   ```bash
   cd packages/demo-nextjs
   pnpm install
   ```

2. **Start the dev server:**
   ```bash
   pnpm dev
   ```

## Environment Configuration

Create a `.env.local` file in the `packages/demo-nextjs` directory with your LaunchDarkly configuration:

```env
# LaunchDarkly Configuration
NEXT_PUBLIC_LD_CLIENT_SIDE_ID=your-client-side-id-here
NEXT_PUBLIC_LD_BASE_URL=https://clientsdk.launchdarkly.com
NEXT_PUBLIC_LD_STREAM_URL=https://clientstream.launchdarkly.com
NEXT_PUBLIC_LD_EVENTS_URL=https://events.launchdarkly.com

# Demo Configuration
NEXT_PUBLIC_USE_MOCK_FLAGS=false
```

## Using the Demo

1. **Configure the toolbar** using the configuration panel on the left:
   - **Position**: Choose a corner (top-left, top-right, bottom-left, bottom-right)
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
- **Position**: Test toolbar positioning in any corner
- **Dev Server URL**: Connect to different LaunchDarkly environments (Dev Server Mode)
- **Project Key**: Test auto-detection vs explicit project selection (Dev Server Mode)
- **Flag Override Plugin**: Enable/disable override functionality (SDK Mode)
- **Event Plugin**: Enable/disable event interception and monitoring (SDK Mode)

## Next.js Specific Features

This demo showcases how the LaunchDarkly Toolbar works with Next.js:

- **App Router**: Uses the new Next.js 13+ App Router
- **Client Components**: Properly handles client-side only components
- **SSR Compatibility**: Ensures the toolbar works with server-side rendering
- **Environment Variables**: Uses Next.js environment variable conventions
- **TypeScript**: Full TypeScript support with Next.js

## Development

This demo is part of a pnpm monorepo workspace and automatically uses the local version of the LaunchDarkly Toolbar from `packages/toolbar/`. Any changes to the toolbar library will be reflected after rebuilding the toolbar package.

## Troubleshooting

### Dev Server Mode Issues

1. **Toolbar not appearing**: Check if the dev server URL is correct and accessible
2. **Connection errors**: Ensure the LaunchDarkly dev server is running on the specified port
3. **CORS issues**: Make sure your dev server allows requests from the demo app origin

### SDK Mode Issues

1. **No flags loading**: Check your `NEXT_PUBLIC_LD_CLIENT_SIDE_ID` environment variable
2. **Network errors**: Verify your LaunchDarkly URLs in the environment configuration
3. **Plugin not working**: Ensure plugins are properly initialized and passed to the toolbar

### Next.js Specific Issues

1. **Hydration errors**: The toolbar uses client-side only components, ensure proper `'use client'` directives
2. **Environment variables not loading**: Make sure variables are prefixed with `NEXT_PUBLIC_`
3. **Build errors**: Check that all imports are properly resolved and TypeScript types are correct

## Mock Mode

For testing and demonstration purposes, you can enable mock mode by setting:

```env
NEXT_PUBLIC_USE_MOCK_FLAGS=true
```

This will use MSW (Mock Service Worker) to provide fake LaunchDarkly responses, ensuring a consistent demo experience.
