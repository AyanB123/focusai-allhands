# ProductivityPro Implementation Plan

This document outlines the detailed implementation plan for initializing the ProductivityPro application, building on the concept, architecture, and requirements already defined. This plan focuses on concrete steps to set up the development environment, establish the project structure, and implement the core functionality for Phase 1 of development.

## 1. Development Environment Setup

### 1.1 Required Tools and Dependencies
- **Node.js**: v18.x LTS
- **Python**: v3.9+ with pip
- **Electron**: v20.x
- **Git**: Latest version
- **Code Editor**: VS Code with recommended extensions:
  - ESLint
  - Prettier
  - Python
  - SQLite
  - Electron Debugger

### 1.2 Environment Setup Steps
1. **Create Development Environment Script**
   ```bash
   # setup-dev-env.sh
   #!/bin/bash
   
   # Install Node.js dependencies
   npm install -g electron electron-builder
   npm install -g nodemon
   
   # Set up Python virtual environment
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Install pre-commit hooks
   npm install -g husky
   husky install
   ```

2. **Create requirements.txt for Python Dependencies**
   ```
   # requirements.txt
   fastapi==0.95.0
   uvicorn==0.21.1
   tensorflow==2.12.0
   torch==2.0.0
   transformers==4.27.4
   numpy==1.23.5
   pandas==2.0.0
   scikit-learn==1.2.2
   pytest==7.3.1
   black==23.3.0
   ```

3. **Create package.json for Node.js Dependencies**
   ```json
   {
     "name": "productivity-pro",
     "version": "0.1.0",
     "description": "AI-powered productivity tracking and optimization",
     "main": "main.js",
     "scripts": {
       "start": "electron .",
       "dev": "nodemon --exec electron .",
       "build": "electron-builder",
       "lint": "eslint .",
       "test": "jest"
     },
     "dependencies": {
       "express": "^4.18.2",
       "sqlite3": "^5.1.6",
       "chart.js": "^4.2.1",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "tailwindcss": "^3.3.1",
       "electron-store": "^8.1.0",
       "ws": "^8.13.0"
     },
     "devDependencies": {
       "electron": "^20.3.12",
       "electron-builder": "^23.6.0",
       "eslint": "^8.38.0",
       "jest": "^29.5.0",
       "nodemon": "^2.0.22"
     }
   }
   ```

## 2. Project Structure Initialization

### 2.1 Directory Structure
```
productivity-pro/
├── .github/                    # GitHub Actions workflows
├── assets/                     # Static assets (icons, images)
├── src/
│   ├── main/                   # Electron main process
│   │   ├── main.js             # Entry point
│   │   ├── activity-tracker/   # Activity tracking modules
│   │   ├── api/                # Express API endpoints
│   │   └── db/                 # SQLite database handlers
│   ├── renderer/               # Electron renderer process (React)
│   │   ├── components/         # React components
│   │   ├── screens/            # Screen components (Dashboard, Analytics, etc.)
│   │   ├── styles/             # Tailwind CSS styles
│   │   └── index.js            # Renderer entry point
│   └── ai/                     # Python AI/ML modules
│       ├── api/                # FastAPI server
│       ├── models/             # Neural network models
│       ├── preprocessing/      # Data preprocessing utilities
│       └── training/           # Model training scripts
├── tests/                      # Test files
│   ├── main/                   # Main process tests
│   ├── renderer/               # Renderer tests
│   └── ai/                     # AI/ML tests
├── scripts/                    # Build and utility scripts
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore file
├── package.json                # Node.js dependencies
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
```

### 2.2 Initial Files to Create

1. **Entry Point (main.js)**
```javascript
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

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
    icon: path.join(__dirname, '../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../assets/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ProductivityPro', click: () => mainWindow.show() },
    { label: 'Pause Tracking', type: 'checkbox' },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('ProductivityPro');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
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
```

2. **HTML Template (index.html)**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ProductivityPro</title>
  <link rel="stylesheet" href="styles/tailwind.css">
