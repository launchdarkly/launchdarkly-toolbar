import { useState } from 'react';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

import './App.css';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { flagOverridePlugin } from './plugins';

export function AppWrapper() {
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [devServerUrl, setDevServerUrl] = useState('');
  const [projectKey, setProjectKey] = useState('');

  const ldClient = useLDClient();

  const allFlags = ldClient?.allFlags() || {};

  const formatValue = (value: unknown): string => {
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number') return value.toString();
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return JSON.stringify(value);
  };

  const getValueType = (value: unknown): string => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    return 'object';
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>LaunchDarkly Toolbar Demo</h1>
          <p>This demo showcases the LaunchDarkly Toolbar component with different configurations.</p>
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
            <div className="flags-display">
              <h3>Current Flags ({Object.keys(allFlags).length})</h3>
              <p>
                These are all the flags currently available to this client. Use the toolbar to override values and see
                real-time updates!
              </p>
              {Object.keys(allFlags).length === 0 ? (
                <div className="no-flags">
                  <p>No flags available. Make sure your LaunchDarkly client is properly initialized.</p>
                </div>
              ) : (
                <div className="flags-grid">
                  {Object.entries(allFlags)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([flagKey, flagValue]) => (
                      <div key={flagKey} className="flag-item">
                        <div className="flag-header">
                          <span className="flag-key">{flagKey}</span>
                          <span className={`flag-type ${getValueType(flagValue)}`}>{getValueType(flagValue)}</span>
                        </div>
                        <div className={`flag-value ${getValueType(flagValue)}`}>{formatValue(flagValue)}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* The LaunchDarkly Toolbar */}
      <LaunchDarklyToolbar
        position={position}
        projectKey={projectKey || undefined}
        devServerUrl={devServerUrl || undefined}
        flagOverridePlugin={flagOverridePlugin}
      />
    </div>
  );
}
