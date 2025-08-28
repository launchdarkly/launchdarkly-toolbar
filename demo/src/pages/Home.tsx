import { Link } from 'react-router-dom';
import '../App.css';

export function Home() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>LaunchDarkly Toolbar Demo</h1>
          <p>Choose which version of the toolbar to test:</p>
        </header>

        <main className="main">
          <div className="version-selector">
            <div className="version-card">
              <h2>CI Version</h2>
              <p>Uses the built/published version of the toolbar package.</p>
              <p>This is what would be used in production or CI environments.</p>
              <Link to="/ci" className="version-link">
                Test CI Version →
              </Link>
            </div>

            <div className="version-card">
              <h2>Local Version (Default)</h2>
              <p>Uses the local workspace version of the toolbar directly from source.</p>
              <p>This is useful for development and testing changes before building.</p>
              <Link to="/" className="version-link">
                Test Local Version →
              </Link>
            </div>
          </div>

          <div className="instructions">
            <h3>Instructions</h3>
            <ol>
              <li>Choose either the CI or Local version to test</li>
              <li>Make sure you have a LaunchDarkly dev server running on port 8765</li>
              <li>Each version will show which source it's using in the header</li>
              <li>Both versions have the same functionality but different package sources</li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
