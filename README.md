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
pnpm --filter demo dev

# Run toolbar in watch mode
pnpm --filter toolbar dev
```

### Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

### Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Run linting
- `pnpm storybook` - Start Storybook

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution instructions.

## License

Apache-2.0
