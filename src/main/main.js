const { app, BrowserWindow, ipcMain, Tray, Menu, desktopCapturer } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let tray;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, '../../assets/icons/icon.png'),
    backgroundColor: '#1A1A1A', // Dark theme by default
  });

  // Load the index.html file
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : url.format({
          pathname: path.join(__dirname, '../../dist/index.html'),
          protocol: 'file:',
          slashes: true,
        })
  );

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Create system tray
  createTray();

  // Handle window close event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../../assets/icons/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ProductivityPro', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Pause Tracking', type: 'checkbox', checked: false },
    { label: 'Open Chat', click: () => mainWindow.webContents.send('toggle-chat') },
    { label: 'Focus Mode', click: () => mainWindow.webContents.send('toggle-focus-mode') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setToolTip('ProductivityPro');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// Activity tracking functions
function startActivityTracking() {
  // Track active windows
  setInterval(async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
      const activeWindow = sources.find(source => source.id.includes('window'));
      
      if (activeWindow && mainWindow) {
        mainWindow.webContents.send('active-window', {
          name: activeWindow.name,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error tracking active window:', error);
    }
  }, 5000); // Check every 5 seconds
}

// Initialize app
app.whenReady().then(() => {
  createWindow();
  startActivityTracking();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.on('app-quit', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-app', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

// Handle idle detection
let idleThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
let lastActivity = Date.now();

ipcMain.on('user-activity', () => {
  lastActivity = Date.now();
  mainWindow.webContents.send('idle-status', false);
});

// Check for idle status
setInterval(() => {
  const idle = Date.now() - lastActivity > idleThreshold;
  if (mainWindow) {
    mainWindow.webContents.send('idle-status', idle);
  }
}, 60000); // Check every minute

// Set idle threshold
ipcMain.on('set-idle-threshold', (event, minutes) => {
  idleThreshold = minutes * 60 * 1000;
});