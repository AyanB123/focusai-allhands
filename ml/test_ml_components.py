"""
Test ML Components

This script tests the ML components.
"""

import os
import json
import sys

from activity_classifier import ActivityClassifier
from productivity_predictor import ProductivityPredictor
from recommendation_engine import RecommendationEngine

def test_activity_classifier():
    """
    Test the activity classifier.
    """
    print('\n=== Testing Activity Classifier ===')
    
    # Create a classifier
    classifier = ActivityClassifier()
    
    # Test activities
    test_activities = [
        {'app': 'Visual Studio Code', 'title': 'index.js - project'},
        {'app': 'Chrome', 'title': 'YouTube - Music'},
        {'app': 'Chrome', 'title': 'Facebook'},
        {'app': 'Terminal', 'title': 'bash'},
        {'app': 'Chrome', 'title': 'Netflix'},
    ]
    
    # Classify activities
    for activity in test_activities:
        result = classifier.classify(activity)
        print(f"Activity: {activity['app']} - {activity['title']}")
        print(f"Category: {result['category']}")
        print(f"Probabilities: {result['probabilities']}")
        print()

def test_productivity_predictor():
    """
    Test the productivity predictor.
    """
    print('\n=== Testing Productivity Predictor ===')
    
    # Create a predictor
    predictor = ProductivityPredictor()
    
    # Load sample activities
    with open(os.path.join(os.path.dirname(__file__), 'data', 'sample_activities.json'), 'r') as f:
        activities = json.load(f)
    
    # Test prediction
    score = predictor.predict(activities)
    print(f"Predicted productivity score: {score:.2f}")
    
    # Test with different activity sets
    productive_activities = [a for a in activities if a['category'] == 'productive']
    distracting_activities = [a for a in activities if a['category'] == 'distracting']
    
    productive_score = predictor.predict(productive_activities)
    distracting_score = predictor.predict(distracting_activities)
    
    print(f"Productive activities score: {productive_score:.2f}")
    print(f"Distracting activities score: {distracting_score:.2f}")

def test_recommendation_engine():
    """
    Test the recommendation engine.
    """
    print('\n=== Testing Recommendation Engine ===')
    
    # Create a recommendation engine
    engine = RecommendationEngine()
    
    # Load sample activities
    with open(os.path.join(os.path.dirname(__file__), 'data', 'sample_activities.json'), 'r') as f:
        activities = json.load(f)
    
    # Generate recommendations
    recommendations = engine.generate_recommendations(activities, max_recommendations=5)
    
    # Print recommendations
    print(f"Generated {len(recommendations)} recommendations:")
    for i, recommendation in enumerate(recommendations):
        print(f"{i+1}. {recommendation['recommendation']}")
        print(f"   Type: {recommendation['type']}")
        print()

if __name__ == '__main__':
    # Test the activity classifier
    test_activity_classifier()
    
    # Test the productivity predictor
    test_productivity_predictor()
    
    # Test the recommendation engine
    test_recommendation_engine()