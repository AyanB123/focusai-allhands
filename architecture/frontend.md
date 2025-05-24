# Frontend Architecture

## Overview

The ProductivityPro frontend is built using Electron and React, providing a cross-platform desktop application with a modern, responsive user interface. The frontend architecture is designed to be modular, maintainable, and accessible, with support for internationalization and customization.

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **React**: UI library for component-based development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Chart.js**: Data visualization library
- **D3.js**: Advanced visualization for workflow graphs
- **React Router**: Client-side routing
- **React-i18next**: Internationalization
- **Framer Motion**: Animation library
- **Electron Store**: Persistent settings storage
- **React Testing Library**: Component testing

## Architecture Principles

1. **Component-Based Design**: UI elements are broken down into reusable components
2. **Unidirectional Data Flow**: State flows down, actions flow up
3. **Separation of Concerns**: UI components separate from business logic
4. **Accessibility First**: WCAG 2.1 AA compliance built-in from the start
5. **Internationalization**: Support for multiple languages throughout the application
6. **Responsive Design**: Adapts to different window sizes and display configurations
7. **Theme Support**: Light and dark mode with customizable accent colors

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/           # Shared components (buttons, inputs, etc.)
│   ├── dashboard/        # Dashboard-specific components
│   ├── analytics/        # Analytics-specific components
│   ├── workflow/         # Workflow-specific components
│   ├── chat/             # Chat assistant components
│   ├── focus/            # Focus mode components
│   └── settings/         # Settings components
├── contexts/             # React contexts for state management
├── hooks/                # Custom React hooks
├── pages/                # Top-level page components
├── services/             # Frontend services (API client, WebSocket)
├── utils/                # Utility functions
├── i18n/                 # Internationalization resources
│   ├── en/               # English translations
│   ├── es/               # Spanish translations
│   └── zh/               # Mandarin translations
├── styles/               # Global styles and Tailwind configuration
├── electron/             # Electron-specific code
│   ├── main.js           # Main process entry point
│   ├── preload.js        # Preload script for IPC
│   └── tray.js           # System tray implementation
└── App.jsx               # Main React component
```

## Component Architecture

### Core Components

1. **App**: Root component that sets up routing, contexts, and global state
2. **MainLayout**: Layout wrapper with navigation and common UI elements
3. **Dashboard**: Main view with activity timeline and summary statistics
4. **Analytics**: Detailed analysis of productivity patterns
5. **Workflow**: Graph visualization of application usage patterns
6. **ChatAssistant**: AI-powered chat interface for productivity insights
7. **FocusMode**: Distraction-blocking overlay with timer and controls
8. **Settings**: Application configuration and preferences

### Component Hierarchy

```
App
├── MainLayout
│   ├── Sidebar
│   ├── Header
│   └── Content
│       ├── Dashboard
│       │   ├── ActivityTimeline
│       │   ├── ProductivitySummary
│       │   ├── CategoryBreakdown
│       │   └── RecentActivities
│       ├── Analytics
│       │   ├── ProductivityTrends
│       │   ├── PatternHeatmap
│       │   ├── CategoryAnalysis
│       │   └── TimeDistribution
│       ├── Workflow
│       │   ├── WorkflowGraph
│       │   ├── DistractionAnalysis
│       │   └── ScenarioSimulator
│       ├── ChatAssistant
│       │   ├── ChatInterface
│       │   ├── SuggestionCards
│       │   └── VoiceInput
│       ├── FocusMode
│       │   ├── Timer
│       │   ├── MusicPlayer
│       │   └── BlockedApps
│       └── Settings
│           ├── GeneralSettings
│           ├── TrackingSettings
│           ├── IntegrationSettings
│           ├── ThemeSettings
│           ├── LanguageSettings
│           └── PrivacySettings
└── Onboarding (first launch)
    ├── WelcomeScreen
    ├── TrackingSetup
    └── DashboardIntro
