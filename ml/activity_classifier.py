"""
Activity Classifier

This module classifies activities based on application name and window title.
"""

import os
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib

class ActivityClassifier:
    """
    Classifies activities into productive, neutral, or distracting categories.
    """
    
    def __init__(self, model_path=None):
        """
        Initialize the classifier.
        
        Args:
            model_path (str, optional): Path to a saved model. If None, a new model will be created.
        """
        self.categories = ['productive', 'neutral', 'distracting']
        self.model_path = model_path or os.path.join(os.path.dirname(__file__), 'models', 'activity_classifier.joblib')
        
        # Create a pipeline with TF-IDF vectorizer and Multinomial Naive Bayes classifier
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
            ('clf', MultinomialNB())
        ])
        
        # Load the model if it exists
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
    
    def train(self, activities, categories):
        """
        Train the classifier on a set of activities.
        
        Args:
            activities (list): List of activity strings (application name + window title).
            categories (list): List of category labels for each activity.
            
        Returns:
            float: Accuracy score of the model.
        """
        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            activities, categories, test_size=0.2, random_state=42
        )
        
        # Train the model
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate the model
        accuracy = self.pipeline.score(X_test, y_test)
        
        # Save the model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.pipeline, self.model_path)
        
        return accuracy
    
    def predict(self, activity):
        """
        Predict the category of an activity.
        
        Args:
            activity (str): Activity string (application name + window title).
            
        Returns:
            str: Predicted category ('productive', 'neutral', or 'distracting').
        """
        if not os.path.exists(self.model_path):
            # If no model exists, return a default category
            return 'neutral'
        
        # Predict the category
        prediction = self.pipeline.predict([activity])[0]
        
        return prediction
    
    def predict_proba(self, activity):
        """
        Predict the probability of each category for an activity.
        
        Args:
            activity (str): Activity string (application name + window title).
            
        Returns:
            dict: Dictionary mapping categories to probabilities.
        """
        if not os.path.exists(self.model_path):
            # If no model exists, return equal probabilities
            return {category: 1/len(self.categories) for category in self.categories}
        
        # Predict the probabilities
        probas = self.pipeline.predict_proba([activity])[0]
        
        # Map probabilities to categories
        return {category: float(proba) for category, proba in zip(self.pipeline.classes_, probas)}
    
    def save(self):
        """
        Save the model to disk.
        """
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.pipeline, self.model_path)
    
    def load(self):
        """
        Load the model from disk.
        
        Returns:
            bool: True if the model was loaded successfully, False otherwise.
        """
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
            return True
        return False


if __name__ == '__main__':
    # Example usage
    classifier = ActivityClassifier()
    
    # Example training data
    activities = [
        'Visual Studio Code - index.js',
        'Terminal - bash',
        'Chrome - GitHub',
        'Chrome - Stack Overflow',
        'Chrome - YouTube',
        'Chrome - Facebook',
        'Slack - general',
        'Outlook - Inbox',
        'Word - Document1',
        'Excel - Book1',
        'PowerPoint - Presentation1',
        'Chrome - Netflix',
        'Chrome - Twitter',
        'Chrome - Instagram',
        'Spotify - Now Playing',
        'Steam - Library',
    ]
    
    categories = [
        'productive',
        'productive',
        'productive',
        'productive',
        'distracting',
        'distracting',
        'neutral',
        'neutral',
        'productive',
        'productive',
        'productive',
        'distracting',
        'distracting',
        'distracting',
        'neutral',
        'distracting',
    ]
    
    # Train the model
    accuracy = classifier.train(activities, categories)
    print(f'Model accuracy: {accuracy:.2f}')
    
    # Make predictions
    test_activities = [
        'Visual Studio Code - main.js',
        'Chrome - YouTube',
        'Slack - random',
    ]
    
    for activity in test_activities:
        category = classifier.predict(activity)
        probas = classifier.predict_proba(activity)
        print(f'Activity: {activity}')
        print(f'Predicted category: {category}')
        print(f'Probabilities: {probas}')
        print()