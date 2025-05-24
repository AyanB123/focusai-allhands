# Phase 1: Core Tracking and Categorization

**Goal**: Build the foundation with activity tracking, categorization, and basic dashboard.
**Duration**: 3 months
**Team**: 2 frontend developers, 2 backend developers, 1 DevOps engineer

## User Stories

1. **As a user**, I want automatic tracking of my app and website usage so I can understand how I spend my time.
   - **Acceptance Criteria**:
     - App tracks active window title and process name every 5 seconds.
     - Browser extension tracks active URL and tab title.
     - Idle detection after 2 minutes of inactivity.
     - Data stored locally in SQLite database.

2. **As a user**, I want my activities categorized (e.g., Work, Social, Entertainment) so I can see time distribution.
   - **Acceptance Criteria**:
     - Rule-based categorization for common apps/sites.
     - Manual category assignment for uncategorized activities.
     - Custom category creation and editing.
     - Category color coding and icons.

3. **As a user**, I want a dashboard with daily activity timeline and summary so I can visualize my day.
   - **Acceptance Criteria**:
     - Timeline showing app/site usage with color-coded categories.
     - Daily summary with top apps/sites and category breakdown.
     - Time range selector (today, yesterday, this week).
     - System tray icon with current activity.

4. **As a user**, I want to configure tracking preferences so I can exclude personal/sensitive apps.
   - **Acceptance Criteria**:
     - Blacklist for apps/sites to never track.
     - Pause/resume tracking from system tray.
     - Option to exclude specific time periods.
     - Data retention settings (e.g., delete after 30 days).

## Tasks

### Frontend Tasks

- **T1.1**: Build Dashboard UI with Timeline (16h, Component: Dashboard)
  - Create React component for activity timeline.
  - Implement time range selector (today, yesterday, this week).
  - Add category color coding and tooltips.
  - Connect to API for activity data.

- **T1.2**: Implement Daily Summary Widget (12h, Component: Dashboard)
  - Create pie chart for category breakdown.
  - Add bar chart for top apps/sites.
  - Implement refresh mechanism (auto-refresh every 5 minutes).

- **T1.3**: Create Settings Screen (10h, Component: Settings)
  - Build form for tracking preferences.
  - Implement app/site blacklist management.
  - Add data retention controls.
  - Create category management UI.

- **T1.4**: Develop System Tray Component (8h, Component: System Tray)
  - Create system tray icon with current activity.
  - Add pause/resume tracking toggle.
  - Implement quick access menu to dashboard and settings.

### Backend Tasks

- **T1.5**: Implement Activity Tracker (20h, Component: Activity Tracker)
  - Develop native module for window/process tracking.
  - Implement idle detection logic.
  - Create browser extension for URL tracking.
  - Set up 5-second polling interval.

- **T1.6**: Build Event Processor (16h, Component: Event Processor)
  - Create data normalization pipeline.
  - Implement rule-based categorization engine.
  - Develop storage mechanism for SQLite.
  - Add data retention enforcement.

- **T1.7**: Create REST API (12h, Component: API Server)
  - Implement endpoints for activity data.
  - Add endpoints for categories and settings.
  - Create WebSocket for real-time updates.
  - Add authentication for browser extension.

### DevOps Tasks

- **T1.8**: Set up Development Environment (8h, Component: CI/CD)
  - Configure Electron with React and Node.js.
  - Set up SQLite database schema.
  - Create development scripts (start, build, test).

- **T1.9**: Implement Automated Testing (12h, Component: Testing)
  - Set up Jest for frontend testing.
  - Configure Mocha for backend testing.
  - Create test fixtures and mocks.
  - Implement CI pipeline with GitHub Actions.

- **T1.10**: Create Installer Package (10h, Component: Deployment)
  - Configure Electron Builder for Windows/macOS/Linux.
  - Set up auto-launch on startup option.
  - Implement silent installation mode.
  - Create uninstaller with data retention option.

- **T1.11**: Write Documentation (8h, Component: Documentation)
  - Document API endpoints.
  - Create developer setup guide.
  - Write user installation instructions.
  - Document database schema.

## Dependencies

- T1.1, T1.2 → T1.7 (Dashboard needs API)
- T1.3 → T1.7 (Settings needs API)
- T1.4 → T1.5 (System Tray needs Activity Tracker)
- T1.6 → T1.5 (Event Processor needs Activity Tracker)
- T1.7 → T1.6 (API needs Event Processor)
- T1.10 → T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7 (Installer needs all components)

## Deliverables

- Functional desktop app with activity tracking
- Browser extension for URL tracking
- Dashboard with timeline and summary
- Settings screen with tracking preferences
- System tray component with quick actions
- Installer package for Windows/macOS/Linux
- API documentation and developer guide

## Kanban Categories

- **Frontend**: T1.1, T1.2, T1.3, T1.4
- **Backend**: T1.5, T1.6, T1.7
- **DevOps**: T1.8, T1.9, T1.10, T1.11

## Branch Structure

- Feature branches: `feature/phase1-frontend`, `feature/phase1-backend`, `feature/phase1-devops`
- Task branches: `feature/t1.1-dashboard-timeline`, `feature/t1.5-activity-tracker`, etc.
- Merge to `develop` branch after review
- Release to `main` branch at phase completion