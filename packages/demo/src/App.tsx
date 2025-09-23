import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { Home } from './pages/Home';
import { DevServerMode } from './pages/DevServerMode';
import { SDKMode } from './pages/SDKMode';
import { useLaunchDarklyProvider } from './hooks/useLaunchDarklyProvider';
import { LoadingScreen } from './components/LoadingScreen';
import { MockModeIndicator } from './components/MockModeIndicator';

function App() {
  const { LDProvider, isLoading, isUsingMocks } = useLaunchDarklyProvider();

  if (!LDProvider) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <LDProvider>
      {isUsingMocks && <MockModeIndicator />}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dev-server" element={<DevServerMode />} />
          <Route path="/sdk" element={<SDKMode />} />
        </Routes>
      </Router>
    </LDProvider>
  );
}

export default App;
