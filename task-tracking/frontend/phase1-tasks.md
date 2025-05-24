# Frontend Tasks - Phase 1: Core Tracking and Categorization

This file tracks frontend tasks for Phase 1 of the ProductivityPro project.

## Task Summary

| ID | Task | Status | Effort (hours) | Assigned To | Dependencies |
|----|------|--------|---------------|-------------|--------------|
| F1.1 | Set up Electron project with React and Tailwind CSS | 🔴 Not Started | 8 | - | - |
| F1.2 | Build Dashboard screen with Activity Timeline widget | 🔴 Not Started | 16 | - | F1.1, B1.8, B1.10 |
| F1.3 | Create Settings screen for tracking preferences | 🔴 Not Started | 12 | - | F1.1 |
| F1.4 | Implement system tray icon with pause/resume tracking | 🔴 Not Started | 8 | - | F1.1 |

## Detailed Tasks

### F1.1: Set up Electron project with React and Tailwind CSS

**Description:** Initialize the Electron project with React for UI components and Tailwind CSS for styling.

**Acceptance Criteria:**
- Electron application runs on Windows, macOS, and Linux
- React components render correctly in the Electron window
- Tailwind CSS is configured for dark/light themes
- Basic navigation structure is in place

**Steps:**
1. Use `create-react-app` and `electron-builder` to set up the project
2. Configure Webpack for Electron main and renderer processes
3. Set up Tailwind CSS with dark/light theme support
4. Create basic layout components (sidebar, header, content area)

**Notes:**
- 

### F1.2: Build Dashboard screen with Activity Timeline widget

**Description:** Create the main Dashboard screen with an Activity Timeline widget showing tracked activities.

**Acceptance Criteria:**
- Dashboard displays a scrollable list of activities (app, duration, category)
- Timeline visualization shows activities over time
- Hover states reveal additional details
- Real-time updates as new activities are tracked

**Steps:**
1. Create Dashboard component with responsive layout
2. Implement Activity Timeline widget using Chart.js
3. Add hover interactions for detailed information
4. Connect to backend API for activity data

**Notes:**
- 

### F1.3: Create Settings screen for tracking preferences

**Description:** Build the Settings screen allowing users to configure tracking preferences.

**Acceptance Criteria:**
- Toggle switches for enabling/disabling tracking features
- Idle detection threshold slider (5-30 minutes)
- App exclusion input field
- Save/cancel buttons with appropriate feedback

**Steps:**
1. Create Settings component with form elements
2. Implement form validation
3. Connect to backend API for saving settings
4. Add success/error notifications

**Notes:**
- 

### F1.4: Implement system tray icon with pause/resume tracking

**Description:** Add a system tray icon with menu options to control tracking.

**Acceptance Criteria:**
- System tray icon shows tracking status (active/paused)
- Menu includes options: Open App, Pause/Resume Tracking, Quit
- Status changes are reflected in the icon appearance
- Clicking the icon opens the app window

**Steps:**
1. Use Electron's `Tray` API to create the system tray icon
2. Design active/paused icon states
3. Implement menu with appropriate actions
4. Connect to backend for tracking control

**Notes:**
- 