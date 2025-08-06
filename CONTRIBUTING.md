# Contributing to LaunchDarkly Toolbar

Thank you for your interest in contributing to the LaunchDarkly Toolbar! This guide will help you get set up and understand our development workflow.

## Table of Contents

- [Development Setup](#development-setup)
- [LaunchDarkly Dev Server Setup](#launchdarkly-dev-server-setup)
- [Development Workflow](#development-workflow)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Building](#building)
- [Publishing](#publishing)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)

## Development Setup

### Prerequisites

- **Node.js** 18+ and **pnpm** 9+

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

## LaunchDarkly Dev Server Setup

The LaunchDarkly Toolbar requires a LaunchDarkly CLI dev server to be running. For detailed setup instructions, see [DEV_SERVER_SETUP.md](docs/DEV_SERVER_SETUP.md).


## Development Workflow

### Workspace Setup

This project uses **pnpm workspaces** to manage the main package and demo application:

- **Root workspace** - The main toolbar package
- **Demo workspace** - Demo application for testing and development

### Available Scripts

| Command                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `pnpm build`             | Build the library for production                              |
| `pnpm dev`               | Build in watch mode for development                           |
| `pnpm demo`              | Build and run the demo application                            |
| `pnpm demo:dev`          | Run demo in development mode (requires separate build)        |
| `pnpm test`              | Run unit tests                                                |
| `pnpm test:e2e:ci`       | Run E2E tests against the packaged version                    |
| `pnpm test:e2e:ci:ui`    | Run E2E tests with Playwright UI against the packaged version |
| `pnpm test:e2e:local`    | Run E2E tests against the local version                       |
| `pnpm test:e2e:local:ui` | Run E2E tests with Playwright UI against the local version    |
| `pnpm storybook`         | Run Storybook for component development                       |
| `pnpm lint`              | Run linter                                                    |
| `pnpm format`            | Format code with Prettier                                     |

## Running the Project

### Development Mode

1. **Start the build in watch mode:**

```bash
pnpm dev
```

2. **In a separate terminal, run the demo:**

```bash
pnpm demo:dev
```

3. **Open your browser to** `http://localhost:5173`

### Component Development with Storybook

```bash
pnpm storybook
```

Open `http://localhost:6006` to view and develop components in isolation.

### Testing Your Changes

The demo application is the best way to test your changes:

1. Make changes to the source code
2. The build watch mode will automatically rebuild
3. Refresh the demo page to see your changes
4. Use the demo's configuration panel to test different scenarios

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

We use **Playwright** for E2E testing with different environments:

- **CI environment** (`test:e2e:ci`): Uses the packaged version. Run `pnpm build` first to ensure you have the latest changes
- **Local environment** (`test:e2e:local`): Uses the local version, no build step needed

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
**E2E config location:** `e2e/config/test-config.ts`

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

This creates the `dist/` folder with:

- **JavaScript bundle** (`dist/js/index.js`)
- **CSS bundle** (`dist/css/index.css`) - Generated from Vanilla Extract
- **TypeScript declarations** (`dist/index.d.ts`)
- **Static assets** (`dist/static/`) - Fonts and other assets

## Publishing

### Automated Publishing

```bash
pnpm publish
```

This command:

1. Builds the project (`pnpm build`)
2. Publishes to npm from the root directory

## Code Standards

### React Patterns

- **Functional components** with hooks
- **Named exports** preferred over default exports
- **Custom hooks** for reusable logic
- **Context** for shared state (see `SearchProvider`, `LaunchDarklyToolbarProvider`)

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
