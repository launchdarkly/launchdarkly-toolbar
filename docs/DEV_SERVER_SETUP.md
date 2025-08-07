# LaunchDarkly Dev Server Setup

The LaunchDarkly Toolbar requires a LaunchDarkly CLI dev server to be running. Follow these steps to set it up:

## 1. Install the LaunchDarkly CLI

Follow the official installation instructions at: [LaunchDarkly CLI installation guide](https://launchdarkly.com/docs/home/getting-started/ldcli#installation)

## 2. Configure the CLI

Set the required configuration for your LaunchDarkly instance.
To configure the dev server for Catamorphic, you'll need to use the following commands:

```bash
ldcli config --set dev-stream-uri https://stream.ld.catamorphic.com
ldcli config --set base-uri https://app.ld.catamorphic.com
```

## 3. Authenticate with LaunchDarkly

Follow the official authentication instructions at: [LaunchDarkly CLI authentication guide](https://launchdarkly.com/docs/home/getting-started/ldcli#authentication)

## 4. Add Projects to Dev Server

Add the projects you want to work with:

```bash
ldcli dev-server add-project --project {{project-name}} --source production
```

**Note:** Replace `{{project-name}}` with your actual LaunchDarkly project key.

## 5. Start the Dev Server

Start the dev server with CORS enabled:

```bash
ldcli dev-server start --project {{project-name}} --cors-enabled true
```

**Note:** Replace `{{project-name}}` with your actual LaunchDarkly project key.

The dev server will start on `http://localhost:8765` by default. The toolbar will automatically connect to this URL.
If the dev-server is running on a different port, you'll need to override the `devServerUrl` when instantiating the `LaunchDarklyToolbar` to establish a connection.


### Common Issues

- **CORS errors**: Ensure you're starting the dev server with `--cors-enabled true`
