# @launchdarkly/toolbar-core

Internal react application that comprises the LaunchDarkly Developer Toolbar. This package, while not outwardly facing,
is compiled into a minified javascript file and in turn used by `@launchdarkly/toolbar` so it can provide a very lightweight
means of instantiating the toolbar for developers. This minified javascript file will also, in turn, allow for developers
using other frameworks to be able to use the toolbar, no React necessary!

This package is intended to be internal, though built version will ultimately be hosted as a versioned CDN asset. This will
allow both the `@launchdarkly/toolbar` package, as well as other developers to install and set up the toolbar with ease,
regardless of their frontend tech stack.

### Set up

From the root of the repository, run:

```bash
pnpm install
```

### Scripts

This package has the following scripts to aid with development, testing, etc.

```bash
# build the toolbar + its dependencies into a minified javascript file
pnpm build

# build the toolbar + its dependencies in watch mode
pnpm dev

# run unit tests
pnpm test

# run storybook
pnpm storybook

# build storybook
pnpm build:storybook
```