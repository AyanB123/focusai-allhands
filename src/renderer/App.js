import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { setAppSettings } from './store/settingsSlice';
import './styles/App.css';

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Load app settings on startup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.electron.getAppSettings();
        if (settings) {
          dispatch(setAppSettings(settings));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;