# LaunchDarkly Toolbar

A React component that provides a developer-friendly toolbar for interacting with LaunchDarkly during development.

## Packages

This is a monorepo containing the following packages:

- **[@launchdarkly/toolbar](./packages/toolbar/)** - The main toolbar component package
- **[demo](./packages/demo/)** - Demo application showcasing the toolbar

## Quick Start

For usage instructions and API documentation, see the [toolbar package README](./packages/toolbar/README.md).

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run demo in development mode
pnpm demo

# Run toolbar in watch mode
pnpm dev
```

### Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests (local)
pnpm test:e2e:local

# Run e2e tests (CI)
pnpm test:e2e:ci
```

### Scripts

- `pnpm dev` - Build toolbar in watch mode
- `pnpm demo` - Run demo application
- `pnpm demo:mock` - Run demo with mock flags
- `pnpm build` - Build toolbar for production
- `pnpm test` - Run unit tests
- `pnpm test:e2e:local` - Run E2E tests (local)
- `pnpm test:e2e:ci` - Run E2E tests (CI)
- `pnpm lint` - Run linting
- `pnpm format` - Format code with Prettier
- `pnpm storybook` - Start Storybook

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution instructions.

## License

Apache-2.0