</head>
<body class="bg-gray-900 text-white">
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>
```

3. **Database Setup (db/setup.js)**
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create app data directory if it doesn't exist
const appDataPath = path.join(os.homedir(), '.productivitypro');
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Create logs directory
const logsPath = path.join(appDataPath, 'logs');
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

// Database path
const dbPath = path.join(appDataPath, 'productivitypro.db');

// Initialize database
function initializeDatabase() {
  const db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    // Activities table
    db.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        app TEXT NOT NULL,
        title TEXT,
        url TEXT,
        duration INTEGER DEFAULT 0,
        category TEXT,
        project TEXT
      )
    `);
    
    // Settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT,
        rules TEXT
      )
    `);
    
    // Insert default settings
    db.run(`
      INSERT OR IGNORE INTO settings (key, value)
      VALUES 
        ('trackWeekends', 'false'),
        ('idleThreshold', '300'),
        ('trackUrls', 'true')
    `);
    
    // Insert default categories
    db.run(`
      INSERT OR IGNORE INTO categories (name, color, rules)
      VALUES 
        ('Work', '#3B82F6', '*.slack.com,*.github.com,*.gitlab.com,Visual Studio Code'),
        ('Social', '#EF4444', '*.facebook.com,*.twitter.com,*.instagram.com'),
        ('Entertainment', '#10B981', '*.youtube.com,*.netflix.com,Spotify'),
        ('Communication', '#8B5CF6', '*.gmail.com,Outlook,*.zoom.us')
    `);
  });
  
  db.close();
  console.log('Database initialized successfully');
}

module.exports = { initializeDatabase };
```

4. **Activity Tracker (activity-tracker/index.js)**
```javascript
const { desktopCapturer } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');

// Database path
const dbPath = path.join(os.homedir(), '.productivitypro', 'productivitypro.db');

// Current active window
let currentWindow = null;
let lastActiveTime = Date.now();
let isTracking = true;
let idleThreshold = 300; // 5 minutes in seconds

// Initialize tracker
function initTracker() {
  // Load settings
  const db = new sqlite3.Database(dbPath);
  db.get('SELECT value FROM settings WHERE key = "idleThreshold"', (err, row) => {
    if (!err && row) {
      idleThreshold = parseInt(row.value, 10);
    }
    db.close();
  });
  
  // Start tracking
  startTracking();
}

// Start tracking window activity
function startTracking() {
  if (!isTracking) return;
  
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
        } else {
          // Update duration for current window
          const now = Date.now();
          const idleTime = (now - lastActiveTime) / 1000; // in seconds
          
          // Check if user is idle
          if (idleTime > idleThreshold) {
            // User is idle, save current session and reset
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
  const db = new sqlite3.Database(dbPath);
  
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
  if (isTracking && !currentWindow) {
    startTracking();
  }
}

module.exports = { initTracker, toggleTracking };
```

5. **FastAPI Server (ai/api/server.py)**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Any, Optional
import json
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import AI models (placeholders for now)
# from models.transformer import ChatModel
# from models.lstm import PredictiveModel

app = FastAPI(title="ProductivityPro AI API")

class ActivityData(BaseModel):
    timestamp: int
    app: str
    title: Optional[str] = None
    url: Optional[str] = None
    duration: int
    category: Optional[str] = None

