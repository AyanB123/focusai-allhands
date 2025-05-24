const { ipcMain } = require('electron');
const { storeHelpers } = require('./store');

/**
 * Set up IPC handlers for communication between main and renderer processes
 */
function setupIpcHandlers() {
  // Settings
  ipcMain.handle('get-settings', async () => {
    return storeHelpers.getSettings();
  });
  
  ipcMain.handle('update-settings', async (event, settings) => {
    return storeHelpers.updateSettings(settings);
  });
  
  // Activities
  ipcMain.handle('get-activities', async () => {
    return storeHelpers.getActivities();
  });
  
  ipcMain.handle('get-activities-by-date', async (event, date) => {
    return storeHelpers.getActivitiesByDate(date);
  });
  
  ipcMain.handle('add-activity', async (event, activity) => {
    return storeHelpers.addActivity(activity);
  });
  
  // Categories
  ipcMain.handle('get-categories', async () => {
    return storeHelpers.getCategories();
  });
  
  ipcMain.handle('update-categories', async (event, categories) => {
    return storeHelpers.updateCategories(categories);
  });
  
  // Analytics
  ipcMain.handle('get-productivity-score', async (event, date) => {
    return storeHelpers.getProductivityScore(date);
  });
  
  // Data export/import
  ipcMain.handle('export-data', async () => {
    return storeHelpers.exportData();
  });
  
  ipcMain.handle('import-data', async (event, data) => {
    return storeHelpers.importData(data);
  });
  
  // System
  ipcMain.handle('get-app-version', async () => {
    const { app } = require('electron');
    return app.getVersion();
  });
}

module.exports = { setupIpcHandlers };