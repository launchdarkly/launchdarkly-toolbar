# LaunchDarkly toolbar

The LaunchDarkly toolbar is a React component that provides a developer-friendly mechanism for interacting with LaunchDarkly during development.

## Packages

This is a monorepo containing the following packages:

- **[@launchdarkly/toolbar](./packages/toolbar/)**: The main toolbar component package
- **[demo](./packages/demo/)**: Demo application showcasing the toolbar

## Quickstart

For usage instructions and API documentation, read the [toolbar package README](./packages/toolbar/README.md) and the [LaunchDarkly documentation](https://launchdarkly.com/docs/home/getting-started/dev-toolbar).

## Development

### Prerequisites

Before you set up the toolbar, you must have the following prerequisites:

- Node.js 18+
- pnpm

### Set up

To set up the toolbar:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run toolbar and toolbar-core in watch mode
pnpm dev

# Run mock-server (for hosting compiled toolbar code locally)
pnpm dev:server

# Run demo in development mode
pnpm demo
```

### Testing

To test the toolbar:

```bash
# Run unit tests
pnpm test

# Run e2e tests (local)
pnpm test:e2e:local

# Run e2e tests (CI)
pnpm test:e2e:ci
```

### Scripts

The following scripts are available:

- `pnpm dev`: Build toolbar in watch mode
- `pnpm demo`: Run demo application
- `pnpm demo:mock`: Run demo with mock flags
- `pnpm build`: Build toolbar for production
- `pnpm test`: Run unit tests
- `pnpm test:e2e:local`; Run E2E tests (local)
- `pnpm test:e2e:ci`: Run E2E tests (CI)
- `pnpm lint`: Run linting
- `pnpm format`: Format code with Prettier
- `pnpm storybook`: Start Storybook

## Contributing

To learn about development guidelines and contribution instructions, read [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Apache-2.0