class ChatQuery(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {"message": "ProductivityPro AI API is running"}

@app.post("/api/chat")
async def chat_endpoint(query: ChatQuery):
    """
    Process a chat query using the Transformer model
    """
    # Placeholder - will be replaced with actual model inference
    response = f"You asked: {query.query}. This is a placeholder response."
    return {"response": response}

@app.post("/api/predict/focus")
async def predict_focus(activities: List[ActivityData]):
    """
    Predict focus times based on historical activities using LSTM
    """
    # Placeholder - will be replaced with actual model inference
    predictions = [
        {"hour": 9, "focus_score": 0.85},
        {"hour": 10, "focus_score": 0.92},
        {"hour": 11, "focus_score": 0.88},
        {"hour": 14, "focus_score": 0.75},
        {"hour": 15, "focus_score": 0.65}
    ]
    return {"predictions": predictions}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
```

## 3. First Implementation Tasks

### 3.1 Core Functionality Implementation (Phase 1)

#### Week 1-2: Project Setup and Basic Tracking
1. **Set up development environment**
   - Create repository and initial project structure
   - Configure ESLint, Prettier, and Git hooks
   - Set up CI/CD with GitHub Actions

2. **Implement basic Electron app**
   - Create main window and system tray
   - Set up IPC communication between main and renderer processes
   - Implement basic UI shell with sidebar navigation

3. **Implement activity tracker**
   - Capture active windows using desktopCapturer
   - Detect idle time based on keyboard/mouse activity
   - Store activity data in SQLite database

#### Week 3-4: UI and Categorization
1. **Build Dashboard UI**
   - Implement activity timeline component
   - Create basic charts for daily activity
   - Add settings panel for tracking preferences

2. **Implement categorization engine**
   - Create rule-based categorization system
   - Build category management UI
   - Implement manual category overrides

3. **Add browser extension for URL tracking**
   - Create Chrome/Firefox extension for URL capture
   - Implement WebSocket communication with desktop app
   - Add URL-based categorization rules

#### Week 5-6: Analytics and Data Export
1. **Implement analytics calculations**
   - Add daily/weekly summaries
   - Calculate focus time and productivity metrics
   - Create category breakdown reports

2. **Build Analytics screen**
   - Implement charts and visualizations
   - Add filtering by date range and category
   - Create export functionality for CSV data

3. **Add settings and preferences**
   - Implement user preferences storage
   - Add app exclusion settings
   - Create backup/restore functionality

### 3.2 AI/ML Foundation (Preparation for Phase 2)

1. **Set up Python environment**
   - Configure FastAPI server
   - Create placeholder endpoints for AI models
   - Implement data preprocessing utilities

2. **Prepare data pipeline**
   - Create scripts to extract training data from SQLite
   - Implement data normalization and feature extraction
   - Set up validation pipeline for model testing

3. **Research and prototype models**
   - Experiment with DistilBERT for chat assistant
   - Test LSTM architectures for time series prediction
   - Document findings and approach for full implementation

## 4. Timeline and Milestones

### Month 1: Foundation
- **Week 1**: Development environment setup, project structure
- **Week 2**: Basic Electron app, activity tracker implementation
- **Week 3**: Dashboard UI, SQLite database integration
- **Week 4**: Categorization engine, settings panel

### Month 2: Core Features
- **Week 5**: Browser extension, URL tracking
- **Week 6**: Analytics calculations, data visualization
- **Week 7**: Analytics screen, filtering functionality
- **Week 8**: Data export, preferences, testing

### Month 3: AI Preparation and MVP Release
- **Week 9**: Python environment, FastAPI server
- **Week 10**: Data pipeline, preprocessing utilities
- **Week 11**: Model prototyping, documentation
- **Week 12**: Bug fixes, performance optimization, MVP release

## 5. Next Steps

1. **Initialize the repository with the project structure**
   ```bash
   mkdir -p productivity-pro/{src/{main,renderer,ai},assets,tests,scripts}
   cd productivity-pro
   npm init -y
   # Update package.json with dependencies
   npm install
   ```

2. **Create the initial Electron app**
   ```bash
   # Create main.js, index.html, and other core files
   touch src/main/main.js
   touch src/renderer/index.html
   touch src/renderer/index.js
   ```

3. **Set up the Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn
   touch src/ai/api/server.py
   ```

4. **Implement the activity tracker module**
   ```bash
   # Create activity tracker files
   mkdir -p src/main/activity-tracker
   touch src/main/activity-tracker/index.js
   ```

5. **Begin implementing the database layer**
   ```bash
   mkdir -p src/main/db
   touch src/main/db/setup.js
   ```

This implementation plan provides a concrete roadmap for initializing the ProductivityPro application, focusing on the core functionality defined in Phase 1 of the requirements. By following this plan, you'll establish a solid foundation for the application, setting the stage for the AI/ML features in subsequent phases.