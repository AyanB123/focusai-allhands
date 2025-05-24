import os
import sys
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.activity_classifier import ActivityClassifier

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the activity classifier model
model_path = os.path.join(os.path.dirname(__file__), 'models/activity_classifier_model.pkl')

# Check if model exists, if not, train it
if not os.path.exists(model_path):
    from models.activity_classifier import train_and_save_model
    train_and_save_model(model_path)

# Load the model
classifier = ActivityClassifier(model_path)

# Store activity data
activities = []

@app.route('/api/classify', methods=['POST'])
def classify_activity():
    """
    Classify an application activity.
    
    Request body:
    {
        "app_name": "Visual Studio Code",
        "timestamp": "2025-05-23T10:30:00.000Z"
    }
    
    Returns:
    {
        "category": "productive",
        "confidence": 0.95,
        "probabilities": {
            "productive": 0.95,
            "neutral": 0.03,
            "distracting": 0.02
        }
    }
    """
    data = request.json
    
    if not data or 'app_name' not in data:
        return jsonify({'error': 'Missing app_name parameter'}), 400
    
    app_name = data['app_name']
    timestamp = data.get('timestamp', None)
    
    # Classify the activity
    category = classifier.predict(app_name)
    probas = classifier.predict_proba(app_name)
    
    # Store the activity
    if timestamp:
        activities.append({
            'app_name': app_name,
            'timestamp': timestamp,
            'category': category
        })
    
    # Return the classification result
    result = {
        'category': category,
        'confidence': probas[category],
        'probabilities': probas
    }
    
    return jsonify(result)

@app.route('/api/activities', methods=['GET'])
def get_activities():
    """
    Get all stored activities.
    
    Returns:
    {
        "activities": [
            {
                "app_name": "Visual Studio Code",
                "timestamp": "2025-05-23T10:30:00.000Z",
                "category": "productive"
            },
            ...
        ]
    }
    """
    return jsonify({'activities': activities})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Get activity statistics.
    
    Returns:
    {
        "total_activities": 100,
        "categories": {
            "productive": 60,
            "neutral": 30,
            "distracting": 10
        },
        "productivity_score": 75,
        "most_used_apps": [
            {"app_name": "Visual Studio Code", "count": 25},
            {"app_name": "Google Chrome", "count": 20},
            ...
        ]
    }
    """
    if not activities:
        return jsonify({
            'total_activities': 0,
            'categories': {'productive': 0, 'neutral': 0, 'distracting': 0},
            'productivity_score': 0,
            'most_used_apps': []
        })
    
    # Convert to DataFrame for easier analysis
    df = pd.DataFrame(activities)
    
    # Count activities by category
    category_counts = df['category'].value_counts().to_dict()
    
    # Ensure all categories are present
    for category in ['productive', 'neutral', 'distracting']:
        if category not in category_counts:
            category_counts[category] = 0
    
    # Calculate productivity score (0-100)
    total = len(activities)
    productivity_score = int((
        category_counts['productive'] * 100 + 
        category_counts['neutral'] * 50
    ) / (total * 100) * 100)
    
    # Get most used apps
    most_used_apps = df['app_name'].value_counts().head(5).reset_index()
    most_used_apps.columns = ['app_name', 'count']
    most_used_apps = most_used_apps.to_dict('records')
    
    result = {
        'total_activities': total,
        'categories': category_counts,
        'productivity_score': productivity_score,
        'most_used_apps': most_used_apps
    }
    
    return jsonify(result)

@app.route('/api/recategorize', methods=['POST'])
def recategorize_activity():
    """
    Recategorize an activity.
    
    Request body:
    {
        "timestamp": "2025-05-23T10:30:00.000Z",
        "new_category": "productive"
    }
    
    Returns:
    {
        "success": true,
        "message": "Activity recategorized successfully"
    }
    """
    data = request.json
    
    if not data or 'timestamp' not in data or 'new_category' not in data:
        return jsonify({'error': 'Missing parameters'}), 400
    
    timestamp = data['timestamp']
    new_category = data['new_category']
    
    # Find and update the activity
    for activity in activities:
        if activity['timestamp'] == timestamp:
            activity['category'] = new_category
            return jsonify({
                'success': True,
                'message': 'Activity recategorized successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'Activity not found'
    }), 404

@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Train the model with new data.
    
    Request body:
    {
        "app_names": ["Visual Studio Code", "YouTube", ...],
        "categories": ["productive", "distracting", ...]
    }
    
    Returns:
    {
        "success": true,
        "accuracy": 0.95,
        "message": "Model trained successfully"
    }
    """
    data = request.json
    
    if not data or 'app_names' not in data or 'categories' not in data:
        return jsonify({'error': 'Missing parameters'}), 400
    
    app_names = data['app_names']
    categories = data['categories']
    
    if len(app_names) != len(categories):
        return jsonify({'error': 'app_names and categories must have the same length'}), 400
    
    # Train the model
    accuracy = classifier.train(app_names, categories)
    
    # Save the model
    classifier.save(model_path)
    
    return jsonify({
        'success': True,
        'accuracy': accuracy,
        'message': 'Model trained successfully'
    })

if __name__ == '__main__':
    # Get port from command line arguments or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=port, debug=True)