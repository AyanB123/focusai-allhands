const { exec } = require('child_process');
const { storeHelpers } = require('./store');
const os = require('os');

class ActivityTracker {
  constructor() {
    this.isTracking = false;
    this.currentActivity = null;
    this.trackingInterval = null;
    this.categories = storeHelpers.getCategories();
  }

  /**
   * Start tracking user activity
   */
  startTracking() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.trackingInterval = setInterval(() => this.checkCurrentActivity(), 5000);
    console.log('Activity tracking started');
  }

  /**
   * Stop tracking user activity
   */
  stopTracking() {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    clearInterval(this.trackingInterval);
    
    // End the current activity if there is one
    if (this.currentActivity) {
      this.endCurrentActivity();
    }
    
    console.log('Activity tracking stopped');
  }

  /**
   * Check the current active application
   */
  checkCurrentActivity() {
    this.getActiveApplication((error, application) => {
      if (error) {
        console.error('Error getting active application:', error);
        return;
      }
      
      const now = Date.now();
      
      // If there's no current activity, start a new one
      if (!this.currentActivity) {
        this.startNewActivity(application, now);
        return;
      }
      
      // If the application has changed, end the current activity and start a new one
      if (this.currentActivity.application !== application) {
        this.endCurrentActivity(now);
        this.startNewActivity(application, now);
      }
    });
  }

  /**
   * Start a new activity
   * @param {string} application - The name of the application
   * @param {number} startTime - The start time of the activity
   */
  startNewActivity(application, startTime) {
    // Determine the category of the application
    const category = this.getCategoryForApplication(application);
    
    this.currentActivity = {
      application,
      category,
      startTime,
      endTime: null,
    };
    
    console.log(`Started new activity: ${application} (${category})`);
  }

  /**
   * End the current activity
   * @param {number} endTime - The end time of the activity
   */
  endCurrentActivity(endTime = Date.now()) {
    if (!this.currentActivity) return;
    
    this.currentActivity.endTime = endTime;
    
    // Only save activities that lasted more than 5 seconds
    if (this.currentActivity.endTime - this.currentActivity.startTime > 5000) {
      storeHelpers.addActivity(this.currentActivity);
      console.log(`Ended activity: ${this.currentActivity.application} (${this.currentActivity.category})`);
    }
    
    this.currentActivity = null;
  }

  /**
   * Get the category for an application
   * @param {string} application - The name of the application
   * @returns {string} The category of the application
   */
  getCategoryForApplication(application) {
    const categories = storeHelpers.getCategories();
    
    // Convert application name to lowercase for case-insensitive matching
    const appLower = application.toLowerCase();
    
    // Check if the application is in any of the categories
    for (const category of Object.keys(categories)) {
      if (categories[category].some(app => appLower.includes(app.toLowerCase()))) {
        return category;
      }
    }
    
    // Default to neutral if not found in any category
    return 'neutral';
  }

  /**
   * Get the currently active application
   * @param {Function} callback - The callback function
   */
  getActiveApplication(callback) {
    const platform = os.platform();
    
    if (platform === 'darwin') {
      // macOS
      const script = `
        tell application "System Events"
          set frontApp to name of first application process whose frontmost is true
        end tell
      `;
      
      exec(`osascript -e '${script}'`, (error, stdout) => {
        if (error) {
          callback(error, null);
          return;
        }
        
        callback(null, stdout.trim());
      });
    } else if (platform === 'win32') {
      // Windows
      exec('powershell "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Select-Object -ExpandProperty MainWindowTitle"', (error, stdout) => {
        if (error) {
          callback(error, null);
          return;
        }
        
        const titles = stdout.split('\n').filter(Boolean);
        callback(null, titles[0] || 'Unknown');
      });
    } else if (platform === 'linux') {
      // Linux
      exec('xdotool getwindowfocus getwindowname', (error, stdout) => {
        if (error) {
          callback(error, null);
          return;
        }
        
        callback(null, stdout.trim() || 'Unknown');
      });
    } else {
      // Unsupported platform
      callback(new Error(`Unsupported platform: ${platform}`), null);
    }
  }
}

module.exports = ActivityTracker;