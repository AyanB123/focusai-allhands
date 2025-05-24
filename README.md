# ProductivityPro

An AI-powered productivity tracking and optimization application built with Electron and React.

## Features

- **Activity Tracking**: Automatically tracks your computer usage and categorizes activities
- **Productivity Analytics**: Visualizes your productivity patterns with detailed charts and statistics
- **Smart Suggestions**: Provides AI-powered recommendations to improve your productivity
- **Customizable Settings**: Tailor the application to your specific workflow and preferences
- **Machine Learning Integration**: Uses ML to classify activities and predict productivity scores
- **Data Import/Export**: Easily backup and restore your productivity data

## Tech Stack

- **Frontend**: React, Redux, React Router
- **Backend**: Electron (Node.js)
- **Data Visualization**: Chart.js
- **Machine Learning**: Python with scikit-learn
- **Data Storage**: electron-store
- **Packaging**: Electron Forge

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Python 3.8+ (for ML components)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/AyanB123/focusai-allhands.git
   cd productivitypro
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Python dependencies for ML components:
   ```
   npm run ml:install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Start the ML server (in a separate terminal):
   ```
   npm run ml:start
   ```

### Building

To create a production build:

```
npm run make
```

This will generate platform-specific distributables in the `out` directory.

## Project Structure

```
productivitypro/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js     # Main entry point
│   │   ├── preload.js  # Preload script for IPC
│   │   ├── store.js    # Data storage
│   │   ├── ipc.js      # IPC handlers
│   │   └── ml-bridge.js # Bridge to ML server
│   ├── renderer/       # React frontend
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── store/      # Redux store
│   │   └── styles/     # CSS styles
│   └── shared/         # Shared code between main and renderer
│       ├── api.js      # API for renderer
│       └── constants/  # Shared constants
├── assets/             # Static assets
└── ml/                 # Machine learning components
    ├── server.py       # ML server
    ├── activity_classifier.py # Activity classification
    ├── productivity_predictor.py # Productivity prediction
    └── recommendation_engine.py # Recommendation generation
```

## ML Components

The application includes several machine learning components:

1. **Activity Classifier**: Classifies activities as productive, neutral, or distracting
2. **Productivity Predictor**: Predicts productivity scores based on activity patterns
3. **Recommendation Engine**: Generates personalized productivity recommendations

## IPC Communication

The application uses Electron's IPC (Inter-Process Communication) for communication between the main process and renderer process. The ML components are accessed through a Python server that communicates with the Electron app via HTTP.

## License

MIT
