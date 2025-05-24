# Machine Learning Components

This directory contains the machine learning components for the ProductivityPro application.

## Setup

1. Create a Python virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Components

- `activity_classifier.py` - Classifies activities based on application name and window title
- `productivity_predictor.py` - Predicts productivity score based on activity patterns
- `recommendation_engine.py` - Generates productivity improvement recommendations
- `server.py` - HTTP server for ML components
- `models/` - Directory for trained models
- `data/` - Directory for training and test data

## Usage

The ML components are called from the main Electron application through a Python bridge. The bridge uses a simple HTTP server to communicate between the Electron app and the Python scripts.

To start the ML server:
```
python server.py
```

This will start a server on port 5000 that the Electron app can communicate with.

## API Endpoints

The ML server provides the following API endpoints:

### Activity Classification

- **POST /classify**
  - Request: `{ "app": "Chrome", "title": "YouTube" }`
  - Response: `{ "category": "distracting", "probabilities": { "productive": 0.1, "neutral": 0.2, "distracting": 0.7 } }`

- **POST /train**
  - Request: `{ "activities": [{ "app": "Chrome", "title": "YouTube" }, ...], "categories": ["distracting", ...] }`
  - Response: `{ "accuracy": 0.85 }`

### Productivity Prediction

- **POST /predict-productivity**
  - Request: `{ "activities": [{ "app": "Chrome", "title": "YouTube", "category": "distracting", "duration": 1800, "timestamp": "2023-01-01T10:00:00Z" }, ...] }`
  - Response: `{ "score": 75.5 }`

- **POST /train-predictor**
  - Request: `{ "activities_list": [[{ "app": "Chrome", "title": "YouTube", "category": "distracting", "duration": 1800, "timestamp": "2023-01-01T10:00:00Z" }, ...], ...], "scores": [75.5, ...] }`
  - Response: `{ "r2_score": 0.85 }`

### Recommendations

- **POST /recommendations**
  - Request: `{ "activities": [{ "app": "Chrome", "title": "YouTube", "category": "distracting", "duration": 1800, "timestamp": "2023-01-01T10:00:00Z" }, ...], "max_recommendations": 3 }`
  - Response: `{ "recommendations": [{ "type": "distracting_apps", "app": "Chrome", "duration": 30, "recommendation": "Consider limiting your time on Chrome to improve productivity." }, ...] }`

## Model Training

The ML components use scikit-learn for model training and prediction. The models are trained on user data and saved to the `models/` directory. The models are loaded when the server starts.

## Data Format

The ML components expect activities in the following format:

```json
{
  "app": "Chrome",
  "title": "YouTube",
  "category": "distracting",
  "duration": 1800,
  "timestamp": "2023-01-01T10:00:00Z"
}
```

Where:
- `app` is the application name
- `title` is the window title
- `category` is one of "productive", "neutral", or "distracting"
- `duration` is the duration in seconds
- `timestamp` is the ISO 8601 timestamp