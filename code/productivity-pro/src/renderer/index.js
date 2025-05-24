// This file will be the entry point for the renderer process
// In a full implementation, we would use React here

// DOM Elements
const pauseButton = document.querySelector('.btn');
const navItems = document.querySelectorAll('.nav-item');
const contentTitle = document.querySelector('.header h1');
const contentArea = document.querySelector('.content');

// State
let isTracking = true;

// Initialize the UI
document.addEventListener('DOMContentLoaded', () => {
  console.log('Renderer process initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Load initial data
  loadDashboardData();
});

// Set up event listeners
function setupEventListeners() {
  // Pause/resume tracking
  pauseButton.addEventListener('click', () => {
    isTracking = !isTracking;
    pauseButton.textContent = isTracking ? 'Pause Tracking' : 'Resume Tracking';
    
    // In a real implementation, we would use IPC to communicate with the main process
    console.log(`Tracking ${isTracking ? 'resumed' : 'paused'}`);
  });
  
  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Update content based on selected nav item
      const section = item.textContent;
      contentTitle.textContent = section;
      
      // Load section content
      loadSectionContent(section);
    });
  });
}

// Load dashboard data
function loadDashboardData() {
  console.log('Loading dashboard data');
  
  // In a real implementation, we would fetch data from the main process via IPC
  // For now, we'll just simulate loading with setTimeout
  
  setTimeout(() => {
    // Update today's activity card
    const activityCard = document.querySelector('.card:nth-child(1) p');
    activityCard.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Total active time:</strong> 4h 32m
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Visual Studio Code</span>
          <span>2h 15m</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Chrome - GitHub</span>
          <span>1h 05m</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Slack</span>
          <span>45m</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Other</span>
          <span>27m</span>
        </div>
      </div>
    `;
    
    // Update focus time card
    const focusCard = document.querySelector('.card:nth-child(2) p');
    focusCard.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Focus score:</strong> 78/100
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Deep work sessions:</strong> 3
      </div>
      <div>
        <strong>Best focus time:</strong> 9:00 AM - 11:30 AM
      </div>
    `;
    
    // Update category breakdown card
    const categoryCard = document.querySelector('.card:nth-child(3) p');
    categoryCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Work</span>
        <span>3h 45m (82%)</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Communication</span>
        <span>45m (16%)</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Social</span>
        <span>2m (1%)</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Uncategorized</span>
        <span>0m (0%)</span>
      </div>
    `;
  }, 1000);
}

// Load section content based on navigation
function loadSectionContent(section) {
  console.log(`Loading ${section} section`);
  
  // Clear existing cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.remove());
  
  // Create new content based on section
  switch(section) {
    case 'Dashboard':
      createDashboardContent();
      break;
    case 'Analytics':
      createAnalyticsContent();
      break;
    case 'Focus Assistant':
      createFocusAssistantContent();
      break;
    case 'Categories':
      createCategoriesContent();
      break;
    case 'Settings':
      createSettingsContent();
      break;
    default:
      createDashboardContent();
  }
  
  // Load data for the section
  if (section === 'Dashboard') {
    loadDashboardData();
  }
}

// Create dashboard content
function createDashboardContent() {
  const contentDiv = document.querySelector('.content');
  
  contentDiv.innerHTML = `
    <div class="header">
      <h1>Dashboard</h1>
      <button class="btn">Pause Tracking</button>
    </div>
    
    <div class="card">
      <h3>Today's Activity</h3>
      <p>Loading activity data...</p>
    </div>
    
    <div class="card">
      <h3>Focus Time</h3>
      <p>Loading focus metrics...</p>
    </div>
    
    <div class="card">
      <h3>Category Breakdown</h3>
      <p>Loading categories...</p>
    </div>
  `;
  
  // Re-attach event listener to new button
  const newPauseButton = document.querySelector('.btn');
  newPauseButton.addEventListener('click', () => {
    isTracking = !isTracking;
    newPauseButton.textContent = isTracking ? 'Pause Tracking' : 'Resume Tracking';
    console.log(`Tracking ${isTracking ? 'resumed' : 'paused'}`);
  });
}

// Create analytics content (placeholder)
function createAnalyticsContent() {
  const contentDiv = document.querySelector('.content');
  
  contentDiv.innerHTML = `
    <div class="header">
      <h1>Analytics</h1>
      <div>
        <select style="padding: 8px; background: #2a2a2a; color: white; border: 1px solid #3a3a3a; border-radius: 4px;">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This month</option>
          <option>Custom range</option>
        </select>
      </div>
    </div>
    
    <div class="card">
      <h3>Productivity Trends</h3>
      <p>Analytics visualization will be displayed here</p>
    </div>
    
    <div class="card">
      <h3>Time Distribution</h3>
      <p>Time distribution charts will be displayed here</p>
    </div>
    
    <div class="card">
      <h3>Focus Patterns</h3>
      <p>Focus pattern analysis will be displayed here</p>
    </div>
  `;
}

// Create focus assistant content (placeholder)
function createFocusAssistantContent() {
  const contentDiv = document.querySelector('.content');
  
  contentDiv.innerHTML = `
    <div class="header">
      <h1>Focus Assistant</h1>
      <button class="btn">Start Focus Session</button>
    </div>
    
    <div class="card">
      <h3>AI Recommendations</h3>
      <p>Based on your activity patterns, your optimal focus times are:</p>
      <ul>
        <li>9:00 AM - 11:30 AM</li>
        <li>2:00 PM - 4:00 PM</li>
      </ul>
      <p>Try scheduling deep work during these periods for maximum productivity.</p>
    </div>
    
    <div class="card">
      <h3>Focus Session Settings</h3>
      <p>Configure your focus session parameters here</p>
    </div>
  `;
}

// Create categories content (placeholder)
function createCategoriesContent() {
  const contentDiv = document.querySelector('.content');
  
  contentDiv.innerHTML = `
    <div class="header">
      <h1>Categories</h1>
      <button class="btn">Add Category</button>
    </div>
    
    <div class="card">
      <h3>Manage Categories</h3>
      <p>Category management interface will be displayed here</p>
    </div>
    
    <div class="card">
      <h3>Category Rules</h3>
      <p>Configure automatic categorization rules here</p>
    </div>
  `;
}

// Create settings content (placeholder)
function createSettingsContent() {
  const contentDiv = document.querySelector('.content');
  
  contentDiv.innerHTML = `
    <div class="header">
      <h1>Settings</h1>
      <button class="btn">Save Changes</button>
    </div>
    
    <div class="card">
      <h3>General Settings</h3>
      <p>Configure general application settings here</p>
    </div>
    
    <div class="card">
      <h3>Privacy Settings</h3>
      <p>Configure privacy and data collection settings here</p>
    </div>
    
    <div class="card">
      <h3>Advanced Settings</h3>
      <p>Configure advanced application settings here</p>
    </div>
  `;
}