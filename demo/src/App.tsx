import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CIVersion } from './pages/CIVersion';
import { LocalVersion } from './pages/LocalVersion';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LocalVersion />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ci" element={<CIVersion />} />
        <Route path="/local" element={<LocalVersion />} />
      </Routes>
    </Router>
  );
}

export default App;
