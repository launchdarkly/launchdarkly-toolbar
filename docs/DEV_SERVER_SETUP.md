# LaunchDarkly Dev Server Setup

The LaunchDarkly Toolbar **in Dev Server Mode** requires a LaunchDarkly CLI dev server to be running. Follow these steps to set it up:

> **Note:** This setup is only required for **Dev Server Mode**. If you're using the toolbar in **SDK Mode** (without providing `devServerUrl`), you don't need a dev server.

## 1. Install the LaunchDarkly CLI

Follow the official installation instructions at: [LaunchDarkly CLI installation guide](https://launchdarkly.com/docs/home/getting-started/ldcli#installation)

## 2. Configure the CLI

Set the required configuration for your LaunchDarkly instance.
To configure the dev server for Catamorphic, you'll need to use the following commands:

```bash
ldcli config --set dev-stream-uri https://clientstream.launchdarkly.com
ldcli config --set base-uri https://app.launchdarkly.com
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

The dev server will start on `http://localhost:8765` by default. The toolbar will automatically connect to this URL when you provide it as the `devServerUrl` prop.

If the dev-server is running on a different port, you'll need to specify the correct URL:

```tsx
<LaunchDarklyToolbar devServerUrl="http://localhost:3001" />
```

### Common Issues

- **CORS errors**: Ensure you're starting the dev server with `--cors-enabled true`
