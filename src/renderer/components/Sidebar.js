import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { isTracking } = useSelector(state => state.activities);
  
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>ProductivityPro</h1>
      </div>
      
      <div className="tracking-status">
        <div className={`status-indicator ${isTracking ? 'active' : 'inactive'}`}></div>
        <span>{isTracking ? 'Tracking' : 'Paused'}</span>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/activities" className={({ isActive }) => isActive ? 'active' : ''}>
              Activities
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button 
          className={`tracking-button ${isTracking ? 'pause' : 'start'}`}
          onClick={() => {
            if (isTracking) {
              window.electron.pauseTracking();
            } else {
              window.electron.startTracking();
            }
          }}
        >
          {isTracking ? 'Pause Tracking' : 'Start Tracking'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;