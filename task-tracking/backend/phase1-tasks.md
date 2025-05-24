# Backend Tasks - Phase 1: Core Tracking and Categorization

This file tracks backend tasks for Phase 1 of the ProductivityPro project.

## Task Summary

| ID | Task | Status | Effort (hours) | Assigned To | Dependencies |
|----|------|--------|---------------|-------------|--------------|
| B1.1 | Implement Activity Tracker using Electron's `desktopCapturer` | 🔴 Not Started | 16 | - | - |
| B1.2 | Develop browser extension for URL tracking | 🔴 Not Started | 12 | - | - |
| B1.3 | Build Event Processor for data normalization | 🔴 Not Started | 12 | - | B1.1, B1.2 |
| B1.4 | Set up SQLite database with activity schema | 🔴 Not Started | 8 | - | - |
| B1.5 | Create rule-based categorization engine | 🔴 Not Started | 10 | - | B1.3, B1.4 |
| B1.6 | Develop REST API for activity data | 🔴 Not Started | 12 | - | B1.4 |

## Detailed Tasks

### B1.1: Implement Activity Tracker using Electron's `desktopCapturer`

**Description:** Create a system to track active windows and applications using Electron's native capabilities.

**Acceptance Criteria:**
- Captures window titles and app names every 1 second
- Detects idle time (no keyboard/mouse input for 5+ minutes)
- Minimal CPU/memory footprint (<5% CPU usage)
- Works across Windows, macOS, and Linux

**Steps:**
1. Use Electron's `desktopCapturer` to get active window information
2. Implement idle detection using input monitoring
3. Create efficient data collection mechanism
4. Add platform-specific optimizations

**Notes:**
- 

### B1.2: Develop browser extension for URL tracking

**Description:** Create browser extensions for Chrome and Firefox to track URLs visited.

**Acceptance Criteria:**
- Extensions work in Chrome and Firefox
- Captures active URLs and tab titles
- Sends data to the desktop app via WebSocket
- Respects private browsing mode (no tracking)
- Minimal performance impact on browser

**Steps:**
1. Create extension using WebExtensions API
2. Implement tab and URL monitoring
3. Set up WebSocket communication with desktop app
4. Add privacy controls and user settings

**Notes:**
- 

### B1.3: Build Event Processor for data normalization

**Description:** Develop a system to process and normalize raw activity data.

**Acceptance Criteria:**
- Processes events in batches every 10 seconds
- Normalizes app names (e.g., "chrome.exe" → "Chrome")
- Merges related activities (e.g., same app within 30 seconds)
- Handles edge cases (crashes, rapid switching)

**Steps:**
1. Create async queue for batch processing
2. Implement normalization rules for app names
3. Develop activity merging algorithm
4. Add error handling and recovery

**Notes:**
- 

### B1.4: Set up SQLite database with activity schema

**Description:** Create and configure the local SQLite database for storing activity data.

**Acceptance Criteria:**
- SQLite database with appropriate schema
- Tables: activities, categories, settings
- AES-256 encryption for sensitive fields (URLs, titles)
- Efficient indexing for quick queries
- Backup/restore functionality

**Steps:**
1. Design database schema
2. Implement SQLite connection with encryption
3. Create indexes for common queries
4. Add backup/restore utilities

**Notes:**
- 

### B1.5: Create rule-based categorization engine

**Description:** Develop a system to automatically categorize activities based on rules.

**Acceptance Criteria:**
- Default rules for common apps/websites
- Custom rule creation and editing
- Pattern matching for URLs and app names
- Category hierarchy (main categories, subcategories)
- Manual override capability

**Steps:**
1. Design rule format and storage
2. Implement pattern matching engine
3. Create default rule set
4. Add custom rule editing functionality

**Notes:**
- 

### B1.6: Develop REST API for activity data

**Description:** Create a REST API for the frontend to access activity data and settings.

**Acceptance Criteria:**
- Endpoints: GET/POST for activities, categories, settings
- JWT authentication for security
- Pagination for large data sets
- Filtering and sorting options
- Proper error handling and status codes

**Steps:**
1. Set up Express.js server
2. Implement JWT authentication
3. Create API endpoints with proper validation
4. Add pagination, filtering, and sorting

**Notes:**
- 