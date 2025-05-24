import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const { currentActivity } = useSelector(state => state.activities);
  const { theme } = useSelector(state => state.settings);
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/activities':
        return 'Activities';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'ProductivityPro';
    }
  };
  
  return (
    <header className="header">
      <div className="page-title">
        <h2>{getPageTitle()}</h2>
      </div>
      
      <div className="current-activity">
        {currentActivity && (
          <>
            <span className="activity-label">Current Activity:</span>
            <span className="activity-name">{currentActivity.name}</span>
            <span className="activity-time">{currentActivity.duration}</span>
          </>
        )}
      </div>
      
      <div className="header-controls">
        <button 
          className="theme-toggle"
          onClick={() => {
            // Theme toggle will be implemented with the settings slice
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="window-controls">
          <button 
            className="minimize-btn"
            onClick={() => window.electron.minimizeApp()}
          >
            _
          </button>
          <button 
            className="maximize-btn"
            onClick={() => window.electron.maximizeApp()}
          >
            □
          </button>
          <button 
            className="close-btn"
            onClick={() => window.electron.closeApp()}
          >
            ×
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;