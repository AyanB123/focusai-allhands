const { desktopCapturer } = require('electron');
const path = require('path');
const os = require('os');
const { getDatabase, dbPath } = require('../db/setup');

// Current active window
let currentWindow = null;
let lastActiveTime = Date.now();
let isTracking = true;
let idleThreshold = 300; // 5 minutes in seconds

// Initialize tracker
function initTracker() {
  console.log('Initializing activity tracker');
  
  // Load settings
  const db = getDatabase();
  db.get('SELECT value FROM settings WHERE key = "idleThreshold"', (err, row) => {
    if (!err && row) {
      idleThreshold = parseInt(row.value, 10);
      console.log(`Idle threshold set to ${idleThreshold} seconds`);
    }
    db.close();
  });
  
  // Start tracking
  startTracking();
}

// Start tracking window activity
function startTracking() {
  if (!isTracking) return;
  
  console.log('Starting activity tracking');
  
  // Capture active window every second
  setInterval(async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['window'] });
      
      // Find active window (first in the list is usually the active one)
      if (sources.length > 0) {
        const activeWindow = sources[0];
        
        // Check if window changed
        if (!currentWindow || currentWindow.id !== activeWindow.id) {
          // Save previous window session if exists
          if (currentWindow) {
            saveWindowActivity(currentWindow);
          }
          
          // Update current window
          currentWindow = activeWindow;
          lastActiveTime = Date.now();
          console.log(`Active window changed to: ${currentWindow.name}`);
        } else {
          // Update duration for current window
          const now = Date.now();
          const idleTime = (now - lastActiveTime) / 1000; // in seconds
          
          // Check if user is idle
          if (idleTime > idleThreshold) {
            // User is idle, save current session and reset
            console.log(`User idle for ${idleTime} seconds, saving session`);
            saveWindowActivity(currentWindow, true);
            currentWindow = null;
          } else {
            // User is active, update last active time
            lastActiveTime = now;
          }
        }
      }
    } catch (error) {
      console.error('Error capturing window:', error);
    }
  }, 1000);
}

// Save window activity to database
function saveWindowActivity(window, isIdle = false) {
  const db = getDatabase();
  
  const activity = {
    timestamp: Math.floor(lastActiveTime / 1000),
    app: window.name.split(' - ')[0], // Extract app name from window title
    title: window.name,
    duration: Math.floor((Date.now() - lastActiveTime) / 1000),
    category: getCategoryForApp(window.name)
  };
  
  // Don't save if duration is too short
  if (activity.duration < 1) {
    db.close();
    return;
  }
  
  console.log(`Saving activity: ${activity.app} (${activity.duration}s)`);
  
  db.run(
    `INSERT INTO activities (timestamp, app, title, duration, category) 
     VALUES (?, ?, ?, ?, ?)`,
    [activity.timestamp, activity.app, activity.title, activity.duration, activity.category],
    function(err) {
      if (err) {
        console.error('Error saving activity:', err);
      }
      db.close();
    }
  );
}

// Get category for app based on rules
function getCategoryForApp(windowTitle) {
  // This is a placeholder - in the real implementation, 
  // we would load rules from the database and match against them
  if (windowTitle.includes('Visual Studio Code') || windowTitle.includes('GitHub')) {
    return 'Work';
  } else if (windowTitle.includes('YouTube') || windowTitle.includes('Netflix')) {
    return 'Entertainment';
  } else if (windowTitle.includes('Gmail') || windowTitle.includes('Outlook')) {
    return 'Communication';
  } else if (windowTitle.includes('Facebook') || windowTitle.includes('Twitter')) {
    return 'Social';
  }
  return 'Uncategorized';
}

// Toggle tracking state
function toggleTracking(state) {
  isTracking = state;
  console.log(`Activity tracking ${isTracking ? 'enabled' : 'disabled'}`);
  
  if (isTracking && !currentWindow) {
    startTracking();
  }
}

module.exports = { 
  initTracker, 
  toggleTracking 
};