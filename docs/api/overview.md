# API Overview

ProductivityPro provides a comprehensive set of APIs to enable data access, integrations, and extensions. This document provides an overview of the API architecture, components, and design principles.

## API Architecture

ProductivityPro's API architecture consists of several components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Frontend       │────▶│  API Server     │────▶│  Backend        │
│  (Electron/React)│     │  (Express.js)   │     │  Services       │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │  ▲
                               │  │
                               ▼  │
                        ┌─────────────────┐
                        │                 │
                        │  AI Pipeline    │
                        │  (Python/FastAPI)│
                        │                 │
                        └─────────────────┘
```

### Components

1. **API Server**: Express.js-based REST API server that handles requests from the frontend and external integrations.
2. **WebSocket Server**: Real-time communication server for activity updates and notifications.
3. **AI Bridge**: FastAPI-based server that exposes AI model endpoints for inference and training.
4. **Integration Connectors**: Adapters for third-party services like Google Calendar, Trello, and Outlook.

## API Types

ProductivityPro offers several types of APIs:

### 1. REST API

The REST API provides CRUD operations for ProductivityPro resources:

- **Activities**: Track, categorize, and query user activities
- **Settings**: Manage user preferences and configurations
- **Analytics**: Generate and retrieve productivity reports
- **Tasks**: Create, update, and manage scheduled tasks
- **Projects**: Organize activities and tasks into projects

All REST endpoints follow standard HTTP methods (GET, POST, PUT, DELETE) and return JSON responses.

### 2. WebSocket API

The WebSocket API enables real-time updates and notifications:

- **Activity Stream**: Real-time updates of user activities
- **Focus Score**: Live updates of productivity metrics
- **Notifications**: System and AI-generated notifications
- **Chat**: Real-time communication with the AI assistant

WebSocket connections use a subscription model where clients can subscribe to specific event types.

### 3. AI API

The AI API exposes endpoints for the five neural networks:

- **Transformer**: Context-aware chat assistant
- **GNN**: Workflow relationship analysis
- **LSTM**: Predictive scheduling
- **CNN**: Activity pattern recognition
- **GAN**: Synthetic productivity scenarios

These endpoints are primarily used internally but may be exposed for advanced integrations.

### 4. Integration API

The Integration API allows third-party services to connect with ProductivityPro:

- **Calendar**: Sync with Google Calendar and Outlook
- **Task Management**: Integrate with Trello and similar services
- **Browser Extensions**: Connect with Chrome and Firefox extensions

## Authentication and Authorization

ProductivityPro uses OAuth 2.0 for authentication and JWT (JSON Web Tokens) for authorization:

1. **Authentication Flow**:
   - User logs in via username/password or OAuth provider
   - Server issues JWT access and refresh tokens
   - Tokens are stored securely in the Electron app

2. **Authorization**:
   - JWT tokens include user ID and permission scopes
   - API endpoints verify token validity and permission scopes
   - Rate limiting is applied based on user tier

See the [Authentication](authentication.md) document for detailed information.

## API Versioning

ProductivityPro uses URL-based versioning for all APIs:

- REST API: `/api/v1/resource`
- WebSocket API: `/ws/v1/event-type`
- AI API: `/ai/v1/model-name`

This ensures backward compatibility as the API evolves.

## Error Handling

All APIs use consistent error handling:

- HTTP status codes for REST API errors
- Error objects with `code`, `message`, and `details` fields
- Internationalized error messages based on user language preference

Example error response:

```json
{
  "error": {
    "code": "invalid_parameter",
    "message": "The provided parameter is invalid",
    "details": "Duration must be a positive integer"
  }
}
```

## Rate Limiting

To ensure system stability, API endpoints are rate-limited:

- Standard tier: 100 requests/minute
- Premium tier: 300 requests/minute
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Remaining requests in the current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## API Documentation

Detailed documentation for each API is available:

- [REST API](rest-api.md): Comprehensive documentation of all REST endpoints
- [WebSocket API](websocket-api.md): WebSocket event types and message formats
- [Integration APIs](integration/README.md): Third-party integration points

## OpenAPI/Swagger Specifications

ProductivityPro provides OpenAPI (formerly Swagger) specifications for all REST APIs:

- OpenAPI JSON: `/api/v1/swagger.json`
- Swagger UI: `/api/v1/docs` (development environment only)

These specifications can be imported into API tools like Postman or Swagger UI.

## Example Usage

### REST API Example

```javascript
// Fetch user activities for today
async function fetchTodayActivities() {
  const response = await fetch('http://localhost:3000/api/v1/activities?date=today', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return response.json();
}
```

### WebSocket API Example

```javascript
// Connect to WebSocket and subscribe to focus score updates
const socket = new WebSocket('ws://localhost:3000/ws/v1');

socket.onopen = () => {
  // Subscribe to focus score updates
  socket.send(JSON.stringify({
    type: 'subscribe',
    channel: 'focus_score'
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'focus_score_update') {
    console.log(`New focus score: ${data.score}`);
  }
};
```

## Next Steps

- Explore the [REST API documentation](rest-api.md) for detailed endpoint specifications
- Learn about real-time updates with the [WebSocket API](websocket-api.md)
- Understand how to authenticate with the [Authentication guide](authentication.md)
- Discover integration possibilities with [Integration APIs](integration/README.md)