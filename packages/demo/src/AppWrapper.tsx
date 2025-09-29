import type { ReactNode } from 'react';
import './App.css';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import type { ToolbarPosition } from '@launchdarkly/toolbar';

interface AppWrapperProps {
  children: ReactNode;
  mode: 'dev-server' | 'sdk';
  position: ToolbarPosition;
  onPositionChange: (position: ToolbarPosition) => void;
}

export function AppWrapper({ children, mode, position, onPositionChange }: AppWrapperProps) {
  const ldClient = useLDClient();
  const allFlags = ldClient?.allFlags() || {};

  // Test functions to trigger different LaunchDarkly events
  const testFlagEvaluation = () => {
    if (!ldClient) {
      console.log('LD Client not available');
      return;
    }

    // This will trigger a feature flag evaluation event
    const flagKeys = Object.keys(allFlags);
    if (flagKeys.length > 0) {
      const testFlag = flagKeys[0];
      const value = ldClient.variation(testFlag, 'default-value');
      console.log(`🏁 Evaluated flag "${testFlag}": ${value}`);
    } else {
      // Create a test flag evaluation even if no flags exist
      const value = ldClient.variation('test-flag', false);
      console.log(`🏁 Evaluated test flag: ${value}`);
    }
  };

  const testUnknownFlagEvent = () => {
    if (!ldClient) {
      console.log('LD Client not available');
      return;
    }

    ldClient.variation('test-not-found-flag', false);
  };

  const testCustomEvent = () => {
    if (!ldClient) {
      console.log('LD Client not available');
      return;
    }

    // This will trigger a custom event
    ldClient.track(
      'test-custom-event',
      {
        testData: 'Hello from demo!',
        timestamp: new Date().toISOString(),
      },
      42,
    );
    console.log('📊 Sent custom event: test-custom-event');
  };

  const testIdentifyEvent = () => {
    if (!ldClient) {
      console.log('LD Client not available');
      return;
    }

    // This will trigger an identify event
    ldClient.identify({
      key: 'test-user-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
    });
    console.log('👤 Sent identify event');
  };

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
                onChange={(e) => onPositionChange(e.target.value as ToolbarPosition)}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            {children}
          </div>

          <div className="demo-content">
            <div className="event-testing">
              <h3>Event Hook Testing</h3>
              <p>Click these buttons to trigger different LaunchDarkly events and watch the console for hook logs:</p>
              <div className="test-buttons">
                <button onClick={testFlagEvaluation} className="test-button flag-button">
                  🏁 Test Flag Evaluation
                </button>
                <button onClick={testCustomEvent} className="test-button custom-button">
                  📊 Test Custom Event
                </button>
                <button onClick={testIdentifyEvent} className="test-button identify-button">
                  👤 Test Identify Event
                </button>
                <button onClick={testUnknownFlagEvent} className="test-button unknown-flag-button">
                  ❓ Test Unknown Flag Event
                </button>
              </div>
              <div className="console-hint">
                <strong>💡 Tip:</strong> Open your browser's developer console to see the event hook logs!
              </div>
            </div>

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
