"""
Load Sample Data

This script loads sample data for the ML components.
"""

import os
import json
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from activity_classifier import ActivityClassifier
from productivity_predictor import ProductivityPredictor

def load_sample_data():
    """
    Load sample data for the ML components.
    """
    # Load sample activities
    with open(os.path.join(os.path.dirname(__file__), 'sample_activities.json'), 'r') as f:
        activities = json.load(f)
    
    # Extract activities and categories for classifier
    classifier_activities = [{'app': a['app'], 'title': a['title']} for a in activities]
    categories = [a['category'] for a in activities]
    
    # Train the classifier
    classifier = ActivityClassifier()
    accuracy = classifier.train(classifier_activities, categories)
    print(f'Classifier trained with accuracy: {accuracy:.2f}')
    
    # Create activity lists for predictor
    # Split activities into 3 days
    activities_list = [
        activities[:5],
        activities[5:10],
        activities[10:]
    ]
    
    # Calculate productivity scores based on productive time percentage
    scores = []
    for day_activities in activities_list:
        total_duration = sum(a['duration'] for a in day_activities)
        productive_duration = sum(a['duration'] for a in day_activities if a['category'] == 'productive')
        score = (productive_duration / total_duration) * 100 if total_duration > 0 else 50
        scores.append(score)
    
    # Train the predictor
    predictor = ProductivityPredictor()
    r2_score = predictor.train(activities_list, scores)
    print(f'Predictor trained with R^2 score: {r2_score:.2f}')
    
    print('Sample data loaded successfully!')

if __name__ == '__main__':
    load_sample_data()