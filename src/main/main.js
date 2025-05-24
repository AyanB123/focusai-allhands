const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { setupIpcHandlers } = require('./ipc');
const { store, storeHelpers } = require('./store');
const ActivityTracker = require('./activity-tracker');
const mlBridge = require('./ml-bridge');
require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production' });

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let tray;
let activityTracker;
let isTracking = false;

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
    show: false, // Don't show until ready-to-show
    backgroundColor: '#f5f5f5',
    titleBarStyle: 'hiddenInset',
  });

  // In development, load from webpack dev server
  // In production, load from built files
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
    return true;
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create system tray icon
function createTray() {
  // Use different icon based on platform
  const iconPath = process.platform === 'darwin' 
    ? path.join(__dirname, '../../assets/tray-icon-mac.png') 
    : path.join(__dirname, '../../assets/tray-icon.png');
  
  tray = new Tray(iconPath);
  updateTrayMenu();
  
  tray.setToolTip('ProductivityPro');
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

// Update the tray menu based on tracking state
function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ProductivityPro', click: () => {
      if (mainWindow) {
        mainWindow.show();
      } else {
        createWindow();
      }
    }},
    { type: 'separator' },
    { 
      label: isTracking ? 'Pause Tracking' : 'Start Tracking', 
      click: () => {
        toggleTracking();
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => {
      app.isQuitting = true;
      app.quit();
    }}
  ]);
  
  tray.setContextMenu(contextMenu);
}

// Toggle activity tracking
function toggleTracking() {
  if (isTracking) {
    stopTracking();
  } else {
    startTracking();
  }
}

// Start activity tracking
function startTracking() {
  if (!activityTracker) {
    activityTracker = new ActivityTracker();
  }
  
  activityTracker.startTracking();
  isTracking = true;
  updateTrayMenu();
  
  if (mainWindow) {
    mainWindow.webContents.send('tracking-status-changed', isTracking);
  }
}

// Stop activity tracking
function stopTracking() {
  if (activityTracker) {
    activityTracker.stopTracking();
  }
  
  isTracking = false;
  updateTrayMenu();
  
  if (mainWindow) {
    mainWindow.webContents.send('tracking-status-changed', isTracking);
  }
}

// Export data to a file
function exportData() {
  if (!mainWindow) return;
  
  dialog.showSaveDialog(mainWindow, {
    title: 'Export ProductivityPro Data',
    defaultPath: path.join(app.getPath('documents'), 'productivitypro-data.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  }).then(result => {
    if (!result.canceled && result.filePath) {
      const data = storeHelpers.exportData();
      fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
      
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Export Successful',
        message: 'Your data has been exported successfully.',
      });
    }
  }).catch(err => {
    console.error('Error exporting data:', err);
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Export Failed',
      message: 'There was an error exporting your data.',
      detail: err.message,
    });
  });
}

// Import data from a file
function importData() {
  if (!mainWindow) return;
  
  dialog.showOpenDialog(mainWindow, {
    title: 'Import ProductivityPro Data',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile'],
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      try {
        const data = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
        storeHelpers.importData(data);
        
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Import Successful',
          message: 'Your data has been imported successfully.',
        });
        
        // Notify renderer to refresh data
        mainWindow.webContents.send('data-imported');
      } catch (err) {
        console.error('Error importing data:', err);
        dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: 'Import Failed',
          message: 'There was an error importing your data.',
          detail: err.message,
        });
      }
    }
  }).catch(err => {
    console.error('Error importing data:', err);
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Import Failed',
      message: 'There was an error importing your data.',
      detail: err.message,
    });
  });
}

// App ready event
app.whenReady().then(async () => {
  // Set up IPC handlers
  setupIpcHandlers();
  
  // Additional IPC handlers specific to main.js
  ipcMain.handle('get-tracking-status', () => isTracking);
  
  ipcMain.handle('toggle-tracking', () => {
    toggleTracking();
    return isTracking;
  });
  
  ipcMain.handle('export-data-to-file', exportData);
  ipcMain.handle('import-data-from-file', importData);
  
  // ML-related IPC handlers
  ipcMain.handle('classify-activity', async (event, activity) => {
    try {
      return await mlBridge.classifyActivity(activity);
    } catch (error) {
      console.error('Error classifying activity:', error);
      return { category: 'neutral', probabilities: {} };
    }
  });
  
  ipcMain.handle('train-classifier', async (event, { activities, categories }) => {
    try {
      return await mlBridge.trainClassifier(activities, categories);
    } catch (error) {
      console.error('Error training classifier:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('predict-productivity', async (event, activities) => {
    try {
      return await mlBridge.predictProductivity(activities);
    } catch (error) {
      console.error('Error predicting productivity:', error);
      return { score: 50 }; // Default score
    }
  });
  
  ipcMain.handle('train-productivity-predictor', async (event, { activitiesList, scores }) => {
    try {
      return await mlBridge.trainProductivityPredictor(activitiesList, scores);
    } catch (error) {
      console.error('Error training productivity predictor:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('generate-recommendations', async (event, { activities, maxRecommendations }) => {
    try {
      return await mlBridge.generateRecommendations(activities, maxRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { recommendations: [] };
    }
  });
  
  // Create window and tray
  createWindow();
  createTray();
  
  // Start ML server in development mode or if enabled in settings
  const settings = storeHelpers.getSettings();
  if (process.env.NODE_ENV === 'development' || (settings && settings.enableMlFeatures)) {
    try {
      await mlBridge.startServer();
    } catch (error) {
      console.error('Failed to start ML server:', error);
    }
  }
  
  // Start tracking if auto-start is enabled
  if (settings && settings.startTrackingOnLaunch) {
    startTracking();
  }
  
  // On macOS, recreate window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app before-quit event
app.on('before-quit', () => {
  app.isQuitting = true;
  
  // Stop tracking before quitting
  if (isTracking && activityTracker) {
    activityTracker.stopTracking();
  }
  
  // Stop ML server before quitting
  mlBridge.stopServer();
});

// Handle app startup settings
const settings = storeHelpers.getSettings();
if (settings && settings.startAtLogin) {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  });
}