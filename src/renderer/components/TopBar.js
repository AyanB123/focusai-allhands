import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ActivityContext } from '../context/ActivityContext';

// Icons (placeholder - would use actual icon components in production)
const SunIcon = () => <div className="w-6 h-6">☀️</div>;
const MoonIcon = () => <div className="w-6 h-6">🌙</div>;
const ChatIcon = () => <div className="w-6 h-6">💬</div>;
const MinimizeIcon = () => <div className="w-6 h-6">🔽</div>;
const MaximizeIcon = () => <div className="w-6 h-6">🔼</div>;
const CloseIcon = () => <div className="w-6 h-6">❌</div>;

const TopBar = ({ toggleChat }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { currentActivity, isIdle } = useContext(ActivityContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle window controls
  const handleMinimize = () => {
    window.api.send('minimize-app');
  };
  
  const handleMaximize = () => {
    window.api.send('maximize-app');
  };
  
  const handleClose = () => {
    window.api.send('app-quit');
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <header 
      className={`${
        isDarkMode ? 'bg-dark-card' : 'bg-light-card'
      } p-4 flex items-center justify-between border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`}
    >
      {/* Left Section - Current Activity */}
      <div className="flex items-center">
        {isIdle ? (
          <div className="text-yellow-500">Idle</div>
        ) : currentActivity ? (
          <div className="flex flex-col">
            <div className="font-medium">Current: {currentActivity.name}</div>
            <div 
              className={`text-sm ${
                currentActivity.category === 'productive' 
                  ? 'text-green-500' 
                  : currentActivity.category === 'distracting' 
                    ? 'text-red-500' 
                    : 'text-gray-400'
              }`}
            >
              {currentActivity.category.charAt(0).toUpperCase() + currentActivity.category.slice(1)}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No activity detected</div>
        )}
      </div>
      
      {/* Middle Section - Search */}
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className={`w-full px-4 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-800 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-accent-blue`}
        />
      </div>
      
      {/* Right Section - Controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        
        {/* Chat Toggle */}
        <button 
          onClick={toggleChat}
          className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white"
        >
          <ChatIcon />
        </button>
        
        {/* Window Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleMinimize}
            className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white"
          >
            <MinimizeIcon />
          </button>
          
          <button 
            onClick={handleMaximize}
            className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white"
          >
            <MaximizeIcon />
          </button>
          
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-opacity-10 hover:bg-white text-red-500"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;