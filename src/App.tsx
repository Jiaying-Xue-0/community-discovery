import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DiscoveryPage from './views/DiscoveryPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/discover" element={<DiscoveryPage />} />
        <Route path="/" element={<Navigate to="/discover" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 