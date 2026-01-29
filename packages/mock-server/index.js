const fs = require('node:fs/promises');
const express = require('express');
const { watch } = require('chokidar');
const path = require('path');

const host = 'localhost';
const port = process.env.PORT ?? '5764';
const authPort = process.env.AUTH_PORT ?? '9090';

const app = express();
const authApp = express();

// Track connected clients for hot reload
let clients = [];
const toolbarPath = path.resolve(__dirname, '../toolbar/cdn');

// Watch for changes to toolbar files
const watcher = watch(toolbarPath, {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50,
  },
});

watcher.on('change', (filePath) => {
  const fileName = path.basename(filePath);
  console.log(`🔄 File changed: ${filePath} (${fileName})`);

  if (fileName.endsWith('.js')) {
    console.log(`🔄 Toolbar file changed: ${fileName}`);

    // Notify all connected clients
    clients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify({ type: 'reload', file: fileName })}\n\n`);
      } catch {
        // Client disconnected, ignore
      }
    });

    console.log(`📡 Notified ${clients.length} clients to reload`);
  }
});

watcher.on('add', (filePath) => {
  const fileName = path.basename(filePath);
  if (fileName.endsWith('.js')) {
    console.log(`➕ Toolbar file added: ${fileName}`);

    // Notify all connected clients
    clients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify({ type: 'reload', file: fileName })}\n\n`);
      } catch {
        // Client disconnected, ignore
      }
    });

    console.log(`📡 Notified ${clients.length} clients to reload`);
  }
});

watcher.on('error', (error) => {
  console.error('❌ File watcher error:', error);
});

watcher.on('ready', () => {
  console.log('👁️  File watcher ready and monitoring changes');
});

// Server-Sent Events endpoint for hot reload
app.get('/hot-reload', allowCORS, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Add client to list
  clients.push(res);
  console.log(`📱 Hot reload client connected. Total clients: ${clients.length}`);

  // Send initial connection message
  res.write('data: {"type": "connected"}\n\n');

  // Remove client when connection closes
  req.on('close', () => {
    clients = clients.filter((client) => client !== res);
    console.log(`📱 Hot reload client disconnected. Total clients: ${clients.length}`);
  });
});

function renderTemplate(filePath, options, callback) {
  fs.readFile(filePath, { encoding: 'utf8' })
    .then((content) => {
      const replacedContent = Object.entries(options)
        .filter(([token]) => token.startsWith('__') && token.endsWith('__'))
        .reduce((content, [token, value]) => content.replaceAll(token, JSON.stringify(value)), content);
      callback(null, replacedContent);
    })
    .catch((error) => {
      callback(error);
    });
}
app.engine('html', renderTemplate);
app.engine('js', renderTemplate);

function allowCORS(_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
  });
  next();
}

app.options('/toolbar.min.js', allowCORS, (_req, res) => {
  res.sendStatus(204);
});

app.get('/toolbar.min.js', allowCORS, (_req, res) => {
  res.set({ 'Content-Type': 'application/javascript' });
  res.render(`${__dirname}/../toolbar/cdn/toolbar.min.js`);
});

app.listen(port, host, () => {
  console.log(`🚀 Mock server running on http://${host}:${port}`);
  console.log(`📦 Serving toolbar files from: ${toolbarPath}`);
  console.log(`🔄 Hot reload endpoint: http://${host}:${port}/hot-reload`);
  console.log(`👀 Watching for changes in: ${toolbarPath}`);
});

// =============================================================================
// Auth Server - Mocks integrations.launchdarkly.com for e2e tests
// =============================================================================

authApp.use(express.json());

function authCORS(_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  next();
}

authApp.use(authCORS);

// Serve the authentication iframe page
authApp.get('/toolbar/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'toolbar-index.html'));
});

// Serve the authenticating page (shown during OAuth flow)
authApp.get('/toolbar/authenticating.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'toolbar-authenticating.html'));
});

// Health check endpoint
authApp.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mock-auth-server' });
});

authApp.listen(authPort, host, () => {
  console.log(`🔐 Mock auth server running on http://${host}:${authPort}`);
  console.log(`📄 Auth pages: http://${host}:${authPort}/toolbar/index.html`);
  console.log(`   Set VITE_LD_AUTH_URL=http://${host}:${authPort} in your demo app`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock server...');
  watcher.close();
  process.exit(0);
});
