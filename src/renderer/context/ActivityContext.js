import React, { createContext, useState, useEffect } from 'react';

// Create Activity Context
export const ActivityContext = createContext();

// Activity Provider Component
export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [isIdle, setIsIdle] = useState(false);
  const [stats, setStats] = useState({
    productive: 0,
    neutral: 0,
    distracting: 0,
  });

  // Listen for active window updates from main process
  useEffect(() => {
    window.api.receive('active-window', (data) => {
      // Add new activity to the list
      const newActivity = {
        ...data,
        category: categorizeActivity(data.name),
      };
      
      setCurrentActivity(newActivity);
      setActivities(prev => [...prev, newActivity]);
      
      // Update stats
      updateStats(newActivity.category);
    });

    // Listen for idle status updates
    window.api.receive('idle-status', (idle) => {
      setIsIdle(idle);
    });
  }, []);

  // Categorize activity based on window name
  const categorizeActivity = (windowName) => {
    const lowerCaseName = windowName.toLowerCase();
    
    // Productive applications
    if (
      lowerCaseName.includes('code') ||
      lowerCaseName.includes('visual studio') ||
      lowerCaseName.includes('intellij') ||
      lowerCaseName.includes('pycharm') ||
      lowerCaseName.includes('webstorm') ||
      lowerCaseName.includes('excel') ||
      lowerCaseName.includes('word') ||
      lowerCaseName.includes('powerpoint') ||
      lowerCaseName.includes('outlook') ||
      lowerCaseName.includes('slack') ||
      lowerCaseName.includes('teams') ||
      lowerCaseName.includes('zoom') ||
      lowerCaseName.includes('figma') ||
      lowerCaseName.includes('notion') ||
      lowerCaseName.includes('jira') ||
      lowerCaseName.includes('trello') ||
      lowerCaseName.includes('asana')
    ) {
      return 'productive';
    }
    
    // Distracting applications
    if (
      lowerCaseName.includes('youtube') ||
      lowerCaseName.includes('netflix') ||
      lowerCaseName.includes('facebook') ||
      lowerCaseName.includes('instagram') ||
      lowerCaseName.includes('twitter') ||
      lowerCaseName.includes('reddit') ||
      lowerCaseName.includes('tiktok') ||
      lowerCaseName.includes('game') ||
      lowerCaseName.includes('steam') ||
      lowerCaseName.includes('epic games')
    ) {
      return 'distracting';
    }
    
    // Default to neutral
    return 'neutral';
  };

  // Update activity stats
  const updateStats = (category) => {
    setStats(prev => ({
      ...prev,
      [category]: prev[category] + 1,
    }));
  };

  // Manually categorize an activity
  const recategorizeActivity = (timestamp, newCategory) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.timestamp === timestamp 
          ? { ...activity, category: newCategory } 
          : activity
      )
    );
    
    // Recalculate stats
    const updatedActivities = activities.map(activity => 
      activity.timestamp === timestamp 
        ? { ...activity, category: newCategory } 
        : activity
    );
    
    const newStats = updatedActivities.reduce((acc, activity) => {
      acc[activity.category] += 1;
      return acc;
    }, { productive: 0, neutral: 0, distracting: 0 });
    
    setStats(newStats);
  };

  return (
    <ActivityContext.Provider 
      value={{ 
        activities, 
        currentActivity, 
        isIdle, 
        stats, 
        recategorizeActivity 
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};