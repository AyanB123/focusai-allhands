const express = require('express');
const { getDatabase } = require('../db/setup');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Create Express app
const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Start Python AI server
let aiServer = null;
function startAIServer() {
  console.log('Starting AI server...');
  
  const pythonPath = path.join(process.cwd(), 'venv', 'bin', 'python');
  const scriptPath = path.join(process.cwd(), 'src', 'ai', 'api', 'server.py');
  
  aiServer = spawn(pythonPath, [scriptPath]);
  
  aiServer.stdout.on('data', (data) => {
    console.log(`AI server: ${data}`);
  });
  
  aiServer.stderr.on('data', (data) => {
    console.error(`AI server error: ${data}`);
  });
  
  aiServer.on('close', (code) => {
    console.log(`AI server exited with code ${code}`);
    // Restart server if it crashes
    if (code !== 0) {
      setTimeout(startAIServer, 5000);
    }
  });
}

// API Routes

// Get activities
app.get('/api/activities', (req, res) => {
  const db = getDatabase();
  
  // Parse query parameters
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;
  const startTime = req.query.start ? parseInt(req.query.start) : null;
  const endTime = req.query.end ? parseInt(req.query.end) : null;
  
  // Build query
  let query = 'SELECT * FROM activities';
  const params = [];
  
  if (startTime && endTime) {
    query += ' WHERE timestamp >= ? AND timestamp <= ?';
    params.push(startTime, endTime);
  } else if (startTime) {
    query += ' WHERE timestamp >= ?';
    params.push(startTime);
  } else if (endTime) {
    query += ' WHERE timestamp <= ?';
    params.push(endTime);
  }
  
  query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  // Execute query
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching activities:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ activities: rows });
    db.close();
  });
});

// Get activity summary
app.get('/api/summary', (req, res) => {
  const db = getDatabase();
  
  // Parse query parameters
  const startTime = req.query.start ? parseInt(req.query.start) : Math.floor(Date.now() / 1000) - 86400; // Default to last 24 hours
  const endTime = req.query.end ? parseInt(req.query.end) : Math.floor(Date.now() / 1000);
  
  // Get total duration by app
  db.all(
    `SELECT app, SUM(duration) as total_duration 
     FROM activities 
     WHERE timestamp >= ? AND timestamp <= ? 
     GROUP BY app 
     ORDER BY total_duration DESC`,
    [startTime, endTime],
    (err, appRows) => {
      if (err) {
        console.error('Error fetching app summary:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get total duration by category
      db.all(
        `SELECT category, SUM(duration) as total_duration 
         FROM activities 
         WHERE timestamp >= ? AND timestamp <= ? 
         GROUP BY category 
         ORDER BY total_duration DESC`,
        [startTime, endTime],
        (err, categoryRows) => {
          if (err) {
            console.error('Error fetching category summary:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          // Calculate total duration
          db.get(
            `SELECT SUM(duration) as total_duration 
             FROM activities 
             WHERE timestamp >= ? AND timestamp <= ?`,
            [startTime, endTime],
            (err, totalRow) => {
              if (err) {
                console.error('Error fetching total duration:', err);
                return res.status(500).json({ error: 'Database error' });
              }
              
              res.json({
                total_duration: totalRow ? totalRow.total_duration : 0,
                by_app: appRows,
                by_category: categoryRows
              });
              
              db.close();
            }
          );
        }
      );
    }
  );
});

// Get settings
app.get('/api/settings', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT key, value FROM settings', (err, rows) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Convert rows to object
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    res.json({ settings });
    db.close();
  });
});

// Update setting
app.post('/api/settings/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing key or value' });
  }
  
  const db = getDatabase();
  
  db.run(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value.toString()],
    function(err) {
      if (err) {
        console.error('Error updating setting:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ success: true, key, value });
      db.close();
    }
  );
});

// Get categories
app.get('/api/categories', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ categories: rows });
    db.close();
  });
});

// Create category
app.post('/api/categories', (req, res) => {
  const { name, color, rules } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Missing category name' });
  }
  
  const db = getDatabase();
  
  db.run(
    'INSERT INTO categories (name, color, rules) VALUES (?, ?, ?)',
    [name, color || '#808080', rules || ''],
    function(err) {
      if (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        success: true, 
        category: { 
          id: this.lastID, 
          name, 
          color: color || '#808080', 
          rules: rules || '' 
        } 
      });
      
      db.close();
    }
  );
});

// Start server
function startServer(port = 3000) {
  // Start Express server
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
  
  // Start AI server
  startAIServer();
}

module.exports = { startServer };