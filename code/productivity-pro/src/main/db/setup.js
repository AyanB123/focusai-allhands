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
  console.log('Initializing database at:', dbPath);
  
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

// Get database connection
function getDatabase() {
  return new sqlite3.Database(dbPath);
}

module.exports = { 
  initializeDatabase,
  getDatabase,
  dbPath
};