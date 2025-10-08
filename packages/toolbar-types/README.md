# @launchdarkly/toolbar-types

Internal package part of the launchdarkly-toolbar-monorepo that houses common types used across other packages in this
repository. This package is not intended to be published, though any types needed for configuration of the toolbar
will be available via the `@launchdarkly/toolbar`.

Currently, this package utilizes barrel exporting to have a single entrypoint. If this ever becomes unruly, or there
is a desire to slim down the number of files imported, this should be refactored to instead have multiple entrypoints such as:
* @launchdarkly/toolbar-types/config
* @launchdarkly/toolbar-types/events
* etc.

### Set up

From the root of the repository, run:

```bash
# Install dependencies
pnpm install
```

### Scripts

This package has the following scripts to aid with development:

```bash
# build the @launchdarkly/toolbar-types package
pnpm build

# build the @launchdarkly/toolbar-types package in watch mode
pnpm dev

# lint the @launchdarkly/toolbar-types package (via oxlint)
pnpm lint

```
