import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Scheduler from './pages/Scheduler';
import Workflow from './pages/Workflow';
import Settings from './pages/Settings';

// Import components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWidget from './components/ChatWidget';
import FocusMode from './components/FocusMode';

// Import context
import { ThemeProvider } from './context/ThemeContext';
import { ActivityProvider } from './context/ActivityContext';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const navigate = useNavigate();

  // Listen for IPC events from main process
  useEffect(() => {
    // Toggle chat widget
    window.api.receive('toggle-chat', () => {
      setIsChatOpen(prev => !prev);
    });

    // Toggle focus mode
    window.api.receive('toggle-focus-mode', () => {
      setIsFocusModeActive(prev => !prev);
    });

    // Report user activity to prevent idle state
    const reportActivity = () => {
      window.api.send('user-activity');
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', reportActivity);
    window.addEventListener('keydown', reportActivity);
    window.addEventListener('click', reportActivity);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', reportActivity);
      window.removeEventListener('keydown', reportActivity);
      window.removeEventListener('click', reportActivity);
    };
  }, []);

  // Toggle chat widget
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setIsFocusModeActive(prev => !prev);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <ThemeProvider>
      <ActivityProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Bar */}
            <TopBar toggleChat={toggleChat} />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4">
              <Routes>
                <Route path="/" element={<Dashboard toggleChat={toggleChat} />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/scheduler" element={<Scheduler />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          
          {/* Chat Widget */}
          {isChatOpen && <ChatWidget toggleChat={toggleChat} />}
          
          {/* Focus Mode Overlay */}
          {isFocusModeActive && <FocusMode toggleFocusMode={toggleFocusMode} />}
        </div>
      </ActivityProvider>
    </ThemeProvider>
  );
};

export default App;