import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Dashboard } from './pages/Dashboard';
import { CityDetail } from './pages/CityDetail';
import { Settings } from './pages/Settings';
import { useTheme } from './hooks/useTheme';
import './App.css';

function AppContent() {
  // Initialize theme on app load
  useTheme();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/city/:cityName" element={<CityDetail />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;

