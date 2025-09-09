# E2E Testing Setup

This directory contains end-to-end tests for the LaunchDarkly Toolbar that can test both local development builds and CI/production builds across different integration modes.

## Test Architecture

### Environment Modes

- **Local**: Tests the local workspace version (from `../src`) using `pnpm demo:dev`
- **CI**: Tests the built/published version (from `../dist`) using `pnpm demo:build` + `http-server`

### Integration Modes

- **Dev-server mode**: Tests toolbar functionality with LaunchDarkly dev server integration
- **SDK mode**: Tests toolbar functionality with direct LaunchDarkly React SDK integration

## Running Tests

### Local Development Testing

```bash
# Test local build (tests both dev-server and SDK modes)
pnpm test:e2e:local

# Test local build with UI mode
pnpm test:e2e:local:ui
```

### CI/Production Build Testing

```bash
# Test CI build (tests both dev-server and SDK modes)
pnpm test:e2e:ci

# Test CI build with UI mode
pnpm test:e2e:ci:ui
```

## How It Works

### 1. Environment Configuration

The `config/environment.ts` file determines which demo routes to load based on `TEST_ENV`:

- `local`: Routes to `/local/dev-server` and `/local/sdk`
- `ci`: Routes to `/ci/dev-server` and `/ci/sdk`

### 2. Demo App Architecture

**Routes:**

- `/`: Home page with version selector
- `/ci/dev-server`: CI build with dev-server mode
- `/ci/sdk`: CI build with SDK mode
- `/local/dev-server`: Local build with dev-server mode
- `/local/sdk`: Local build with SDK mode

**Components:**

- `DevServerMode.tsx`: Dedicated page for dev-server integration testing
- `SDKMode.tsx`: Dedicated page for SDK integration testing
- `AppWrapper.tsx`: Shared layout and configuration UI

### 3. Test Structure

The single test file `toolbar.spec.ts` uses nested describe blocks:

```typescript
describe('LaunchDarkly Toolbar - {environment}', () => {
  describe('Dev Server Mode', () => {
    // Tests toolbar with dev server integration
  });

  describe('SDK Mode', () => {
    // Tests toolbar with React SDK integration
  });
});
```

### 4. Build Process

- **Local**: Uses `pnpm demo:dev` (Vite development server)
- **CI**: Uses `pnpm demo:build && http-server` (static production build)

## Test Coverage

### Dev Server Mode Tests

- ✅ Toolbar initialization and visibility
- ✅ Tab navigation (Overview, Flags, Metrics)
- ✅ Flag search and filtering
- ✅ Dev server integration and flag loading
- ✅ Position controls (top/bottom)

### SDK Mode Tests

- ✅ Basic page loading and toolbar presence
- ✅ SDK integration initialization
- 🔄 Flag override functionality (in development)
- 🔄 Real-time flag updates (in development)

## Development Workflow

1. **Local Development**: Use `pnpm test:e2e:local` to test your changes against the workspace source
2. **Pre-commit**: Run `pnpm test:e2e:ci` to test the built/published version
3. **CI Pipeline**: Automatically runs `pnpm test:e2e:ci` on push to verify production builds

## Configuration

### Dev Server Mode

Tests automatically configure:

- Dev server URL: `http://localhost:8765`
- Project key: `test-project`
- Mock API responses for flags and metrics

### SDK Mode

Tests automatically configure:

- LaunchDarkly client with test credentials
- Debug override plugin for flag manipulation
- Real SDK initialization and flag evaluation

## Troubleshooting

### Common Issues

- **Route not found**: Ensure demo app routes match `config/environment.ts` paths
- **Build mismatch**: Run `pnpm build && pnpm demo:build` to sync builds
- **Dev server conflicts**: Stop local dev servers when testing CI builds
- **Timeout errors**: Increase timeout for slower CI environments

### Debug Commands

```bash
# Check current build status
pnpm dev:status

# Rebuild everything
pnpm build && pnpm demo:build

# Test specific mode with verbose output
TEST_ENV=local playwright test --config=./e2e/playwright.config.ts --reporter=list
```