```

## State Management

ProductivityPro uses a combination of React Context and local component state:

1. **AppContext**: Global application state
   - Current user
   - Theme settings
   - Language preference
   - Application status

2. **ActivityContext**: Activity tracking state
   - Current activity
   - Tracking status (active/paused)
   - Recent activities

3. **SettingsContext**: User preferences
   - Tracking preferences
   - UI customization
   - Integration settings

4. **AIContext**: AI model state
   - Model status
   - Inference results
   - Suggestion cache

## Data Flow

1. **Activity Tracking**:
   ```
   Activity Tracker (Backend) → IPC → Activity Service → ActivityContext → UI Components
   ```

2. **User Interactions**:
   ```
   UI Components → Event Handlers → Context Actions → Services → IPC → Backend
   ```

3. **AI Insights**:
   ```
   AI Models (Backend) → API/WebSocket → AI Service → AIContext → UI Components
   ```

4. **Settings Changes**:
   ```
   Settings Components → SettingsContext → Settings Service → Electron Store/IPC → Backend
   ```

## Communication with Backend

The frontend communicates with the backend through several mechanisms:

1. **IPC (Inter-Process Communication)**:
   - Direct communication between Electron renderer and main processes
   - Used for system-level operations (window management, tray, notifications)

2. **REST API**:
   - HTTP endpoints for CRUD operations
   - Served by Express.js running in the Electron main process

3. **WebSocket**:
   - Real-time updates for activity tracking
   - Live AI insights and suggestions

4. **Electron Store**:
   - Persistent storage for settings and preferences
   - Encrypted storage for sensitive information

## UI Design System

ProductivityPro implements a consistent design system:

1. **Colors**:
   - Primary: Brand color with light/dark variants
   - Secondary: Accent color for highlights
   - Neutral: Gray scale for text and backgrounds
   - Semantic: Success, warning, error, info

2. **Typography**:
   - Font family: System fonts with fallbacks
   - Scale: 0.75rem to 2.5rem with consistent ratios
   - Weights: Regular (400), Medium (500), Bold (700)

3. **Components**:
   - Buttons: Primary, secondary, text, icon
   - Inputs: Text, select, checkbox, radio, toggle
   - Cards: Standard, interactive, stat
   - Charts: Line, bar, pie, heatmap
   - Modals: Standard, confirmation, form

4. **Spacing**:
   - 0.25rem to 8rem with consistent scale
   - Responsive spacing based on viewport

5. **Animations**:
   - Transitions: 150ms to 300ms duration
   - Easing: Ease-in-out for most transitions
   - Motion: Subtle movements for feedback

## Accessibility Features

ProductivityPro is designed to be accessible to all users:

1. **Screen Reader Support**:
   - ARIA attributes on all interactive elements
   - Semantic HTML structure
   - Meaningful alt text for images

2. **Keyboard Navigation**:
   - Focus indicators for all interactive elements
   - Logical tab order
   - Keyboard shortcuts for common actions

3. **Color Contrast**:
   - WCAG 2.1 AA compliant contrast ratios
   - High-contrast mode option
   - Color not used as the only means of conveying information

4. **Reduced Motion**:
   - Respects user's reduced motion preference
   - Alternative non-animated UI when needed

5. **Text Sizing**:
   - Responsive text that scales with user preferences
   - No fixed font sizes that prevent zooming

## Internationalization (i18n)

The application supports multiple languages:

1. **Translation System**:
   - React-i18next for component-level translations
   - Namespaced translation files
   - Dynamic loading of language resources

2. **Supported Languages**:
   - English (default)
   - Spanish
   - Mandarin Chinese

3. **Translation Coverage**:
   - UI elements and labels
   - Error messages and notifications
   - AI-generated content
   - Documentation and help

4. **RTL Support**:
   - Layout adjustments for right-to-left languages
   - Bidirectional text handling

## Performance Optimizations

Several strategies ensure optimal frontend performance:

1. **Code Splitting**:
   - Lazy loading of routes and heavy components
   - Dynamic import of non-critical resources

2. **Memoization**:
   - React.memo for expensive components
   - useMemo and useCallback for computed values and handlers

3. **Virtualization**:
   - Virtual lists for long activity timelines
   - Windowing for large datasets

4. **Asset Optimization**:
   - Image compression and appropriate formats
   - SVG for icons and simple illustrations
   - Font subsetting

5. **Rendering Optimization**:
   - Throttling of real-time updates
   - Debouncing of user input handlers
   - Skeleton screens for loading states

## Testing Strategy

The frontend implements a comprehensive testing approach:

1. **Unit Tests**:
   - Individual component testing
   - Utility function validation
   - Context and hook testing

2. **Integration Tests**:
   - Component interaction testing
   - Form submission flows
   - Context provider integration

3. **End-to-End Tests**:
   - Critical user journeys
   - Cross-platform verification
   - Accessibility testing

4. **Visual Regression Tests**:
   - UI component appearance
   - Theme switching
   - Responsive layout

## Build and Packaging

The frontend build process includes:

1. **Development**:
   - Hot module replacement
   - Source maps
   - Development tools and logging

2. **Production**:
   - Minification and tree shaking
   - Code splitting and lazy loading
   - Asset optimization

3. **Packaging**:
   - Electron Builder for creating installers
   - Platform-specific builds (Windows, macOS, Linux)
   - Auto-update mechanism

4. **Distribution**:
   - Code signing for security
   - Update server configuration
   - Installation analytics (opt-in)

## Future Enhancements

Planned improvements to the frontend architecture:

1. **Performance**:
   - Web Worker offloading for intensive operations
   - SharedArrayBuffer for efficient data sharing
   - WebAssembly for performance-critical functions

2. **UI/UX**:
   - Advanced animations and micro-interactions
   - Expanded theme customization
   - Additional visualization types

3. **Accessibility**:
   - WCAG 2.1 AAA compliance
   - Expanded screen reader optimizations
   - Additional input method support

4. **Offline Support**:
   - Improved offline functionality
   - Background sync for intermittent connectivity
   - Progressive enhancement of features