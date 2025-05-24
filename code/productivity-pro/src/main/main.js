const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { initializeDatabase } = require('./db/setup');
const { initTracker } = require('./activity-tracker');

// Keep a global reference of the window object
let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../../assets/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ProductivityPro', click: () => mainWindow.show() },
    { label: 'Pause Tracking', type: 'checkbox' },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('ProductivityPro');
  tray.setContextMenu(contextMenu);
}

// Initialize the app
app.whenReady().then(() => {
  // Initialize database
  initializeDatabase();
  
  // Create window and tray
  createWindow();
  createTray();
  
  // Initialize activity tracker
  initTracker();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});