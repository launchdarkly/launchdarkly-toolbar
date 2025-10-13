# Contributing to LaunchDarkly Toolbar

Thank you for your interest in contributing to the LaunchDarkly Toolbar! This guide will help you get set up and understand our development workflow.

## Table of Contents

- [Development Setup](#development-setup)
- [Toolbar Integration Modes](#toolbar-integration-modes)
- [Development Workflow](#development-workflow)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Building](#building)
- [Publishing](#publishing)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)

## Development Setup

### Prerequisites

- **Node.js** 18+ and **pnpm** 10+

### Initial Setup

1. **Fork and clone the repository:**

```bash
git clone https://github.com/your-username/launchdarkly-toolbar.git
cd launchdarkly-toolbar
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Build the project:**

```bash
pnpm build
```

4. **Verify everything works:**

```bash
pnpm test
pnpm demo
```

## Demo Application

This repository contains a Demo React application that is configured to use the LaunchDarkly Developer Toolbar to provide
an easy and intuitive way to test local changes to the Developer Toolbar within the context of a simple example web
application. To set up the Demo application + Developer Toolbar to use one of your LaunchDarkly projects, copy
the values in `.env.example`, and replace `VITE_LD_CLIENT_SIDE_ID` with the LaunchDarkly Client-Side ID of the
project/environment you would like to test against. The other values in `env.example` are most likely fine as-is.

## Toolbar Integration Modes

The LaunchDarkly Toolbar supports two integration modes:

- **SDK Mode** (recommended): Integrates directly with your LaunchDarkly React SDK for local flag overrides and testing
- **Dev Server Mode**: Connects to a LaunchDarkly CLI dev server for flag browsing and real-time updates

For Dev Server Mode setup instructions, see [DEV_SERVER_SETUP.md](docs/DEV_SERVER_SETUP.md).

## Development Workflow

### Workspace Setup

This project uses **pnpm workspaces** to manage packages in a monorepo structure:

- **Root** - Monorepo orchestrator (private, never published)
- **packages/toolbar/** - The main toolbar library package (published to npm)
- **packages/demo/** - Demo application for testing and development

### Available Scripts

| Command                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `pnpm build`             | Build the toolbar library for production                      |
| `pnpm demo`              | Build toolbar and run the demo application                    |
| `pnpm demo:mock`         | Run demo application with mock flags enabled                  |
| `pnpm demo:build`        | Build both toolbar and demo for production                    |
| `pnpm demo:build:mock`   | Build demo for production with mock flags enabled             |
| `pnpm dev`               | Build toolbar in watch mode for development                   |
| `pnpm dev:link`          | Link local SDKs and set pnpm overrides (advanced)             |
| `pnpm dev:status`        | Check health of repos, links, ports, tools (advanced)         |
| `pnpm dev:unlink`        | Restore registry versions when done (advanced)                |
| `pnpm dev:watch`         | Start watch + demo (advanced)                                 |
| `pnpm format`            | Format code with Prettier                                     |
| `pnpm format:ci`         | Check code formatting in CI                                   |
| `pnpm lint`              | Run linter across all packages                                |
| `pnpm storybook`         | Run Storybook for component development                       |
| `pnpm build:storybook`   | Build Storybook for production                                |
| `pnpm test`              | Run unit tests for toolbar                                    |
| `pnpm test:e2e:ci`       | Run E2E tests against the packaged version                    |
| `pnpm test:e2e:ci:ui`    | Run E2E tests with Playwright UI against the packaged version |
| `pnpm test:e2e:local`    | Run E2E tests against the local version                       |
| `pnpm test:e2e:local:ui` | Run E2E tests with Playwright UI against the local version    |

## Running the Project

### Development Mode

1. **Start the build in watch mode:**

```bash
pnpm dev
```

2. **In a separate terminal, run the demo:**

```bash
pnpm demo
```

3. **Open your browser to** `http://localhost:5173`

### Component Development with Storybook

```bash
pnpm storybook
```

Open `http://localhost:6006` to view and develop components in isolation.

### Mock Mode Development

For development without a real LaunchDarkly connection:

```bash
# Run demo with mock flags
pnpm demo:mock

# Build demo with mock flags for production
pnpm demo:build:mock
```

This is useful when you want to test the toolbar functionality without setting up a LaunchDarkly environment or dev server.

### Cross-SDK Development (Advanced)

Use this only when developing the toolbar alongside local SDK changes (`js-sdk-common` and `js-client-sdk`). For normal toolbar work, prefer the demo app directly.

When to use:

- You are editing `js-sdk-common` and/or `js-client-sdk` and want live updates in the demo.

Commands:

```bash
# 1) Link local SDKs and set pnpm overrides in this repo
pnpm dev:link

# 2) Check health (repos, links, ports, tools)
pnpm dev:status

# 3) Start watch + demo
pnpm dev:watch

# 4) Restore registry versions when done
pnpm dev:unlink
```

Configuration (optional):

- Flags: `--js-common <dir>`, `--js-client <dir>`, `-w|--workspace <dir>`
- Env vars: `LD_JS_COMMON_DIR`, `LD_JS_CLIENT_DIR`, `LD_WORKSPACE_DIR`
- Precedence: flags > env > defaults

### Testing Your Changes

The demo application is the best way to test your changes:

1. Make changes to the source code
2. The build watch mode will automatically rebuild
3. Refresh the demo page to see your changes
4. Use the demo's configuration panel to test different scenarios
5. Test both **SDK Mode** and **Dev Server Mode** to ensure compatibility

**Testing Both Modes:**

- **SDK Mode**: Test flag overrides, event interception, and real-time updates
- **Dev Server Mode**: Test dev server connection, flag browsing, and CLI integration

## Testing

### Unit Tests

We use **Vitest** for unit testing:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

**Test files location:** `src/tests/` or adjacent to components (`*.test.tsx`)

### End-to-End Tests

We use **Playwright** for E2E testing with different environments and integration modes:

**Test Environments:**

- **CI environment** (`test:e2e:ci`): Uses the packaged version. Run `pnpm build` first to ensure you have the latest changes
- **Local environment** (`test:e2e:local`): Uses the local version, no build step needed

**Integration Modes Tested:**

- **SDK Mode**: Tests toolbar with React SDK integration, flag overrides, and event interception
- **Dev Server Mode**: Tests toolbar with LaunchDarkly CLI dev server integration

```bash
# Run E2E tests against the packaged version
pnpm test:e2e:ci

# Run with UI mode for debugging against the packaged version
pnpm test:e2e:ci:ui

# Run E2E tests against the local version
pnpm test:e2e:local

# Run with UI mode for debugging against the local version
pnpm test:e2e:local:ui

```

**E2E test files location:** `e2e/tests/`
**E2E config location:** `e2e/config/environment.ts`
**Detailed E2E documentation:** See [e2e/README.md](e2e/README.md) for comprehensive testing setup and architecture details

### Writing Tests

- **Unit tests** should focus on component behavior and logic
- **E2E tests** should test complete user workflows
- Use React Testing Library for component testing
- Follow the existing test patterns and naming conventions

## Building

### Development Build

```bash
pnpm build
```

This creates the `packages/toolbar/dist/` folder with:

- **JavaScript bundle** (`packages/toolbar/dist/js/index.js`)
- **TypeScript declarations** (`packages/toolbar/dist/index.d.ts`)
- **Static assets** (`packages/toolbar/dist/static/`) - Fonts and other assets
- **Plugin bundles** (`packages/toolbar/dist/js/plugins/`)

## Publishing

### Automated Publishing

Publishing is handled automatically via GitHub Actions and release-please. The toolbar package is published from `packages/toolbar/` which contains only clean library code (no demo scripts).

**Manual publishing (if needed):**

```bash
# Build and publish the toolbar package
pnpm --filter @launchdarkly/toolbar build
pnpm --filter @launchdarkly/toolbar publish
```

## Code Standards

### React Patterns

- **Functional components** with hooks
- **Named exports** preferred over default exports
- **Custom hooks** for reusable logic
- **Context** for shared state (see `SearchProvider`, `DevServerProvider`)

### Styling

- **Vanilla Extract** for component-specific styles (zero-runtime CSS-in-JS)
- **Type-safe styling** with TypeScript integration
- **CSS custom properties** for theming
- **Responsive design** considerations

### File Organization

- **PascalCase** for component files (`LaunchDarklyToolbar.tsx`)
- **camelCase** for utility files (`useToolbarState.ts`)
- **Component directories** include: main file, styles, tests, index
- **Barrel exports** from `index.ts` files

### Code Quality

```bash
# Linting
pnpm lint

# Formatting
pnpm format
```

We use:

- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## Pull Request Process

### Before Submitting

1. **Run all checks locally:**

```bash
pnpm build           # Ensure builds successfully
pnpm test            # Run unit tests
pnpm test:e2e:local  # Run E2E tests
pnpm lint            # Check for linting issues
```

2. **Test your changes:**
   - Run the demo application
   - Test different toolbar configurations
   - Verify responsive behavior
   - Check accessibility (keyboard navigation)

3. **Update documentation:**
   - Update README.md if adding new features
   - Add/update component stories for Storybook
   - Update TypeScript types if needed

### Pull Request Guidelines

1. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Make focused commits:**
   - Each commit should represent a logical change
   - Write clear commit messages
   - Keep changes focused and atomic

3. **Update tests:**
   - Add tests for new functionality
   - Update existing tests if behavior changes
   - Ensure all tests pass

4. **Write a clear PR description:**
   - Describe what the change does and why
   - Include screenshots for UI changes
   - Link to any related issues

---

Thank you for contributing to LaunchDarkly Toolbar! 🚀
