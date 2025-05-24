const Store = require('electron-store');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Define the schema for our store
const schema = {
  settings: {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      startAtLogin: {
        type: 'boolean',
        default: false,
      },
      notifications: {
        type: 'boolean',
        default: true,
      },
      notificationFrequency: {
        type: 'number',
        minimum: 15,
        maximum: 120,
        default: 60,
      },
      workHours: {
        type: 'object',
        properties: {
          start: {
            type: 'string',
            default: '09:00',
          },
          end: {
            type: 'string',
            default: '17:00',
          },
        },
      },
      workDays: {
        type: 'array',
        items: {
          type: 'number',
          minimum: 0,
          maximum: 6,
        },
        default: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
      },
      productivityGoal: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 70,
      },
    },
  },
  activities: {
    type: 'array',
    default: [],
  },
  categories: {
    type: 'object',
    properties: {
      productive: {
        type: 'array',
        default: ['code-editor', 'terminal', 'document-editor', 'email-client'],
      },
      neutral: {
        type: 'array',
        default: ['browser', 'file-explorer', 'messaging'],
      },
      distracting: {
        type: 'array',
        default: ['social-media', 'entertainment', 'games'],
      },
    },
  },
};

// Create the data directory if it doesn't exist
const dataDir = path.join(app ? app.getPath('userData') : __dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the store
const store = new Store({
  schema,
  name: 'productivitypro-data',
  fileExtension: 'json',
  cwd: dataDir,
});

// Helper functions for working with the store
const storeHelpers = {
  // Settings
  getSettings: () => store.get('settings'),
  updateSettings: (newSettings) => store.set('settings', { ...store.get('settings'), ...newSettings }),
  
  // Activities
  getActivities: () => store.get('activities'),
  addActivity: (activity) => {
    const activities = store.get('activities');
    activities.push(activity);
    store.set('activities', activities);
    return activity;
  },
  getActivitiesByDate: (date) => {
    const activities = store.get('activities');
    const dateStr = new Date(date).toISOString().split('T')[0];
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime).toISOString().split('T')[0];
      return activityDate === dateStr;
    });
  },
  
  // Categories
  getCategories: () => store.get('categories'),
  updateCategories: (newCategories) => store.set('categories', { ...store.get('categories'), ...newCategories }),
  
  // Analytics
  getProductivityScore: (date) => {
    const activities = storeHelpers.getActivitiesByDate(date);
    if (activities.length === 0) return 0;
    
    const categories = store.get('categories');
    const productiveApps = categories.productive;
    
    let productiveTime = 0;
    let totalTime = 0;
    
    activities.forEach(activity => {
      const duration = activity.endTime - activity.startTime;
      totalTime += duration;
      
      if (productiveApps.includes(activity.category)) {
        productiveTime += duration;
      }
    });
    
    return totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
  },
  
  // Data export/import
  exportData: () => {
    return {
      settings: store.get('settings'),
      activities: store.get('activities'),
      categories: store.get('categories'),
    };
  },
  importData: (data) => {
    if (data.settings) store.set('settings', data.settings);
    if (data.activities) store.set('activities', data.activities);
    if (data.categories) store.set('categories', data.categories);
  },
  
  // Reset
  resetStore: () => {
    store.clear();
  },
};

module.exports = { store, storeHelpers };