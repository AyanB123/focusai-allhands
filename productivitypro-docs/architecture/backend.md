# Backend Architecture

## Overview

The ProductivityPro backend is built on Node.js and Electron, providing a robust foundation for activity tracking, data processing, and AI model integration. The architecture is designed to be efficient, secure, and privacy-focused, with all processing happening locally on the user's device.

## Technology Stack

- **Node.js**: JavaScript runtime for backend logic
- **Electron**: Framework for cross-platform desktop applications
- **Express.js**: Web server for API endpoints
- **SQLite**: Local database for activity storage
- **WebSocket**: Real-time communication
- **Python**: AI/ML model execution environment
- **node-ipc**: Inter-process communication
- **node-ffi-napi**: Foreign function interface for native code integration
- **Sequelize**: ORM for database operations
- **Bull**: Job queue for background processing

## Architecture Principles

1. **Privacy by Design**: All data stays on the user's device by default
2. **Efficiency**: Optimized for desktop performance with minimal resource usage
3. **Modularity**: Loosely coupled components for maintainability
4. **Resilience**: Graceful handling of errors and unexpected conditions
5. **Security**: Encryption of sensitive data and secure communication
6. **Extensibility**: Plugin architecture for integrations and extensions
7. **Observability**: Comprehensive logging and diagnostics

## High-Level Architecture

The backend consists of several interconnected components:

```
                                 ┌─────────────────┐
                                 │                 │
                                 │  Electron Main  │
                                 │                 │
                                 └────────┬────────┘
                                          │
                 ┌───────────────────────┼───────────────────────┐
                 │                        │                       │
        ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
        │                 │     │                 │     │                 │
        │ Activity Tracker│     │   API Server    │     │  AI Integration │
        │                 │     │                 │     │                 │
        └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                 │                        │                       │
                 │                ┌───────▼───────┐               │
                 │                │               │               │
                 └───────────────►│   Database    │◄──────────────┘
                                  │               │
                                  └───────────────┘
```

## Component Details

### Electron Main Process

The main process serves as the central coordinator for the application:

- **Window Management**: Creates and manages application windows
- **System Integration**: Handles OS-level features (tray, notifications, auto-start)
- **IPC Coordination**: Manages communication between processes
- **Update Management**: Handles application updates
- **Process Lifecycle**: Manages application startup, shutdown, and crashes

### Activity Tracker

Responsible for monitoring and recording user activity:

- **Window Tracking**: Monitors active windows and applications
- **Browser Integration**: Communicates with browser extensions for URL tracking
- **Idle Detection**: Identifies periods of user inactivity
- **Privacy Filters**: Applies user-defined privacy rules
- **Event Normalization**: Standardizes activity data format

### API Server

Provides a RESTful and WebSocket interface for the frontend:

- **Express.js Server**: Handles HTTP requests
- **WebSocket Server**: Provides real-time updates
- **Route Handlers**: Implements API endpoints
- **Middleware**: Authentication, validation, error handling
- **Rate Limiting**: Prevents excessive resource usage

### Database

Stores all application data with a focus on privacy and efficiency:

- **SQLite**: Embedded database for local storage
- **Encryption**: AES-256 encryption for sensitive data
- **Migrations**: Schema version management
- **Backup**: Automated backup functionality
- **Pruning**: Data retention policies

### AI Integration

Bridges the backend with AI/ML models:

- **Model Management**: Loads and initializes AI models
- **Inference Engine**: Executes model predictions
- **Python Bridge**: Communicates with Python-based models
- **Model Updates**: Handles model versioning and updates
- **Resource Management**: Controls CPU/GPU usage

### Integration Manager

Handles connections with external services:

- **OAuth Handling**: Manages authentication with third-party services
- **API Clients**: Communicates with external APIs
- **Synchronization**: Keeps external data in sync
- **Rate Limiting**: Respects API usage limits
- **Error Handling**: Manages API failures gracefully

## Database Schema

The database uses a normalized schema for efficient storage:

### Core Tables

1. **activities**
   - `id`: Primary key
   - `timestamp`: Start time
   - `duration`: Duration in seconds
   - `app_name`: Application name
   - `window_title`: Window title (encrypted)
   - `url`: URL if applicable (encrypted)
   - `category_id`: Foreign key to categories
   - `productivity_score`: User-defined or AI-assigned score

2. **categories**
   - `id`: Primary key
   - `name`: Category name
   - `color`: Display color
   - `is_productive`: Boolean flag
   - `parent_id`: Self-reference for hierarchy

3. **tags**
   - `id`: Primary key
   - `name`: Tag name

4. **activity_tags** (junction table)
   - `activity_id`: Foreign key to activities
   - `tag_id`: Foreign key to tags

### Configuration Tables

5. **settings**
   - `key`: Setting name
   - `value`: Setting value
   - `user_editable`: Boolean flag

6. **exclusions**
   - `id`: Primary key
   - `pattern`: Regex pattern
   - `type`: Exclusion type (app, url, title)

### Integration Tables

7. **integrations**
   - `id`: Primary key
   - `service`: Service name
   - `auth_data`: Encrypted authentication data
   - `enabled`: Boolean flag

