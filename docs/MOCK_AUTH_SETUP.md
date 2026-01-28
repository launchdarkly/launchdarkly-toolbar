# Mock Auth Server Setup - Summary

This document summarizes the changes made to add mock authentication server capabilities to the LaunchDarkly Toolbar project.

## Overview

The mock-server package has been enhanced to act as an authentication server during e2e tests, replacing the need to connect to `integrations.launchdarkly.com`. This allows e2e tests to run without real LaunchDarkly credentials and provides faster, more reliable authentication for testing.

## What Was Built

### 1. Enhanced Mock Server (`packages/mock-server/index.js`)

**New Features:**

- Added a second Express server on port 9090 for authentication
- Serves authentication iframe pages required by the toolbar
- Handles OAuth flow simulation via postMessage
- Provides mock API responses for projects and flags

**Endpoints Added:**

- `GET /toolbar/index.html` - Main authentication iframe page
- `GET /toolbar/authenticating.html` - OAuth loading page
- `GET /health` - Health check endpoint

**PostMessage API:**

- Responds to `get-projects` requests with mock project list
- Responds to `get-flags` requests with mock flag data
- Responds to `get-flag` requests with detailed flag info
- Automatically sends `toolbar-authenticated` message for instant auth

### 2. Demo App Configuration (`packages/demo/src/pages/`)

**Updated both SDKMode.tsx and DevServerMode.tsx:**

Changed from:

```typescript
authUrl: import.meta.env.VITE_LD_AUTH_URL,
```

To:

```typescript
authUrl: import.meta.env.VITE_LD_AUTH_URL || 'http://localhost:9090',
```

This ensures the demo app **defaults to the mock auth server** (`http://localhost:9090`) when `VITE_LD_AUTH_URL` is not set, making it work automatically for both local development and e2e tests.

### 3. Playwright Configuration (`e2e/playwright.config.ts`)

**Updated to use array of web servers:**

```typescript
webServer: [
  {
    command: 'pnpm demo',
    url: 'http://localhost:5173',
  },
  {
    command: 'pnpm dev:server',
    url: 'http://localhost:9090/health',
  },
];
```

This starts both the demo app and mock auth server. No environment variables needed since the demo now defaults to `localhost:9090`.

### 4. Documentation

**Created:**

- `packages/mock-server/README.md` - Comprehensive mock server documentation
- `packages/mock-server/TESTING.md` - Testing guide with troubleshooting
- `E2E_AUTH_SETUP.md` - Summary of how authentication works

**Updated:**

- `e2e/README.md` - Added mock auth server section
- `README.md` - Updated mock-server package description

## Architecture

### Authentication Flow

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Toolbar    │         │ Auth Iframe  │         │ Mock Auth    │
│  Component   │         │ (port 5764)  │         │  Server      │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Load iframe         │                        │
       │───────────────────────>│ 2. GET /toolbar/       │
       │                        │    index.html          │
       │                        │───────────────────────>│
       │                        │                        │
       │                        │ 3. HTML + JS           │
       │                        │<───────────────────────│
       │                        │                        │
       │ 4. postMessage:        │                        │
       │    'authenticated'     │                        │
       │<───────────────────────│                        │
       │                        │                        │
```

### Components

1. **Toolbar CDN Server** (port 5764)
   - Serves toolbar bundle
   - Hot-reload via SSE
   - File watching

2. **Mock Auth Server** (port 9090)
   - Authentication pages
   - PostMessage API
   - Mock data generation

## Usage

### For E2E Tests (Automatic)

Simply run e2e tests as usual:

```bash
pnpm test:e2e:local
```

The Playwright config automatically:

- Starts the mock server (both CDN and auth)
- Sets the correct environment variable
- Configures the demo app to use the mock auth server

### For Local Development (Manual)

1. Start the mock server:

```bash
pnpm dev:server
```

2. Start the demo with the mock auth URL:

```bash
VITE_LD_AUTH_URL=http://localhost:9090 pnpm demo
```

3. Open the demo app and interact with the toolbar

### Configuration

**Environment Variables:**

- `PORT` - CDN server port (default: 5764)
- `AUTH_PORT` - Auth server port (default: 9090)
- `VITE_LD_AUTH_URL` - Auth server URL for demo app

**Example:**

```bash
AUTH_PORT=4000 pnpm dev:server
VITE_LD_AUTH_URL=http://localhost:4000 pnpm demo
```

## Benefits

### 1. No Real Credentials Required

- E2E tests run without LaunchDarkly account
- No API rate limits or quota concerns
- Faster test execution

### 2. Deterministic Testing

- Consistent mock data across test runs
- No network flakiness
- Predictable authentication flow

### 3. Offline Development

- Work without internet connection
- No dependency on external services
- Complete local development environment

### 4. Simplified CI/CD

- No secrets management in CI
- Faster pipeline execution
- More reliable test results

## Mock Data Provided

### Projects

```javascript
[
  { key: 'test-project', name: 'Test Project' },
  { key: 'demo-project', name: 'Demo Project' },
];
```

### Flags (per project)

```javascript
[
  {
    key: 'test-flag-1',
    name: 'Test Flag 1',
    kind: 'boolean',
    description: 'A test boolean flag',
  },
  {
    key: 'test-flag-2',
    name: 'Test Flag 2',
    kind: 'multivariate',
    description: 'A test multivariate flag',
  },
  {
    key: 'numeric-flag',
    name: 'Numeric Flag',
    kind: 'multivariate',
    description: 'A numeric flag',
  },
];
```

## Testing

### Verify Mock Server

```bash
# Start the server
pnpm dev:server

# Test health endpoint
curl http://localhost:9090/health
# Expected: {"status":"ok","service":"mock-auth-server"}

# Test auth page
curl http://localhost:9090/toolbar/index.html
# Expected: HTML page with authentication script
```

### Verify Integration

```bash
# Run a specific e2e test
pnpm test:e2e:local -- sdk-mode.spec.ts

# Run with UI mode for debugging
pnpm test:e2e:local:ui
```

## Troubleshooting

### Port Already in Use

If port 9090 is already in use:

```bash
# Use a different port
AUTH_PORT=9091 pnpm dev:server

# Update Playwright config
env: {
  VITE_LD_AUTH_URL: 'http://localhost:9091',
}
```

### Authentication Not Working

1. Check auth server is running: `curl http://localhost:9090/health`
2. Check browser console for postMessage errors
3. Verify iframe is loading from correct URL
4. Check for CORS issues in Network tab

### Tests Failing

1. Ensure both servers are running (ports 5764 and 9090)
2. Check Playwright webServer configuration
3. Review test output for specific errors
4. Check Playwright trace/video for visual debugging

## Future Enhancements

Potential improvements for the mock auth server:

1. **Configurable Mock Data**: Allow tests to customize mock responses
2. **Error Simulation**: Test error handling by simulating auth failures
3. **Delayed Responses**: Test loading states and timeouts
4. **Request Logging**: Better debugging with request/response logging
5. **Mock State Management**: Persist state across requests for testing

## Related Documentation

- [Mock Server README](./packages/mock-server/README.md)
- [Mock Server Testing Guide](./packages/mock-server/TESTING.md)
- [E2E Testing README](./e2e/README.md)
- [Toolbar Package README](./packages/toolbar/README.md)

## Questions?

If you encounter issues or have questions:

1. Check the troubleshooting sections in documentation
2. Review the test output and logs
3. Check browser console and network tabs
4. Review Playwright traces for visual debugging
