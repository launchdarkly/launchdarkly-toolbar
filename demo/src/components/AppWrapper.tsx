import { useState } from 'react';
import type { ReactNode } from 'react';
import '../App.css';

interface ToolbarConfig {
  position: 'left' | 'right';
  devServerUrl: string;
  projectKey?: string;
}

interface AppWrapperProps {
  children: (config: ToolbarConfig) => ReactNode;
  version: 'CI' | 'Local';
}

export function AppWrapper({ children, version }: AppWrapperProps) {
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [devServerUrl, setDevServerUrl] = useState('http://localhost:8765');
  const [projectKey, setProjectKey] = useState('');

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>LaunchDarkly Toolbar Demo ({version})</h1>
          <p>
            This demo showcases the LaunchDarkly Toolbar component with different configurations.
            {version === 'CI' && ' Using the built/published version.'}
            {version === 'Local' && ' Using the local workspace version.'}
          </p>
        </header>

        <main className="main">
          <div className="config-panel">
            <h2>Configuration</h2>
            <div className="config-group">
              <label htmlFor="position">Position:</label>
              <select id="position" value={position} onChange={(e) => setPosition(e.target.value as 'left' | 'right')}>
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>

            <div className="config-group">
              <label htmlFor="devServerUrl">Dev Server URL:</label>
              <input
                id="devServerUrl"
                type="text"
                value={devServerUrl}
                onChange={(e) => setDevServerUrl(e.target.value)}
                placeholder="http://localhost:8765"
              />
            </div>

            <div className="config-group">
              <label htmlFor="projectKey">Project Key (optional):</label>
              <input
                id="projectKey"
                type="text"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
                placeholder="Leave empty for auto-detection"
              />
            </div>
          </div>

          <div className="demo-content">
            <h2>Demo Content</h2>
            <p>
              The LaunchDarkly Toolbar should appear in the bottom-{position} corner of the screen. It provides a
              developer-friendly interface to interact with feature flags.
            </p>

            <div className="feature-demo">
              <h3>Features</h3>
              <ul>
                <li>✅ Animated toolbar that expands from a circle</li>
                <li>✅ Flag management and toggling</li>
                <li>✅ Event monitoring</li>
                <li>✅ Settings configuration</li>
                <li>✅ Search functionality</li>
                <li>✅ Responsive design</li>
                <li>✅ Keyboard navigation</li>
              </ul>
            </div>

            <div className="instructions">
              <h3>Instructions</h3>
              <ol>
                <li>Make sure you have a LaunchDarkly dev server running on the configured URL</li>
                <li>Hover over the circular toolbar in the bottom corner to expand it</li>
                <li>Explore the different tabs: Flags, Events, and Settings</li>
                <li>Use the search functionality to find specific flags</li>
                <li>Toggle feature flags and see real-time updates</li>
              </ol>
            </div>

            <div className="status">
              <h3>Connection Status</h3>
              <p>
                The toolbar will automatically connect to your LaunchDarkly dev server. Check the connection status
                indicator in the toolbar header.
              </p>
            </div>

            <div className="version-info">
              <h3>Version Info</h3>
              <p>
                <strong>Current Version:</strong> {version}
              </p>
              <p>
                <strong>Source:</strong> {version === 'CI' ? 'Built/Published Package' : 'Local Workspace'}
              </p>
              <div className="route-links">
                <a href="/">Local Version (Default)</a> | <a href="/ci">CI Version</a> | <a href="/home">Home</a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Render the toolbar with the current config */}
      {children({ position, devServerUrl, projectKey: projectKey || undefined })}
    </div>
  );
}
