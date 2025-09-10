import type { ReactNode } from 'react';
import './App.css';
import { useLDClient } from 'launchdarkly-react-client-sdk';

interface AppWrapperProps {
  children: ReactNode;
  mode: 'dev-server' | 'sdk';
  position: 'left' | 'right';
  onPositionChange: (position: 'left' | 'right') => void;
}

export function AppWrapper({ children, mode, position, onPositionChange }: AppWrapperProps) {
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
          <h1>LaunchDarkly Toolbar Demo ({mode.replace('-', ' ')} mode)</h1>
          <p>
            This demo showcases the LaunchDarkly Toolbar component with different configurations.
            {mode === 'dev-server' && ' Testing with LaunchDarkly dev server integration.'}
            {mode === 'sdk' && ' Testing with direct LaunchDarkly React SDK integration.'}
          </p>
        </header>

        <main className="main">
          <div className="config-panel">
            <h2>Configuration</h2>

            <div className="config-group">
              <label htmlFor="position">Position:</label>
              <select
                id="position"
                value={position}
                onChange={(e) => onPositionChange(e.target.value as 'left' | 'right')}
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>

            {children}
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
    </div>
  );
}
