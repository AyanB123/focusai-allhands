import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

// Icons (placeholder - would use actual icon components in production)
const DashboardIcon = () => <div className="w-6 h-6">📊</div>;
const AnalyticsIcon = () => <div className="w-6 h-6">📈</div>;
const SchedulerIcon = () => <div className="w-6 h-6">📅</div>;
const WorkflowIcon = () => <div className="w-6 h-6">🔄</div>;
const SettingsIcon = () => <div className="w-6 h-6">⚙️</div>;
const CollapseIcon = () => <div className="w-6 h-6">◀</div>;
const ExpandIcon = () => <div className="w-6 h-6">▶</div>;

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <aside 
      className={`${
        isDarkMode ? 'bg-dark-card' : 'bg-light-card'
      } transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center">
        {isCollapsed ? (
          <div className="text-2xl font-bold">PP</div>
        ) : (
          <div className="text-xl font-bold">ProductivityPro</div>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md mb-2 ${
              isActive 
                ? 'bg-accent-blue text-white' 
                : 'hover:bg-opacity-10 hover:bg-white'
            }`
          }
        >
          <DashboardIcon />
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md mb-2 ${
              isActive 
                ? 'bg-accent-blue text-white' 
                : 'hover:bg-opacity-10 hover:bg-white'
            }`
          }
        >
          <AnalyticsIcon />
          {!isCollapsed && <span className="ml-3">Analytics</span>}
        </NavLink>
        
        <NavLink 
          to="/scheduler" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md mb-2 ${
              isActive 
                ? 'bg-accent-blue text-white' 
                : 'hover:bg-opacity-10 hover:bg-white'
            }`
          }
        >
          <SchedulerIcon />
          {!isCollapsed && <span className="ml-3">Scheduler</span>}
        </NavLink>
        
        <NavLink 
          to="/workflow" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md mb-2 ${
              isActive 
                ? 'bg-accent-blue text-white' 
                : 'hover:bg-opacity-10 hover:bg-white'
            }`
          }
        >
          <WorkflowIcon />
          {!isCollapsed && <span className="ml-3">Workflow</span>}
        </NavLink>
      </nav>
      
      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md mb-2 ${
              isActive 
                ? 'bg-accent-blue text-white' 
                : 'hover:bg-opacity-10 hover:bg-white'
            }`
          }
        >
          <SettingsIcon />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </NavLink>
        
        {/* Collapse/Expand Button */}
        <button 
          onClick={toggleSidebar}
          className="flex items-center p-2 rounded-md w-full hover:bg-opacity-10 hover:bg-white"
        >
          {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          {!isCollapsed && <span className="ml-3">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;