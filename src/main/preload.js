const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    // Settings API
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
    
    // Activities API
    getActivities: () => ipcRenderer.invoke('get-activities'),
    getActivitiesByDate: (date) => ipcRenderer.invoke('get-activities-by-date', date),
    addActivity: (activity) => ipcRenderer.invoke('add-activity', activity),
    
    // Categories API
    getCategories: () => ipcRenderer.invoke('get-categories'),
    updateCategories: (categories) => ipcRenderer.invoke('update-categories', categories),
    
    // Analytics API
    getProductivityScore: (date) => ipcRenderer.invoke('get-productivity-score', date),
    
    // Tracking API
    getTrackingStatus: () => ipcRenderer.invoke('get-tracking-status'),
    toggleTracking: () => ipcRenderer.invoke('toggle-tracking'),
    
    // Data export/import API
    exportData: () => ipcRenderer.invoke('export-data'),
    importData: (data) => ipcRenderer.invoke('import-data', data),
    exportDataToFile: () => ipcRenderer.invoke('export-data-to-file'),
    importDataFromFile: () => ipcRenderer.invoke('import-data-from-file'),
    
    // System API
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    
    // ML API
    classifyActivity: (activity) => ipcRenderer.invoke('classify-activity', activity),
    trainClassifier: (activities, categories) => ipcRenderer.invoke('train-classifier', { activities, categories }),
    predictProductivity: (activities) => ipcRenderer.invoke('predict-productivity', activities),
    trainProductivityPredictor: (activitiesList, scores) => ipcRenderer.invoke('train-productivity-predictor', { activitiesList, scores }),
    generateRecommendations: (activities, maxRecommendations) => ipcRenderer.invoke('generate-recommendations', { activities, maxRecommendations }),
    
    // App control API
    minimizeApp: () => ipcRenderer.send('minimize-app'),
    maximizeApp: () => ipcRenderer.send('maximize-app'),
    closeApp: () => ipcRenderer.send('close-app'),
    
    // Event listeners
    on: (channel, callback) => {
      // Whitelist channels that can be listened to
      const validChannels = [
        'tracking-status-changed',
        'activity-update',
        'data-imported',
        'notification'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
      }
    },
    
    // Remove event listeners
    removeAllListeners: (channel) => {
      const validChannels = [
        'tracking-status-changed',
        'activity-update',
        'data-imported',
        'notification'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
);