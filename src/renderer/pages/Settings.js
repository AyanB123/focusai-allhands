import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  const [settings, setSettings] = useState({
    idleThreshold: 5, // minutes
    startAtLogin: true,
    minimizeToTray: true,
    notifications: true,
    focusSessionDuration: 25, // minutes
    breakDuration: 5, // minutes
    dataCollection: 'full', // 'full', 'limited', 'none'
  });
  
  // Handle settings change
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    
    // Apply settings
    if (setting === 'idleThreshold') {
      window.api.send('set-idle-threshold', value);
    }
  };
  
  // Handle data collection change
  const handleDataCollectionChange = (e) => {
    handleSettingChange('dataCollection', e.target.value);
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">General Settings</h2>
          
          <div className="space-y-4">
            {/* Theme */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-gray-400">Switch between dark and light mode</div>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  id="theme-toggle"
                />
                <label
                  htmlFor="theme-toggle"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    isDarkMode ? 'bg-accent-blue' : 'bg-gray-400'
                  }`}
                >
                  <span 
                    className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300 ${
                      isDarkMode ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            {/* Start at Login */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Start at Login</div>
                <div className="text-sm text-gray-400">Launch application when system starts</div>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={settings.startAtLogin}
                  onChange={() => handleSettingChange('startAtLogin', !settings.startAtLogin)}
                  id="start-login-toggle"
                />
                <label
                  htmlFor="start-login-toggle"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    settings.startAtLogin ? 'bg-accent-blue' : 'bg-gray-400'
                  }`}
                >
                  <span 
                    className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300 ${
                      settings.startAtLogin ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            {/* Minimize to Tray */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Minimize to Tray</div>
                <div className="text-sm text-gray-400">Keep app running in system tray when closed</div>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={settings.minimizeToTray}
                  onChange={() => handleSettingChange('minimizeToTray', !settings.minimizeToTray)}
                  id="minimize-tray-toggle"
                />
                <label
                  htmlFor="minimize-tray-toggle"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    settings.minimizeToTray ? 'bg-accent-blue' : 'bg-gray-400'
                  }`}
                >
                  <span 
                    className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300 ${
                      settings.minimizeToTray ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-400">Enable desktop notifications</div>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={settings.notifications}
                  onChange={() => handleSettingChange('notifications', !settings.notifications)}
                  id="notifications-toggle"
                />
                <label
                  htmlFor="notifications-toggle"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    settings.notifications ? 'bg-accent-blue' : 'bg-gray-400'
                  }`}
                >
                  <span 
                    className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300 ${
                      settings.notifications ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Productivity Settings */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Productivity Settings</h2>
          
          <div className="space-y-4">
            {/* Idle Threshold */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Idle Threshold</div>
                <div className="text-sm text-accent-blue">{settings.idleThreshold} minutes</div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.idleThreshold}
                onChange={(e) => handleSettingChange('idleThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 min</span>
                <span>15 min</span>
                <span>30 min</span>
              </div>
            </div>
            
            {/* Focus Session Duration */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Focus Session Duration</div>
                <div className="text-sm text-accent-blue">{settings.focusSessionDuration} minutes</div>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={settings.focusSessionDuration}
                onChange={(e) => handleSettingChange('focusSessionDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 min</span>
                <span>45 min</span>
                <span>90 min</span>
              </div>
            </div>
            
            {/* Break Duration */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Break Duration</div>
                <div className="text-sm text-accent-blue">{settings.breakDuration} minutes</div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.breakDuration}
                onChange={(e) => handleSettingChange('breakDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 min</span>
                <span>15 min</span>
                <span>30 min</span>
              </div>
            </div>
            
            {/* Data Collection */}
            <div>
              <div className="font-medium mb-2">Data Collection</div>
              <div className="text-sm text-gray-400 mb-3">
                Control what data is collected for productivity analysis
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="data-full"
                    name="dataCollection"
                    value="full"
                    checked={settings.dataCollection === 'full'}
                    onChange={handleDataCollectionChange}
                    className="mr-2 accent-accent-blue"
                  />
                  <label htmlFor="data-full">
                    <div className="font-medium">Full</div>
                    <div className="text-xs text-gray-400">Track all applications and activities</div>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="data-limited"
                    name="dataCollection"
                    value="limited"
                    checked={settings.dataCollection === 'limited'}
                    onChange={handleDataCollectionChange}
                    className="mr-2 accent-accent-blue"
                  />
                  <label htmlFor="data-limited">
                    <div className="font-medium">Limited</div>
                    <div className="text-xs text-gray-400">Only track application categories, not specific apps</div>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="data-none"
                    name="dataCollection"
                    value="none"
                    checked={settings.dataCollection === 'none'}
                    onChange={handleDataCollectionChange}
                    className="mr-2 accent-accent-blue"
                  />
                  <label htmlFor="data-none">
                    <div className="font-medium">None</div>
                    <div className="text-xs text-gray-400">Only track time, no application data</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="card mt-6">
        <h2 className="text-xl font-medium mb-4">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Export Data</h3>
            <p className="text-sm text-gray-400 mb-4">
              Export your productivity data for backup or analysis
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90">
                Export as CSV
              </button>
              <button className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90">
                Export as JSON
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Clear Data</h3>
            <p className="text-sm text-gray-400 mb-4">
              Delete your productivity data permanently
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90">
                Clear All Data
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90">
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="card mt-6">
        <h2 className="text-xl font-medium mb-4">About</h2>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">ProductivityPro</h3>
          <p className="text-gray-400 mb-4">Version 1.0.0</p>
          <p className="text-gray-400 mb-6">
            An AI-powered productivity companion for optimal work habits
          </p>
          
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90">
              Check for Updates
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-opacity-90">
              View License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;