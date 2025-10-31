import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { Home } from './pages/Home';
import { DevServerMode } from './pages/DevServerMode';
import { SDKMode } from './pages/SDKMode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dev-server" element={<DevServerMode />} />
        <Route path="/sdk" element={<SDKMode />} />
      </Routes>
    </Router>
  );
}

export default App;