8. **external_tasks**
   - `id`: Primary key
   - `integration_id`: Foreign key to integrations
   - `external_id`: ID in external system
   - `title`: Task title
   - `due_date`: Due date if applicable
   - `completed`: Boolean flag

## Data Flow

### Activity Tracking Flow

1. **Capture**: Activity Tracker monitors active windows and browser activity
2. **Filter**: Apply privacy filters and exclusions
3. **Normalize**: Standardize data format and extract metadata
4. **Categorize**: Apply rule-based or AI categorization
5. **Store**: Save to database with encryption for sensitive fields
6. **Notify**: Send real-time updates via WebSocket

### Analytics Processing Flow

1. **Query**: Retrieve activity data from database
2. **Aggregate**: Group and summarize data
3. **Analyze**: Apply statistical analysis and AI insights
4. **Cache**: Store results for quick access
5. **Serve**: Return processed data via API

### AI Inference Flow

1. **Prepare**: Format input data for model
2. **Execute**: Run inference on appropriate model
3. **Process**: Transform model output to usable format
4. **Store**: Save insights to database if needed
5. **Return**: Provide results via API

## Process Architecture

The backend uses multiple processes for stability and performance:

1. **Main Process**: Electron main process for core functionality
2. **Renderer Process**: Electron renderer for UI
3. **Worker Processes**: Background tasks and heavy processing
4. **Python Process**: AI model execution

Inter-process communication is handled through:
- Electron IPC for renderer-main communication
- Node IPC for worker communication
- Standard I/O and TCP for Python communication

## Security Measures

The backend implements several security features:

1. **Data Encryption**:
   - AES-256 encryption for sensitive data (URLs, titles)
   - Secure key storage using OS keychain

2. **Authentication**:
   - Local authentication for API access
   - OAuth 2.0 for external services

3. **Input Validation**:
   - Schema validation for all API inputs
   - Parameterized queries for database access

4. **Sandboxing**:
   - Electron content security policy
   - Limited permissions for worker processes

5. **Secure Updates**:
   - Code signing for application updates
   - Update verification before installation

## Error Handling

The backend implements a comprehensive error handling strategy:

1. **Error Types**:
   - Operational errors (expected, handled gracefully)
   - Programmer errors (unexpected, crash with recovery)
   - External errors (third-party services, degraded functionality)

2. **Error Handling Patterns**:
   - Try-catch blocks for synchronous code
   - Promise chains with .catch() for async code
   - Error middleware for API requests
   - Global error handlers for uncaught exceptions

3. **Recovery Strategies**:
   - Automatic restart for crashed processes
   - Circuit breakers for external services
   - Graceful degradation of features
   - Data recovery from backups

4. **Logging**:
   - Structured logging with severity levels
   - Contextual information for debugging
   - Rotation and retention policies
   - Privacy-aware logging (no sensitive data)

## Performance Optimizations

Several strategies ensure optimal backend performance:

1. **Database Optimization**:
   - Proper indexing for common queries
   - Connection pooling
   - Query optimization
   - Batch operations

2. **Caching**:
   - In-memory cache for frequent queries
   - Result caching for expensive operations
   - Cache invalidation strategies

3. **Background Processing**:
   - Job queues for non-urgent tasks
   - Batching of similar operations
   - Rate limiting for resource-intensive tasks

4. **Resource Management**:
   - CPU/memory usage monitoring
   - Adaptive resource allocation
   - Throttling under high load

## Integration Capabilities

The backend supports integration with external services:

1. **Calendar Services**:
   - Google Calendar
   - Microsoft Outlook
   - Apple Calendar

2. **Task Management**:
   - Trello
   - Asana
   - Jira

3. **Communication Tools**:
   - Slack
   - Microsoft Teams
   - Discord

4. **Version Control**:
   - GitHub
   - GitLab
   - Bitbucket

Integration is implemented through:
- OAuth 2.0 authentication
- REST API clients
- Webhook receivers
- Periodic synchronization

## Testing Strategy

The backend implements a comprehensive testing approach:

1. **Unit Tests**:
   - Individual function testing
   - Mocked dependencies
   - High coverage targets

2. **Integration Tests**:
   - Component interaction testing
   - Database operations
   - API endpoint validation

3. **End-to-End Tests**:
   - Complete workflows
   - Cross-platform verification
   - Performance benchmarks

4. **Chaos Testing**:
   - Simulated failures
   - Resource constraints
   - Network interruptions

## Deployment and Packaging

The backend is packaged with the Electron application:

1. **Development**:
   - Hot reloading for rapid iteration
   - Development tools and logging
   - Unoptimized for debugging

2. **Production**:
   - Minification and optimization
   - Removal of development dependencies
   - Reduced logging verbosity

3. **Packaging**:
   - Bundled with application
   - Platform-specific optimizations
   - Native dependencies handling

## Future Enhancements

Planned improvements to the backend architecture:

1. **Performance**:
   - WebAssembly for performance-critical functions
   - Improved database query optimization
   - Enhanced caching strategies

2. **Scalability**:
   - Optional cloud synchronization
   - Distributed processing for heavy workloads
   - Improved resource management

3. **Security**:
   - Enhanced encryption options
   - Additional privacy controls
   - Regular security audits

4. **Extensibility**:
   - Plugin system for third-party extensions
   - API expansion for advanced integrations
   - Custom rule engine for automation