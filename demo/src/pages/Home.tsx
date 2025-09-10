import { Link } from 'react-router-dom';
import '../App.css';

export function Home() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>LaunchDarkly Toolbar Demo</h1>
          <p>Choose which mode to test:</p>
        </header>

        <main className="main">
          <div className="version-selector">
            <div className="version-card">
              <h2>Dev Server Mode</h2>
              <p>Uses the LaunchDarkly dev server integration.</p>
              <p>Requires a LaunchDarkly dev server running on port 8765.</p>
              <div className="version-links">
                <Link to="/dev-server" className="version-link">
                  Try Dev Server Mode →
                </Link>
              </div>
            </div>

            <div className="version-card">
              <h2>SDK Mode</h2>
              <p>Uses the LaunchDarkly React SDK directly with flag override capabilities.</p>
              <p>No dev server configuration needed.</p>
              <div className="version-links">
                <Link to="/sdk" className="version-link">
                  Try SDK Mode →
                </Link>
              </div>
            </div>
          </div>

          <div className="instructions">
            <h3>Instructions</h3>
            <ol>
              <li>Choose the mode you want to test</li>
              <li>
                <strong>Dev Server Mode:</strong> Requires a LaunchDarkly dev server running on port 8765
              </li>
              <li>
                <strong>SDK Mode:</strong> Uses the LaunchDarkly React SDK directly with flag override capabilities
              </li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
