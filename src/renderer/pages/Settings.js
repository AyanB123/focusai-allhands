import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setTheme, 
  setLaunchAtStartup, 
  setMinimizeToTray,
  setTrackingEnabled,
  setIdleThreshold,
  setWorkHours,
  setWorkDays,
  setNotificationSettings
} from '../store/settingsSlice';
import '../styles/Settings.css';

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  
  // Handle theme change
  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    // Apply theme to document body
    document.body.setAttribute('data-theme', theme);
  };
  
  // Handle checkbox settings
  const handleCheckboxChange = (setting, value) => {
    switch (setting) {
      case 'launchAtStartup':
        dispatch(setLaunchAtStartup(value));
        break;
      case 'minimizeToTray':
        dispatch(setMinimizeToTray(value));
        break;
      case 'trackingEnabled':
        dispatch(setTrackingEnabled(value));
        break;
      default:
        break;
    }
  };
  
  // Handle idle threshold change
  const handleIdleThresholdChange = (value) => {
    dispatch(setIdleThreshold(parseInt(value)));
  };
  
  // Handle work hours change
  const handleWorkHoursChange = (type, value) => {
    dispatch(setWorkHours({
      ...settings.workHours,
      [type]: value
    }));
  };
  
  // Handle work days change
  const handleWorkDayToggle = (day) => {
    const newWorkDays = [...settings.workDays];
    
    if (newWorkDays.includes(day)) {
      // Remove day if already included
      const index = newWorkDays.indexOf(day);
      newWorkDays.splice(index, 1);
    } else {
      // Add day if not included
      newWorkDays.push(day);
      newWorkDays.sort();
    }
    
    dispatch(setWorkDays(newWorkDays));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (setting, value) => {
    dispatch(setNotificationSettings({
      ...settings.notifications,
      [setting]: value
    }));
  };
  
  return (
    <div className="settings-page">
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-item">
          <label>Theme</label>
          <div className="theme-options">
            <button 
              className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </button>
            <button 
              className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </button>
            <button 
              className={`theme-btn ${settings.theme === 'system' ? 'active' : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              System
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Application</h3>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.launchAtStartup}
              onChange={(e) => handleCheckboxChange('launchAtStartup', e.target.checked)}
            />
            Launch at startup
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.minimizeToTray}
              onChange={(e) => handleCheckboxChange('minimizeToTray', e.target.checked)}
            />
            Minimize to system tray
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Tracking</h3>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.trackingEnabled}
              onChange={(e) => handleCheckboxChange('trackingEnabled', e.target.checked)}
            />
            Enable activity tracking
          </label>
        </div>
        <div className="setting-item">
          <label>Idle threshold (minutes)</label>
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={settings.idleThreshold}
            onChange={(e) => handleIdleThresholdChange(e.target.value)}
          />
          <span className="range-value">{settings.idleThreshold}</span>
        </div>
        <div className="setting-item">
          <label>Work hours</label>
          <div className="work-hours">
            <div className="time-input">
              <span>Start:</span>
              <input 
                type="time" 
                value={settings.workHours.start}
                onChange={(e) => handleWorkHoursChange('start', e.target.value)}
              />
            </div>
            <div className="time-input">
              <span>End:</span>
              <input 
                type="time" 
                value={settings.workHours.end}
                onChange={(e) => handleWorkHoursChange('end', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="setting-item">
          <label>Work days</label>
          <div className="work-days">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <button 
                key={index}
                className={`day-btn ${settings.workDays.includes(index) ? 'active' : ''}`}
                onClick={() => handleWorkDayToggle(index)}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifications.enabled}
              onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
            />
            Enable notifications
          </label>
        </div>
        <div className="setting-item notification-sub-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifications.focusReminders}
              disabled={!settings.notifications.enabled}
              onChange={(e) => handleNotificationChange('focusReminders', e.target.checked)}
            />
            Focus reminders
          </label>
        </div>
        <div className="setting-item notification-sub-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifications.breakReminders}
              disabled={!settings.notifications.enabled}
              onChange={(e) => handleNotificationChange('breakReminders', e.target.checked)}
            />
            Break reminders
          </label>
        </div>
        <div className="setting-item notification-sub-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifications.dailySummary}
              disabled={!settings.notifications.enabled}
              onChange={(e) => handleNotificationChange('dailySummary', e.target.checked)}
            />
            Daily summary
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;